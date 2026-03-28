const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const speech = require('@google-cloud/speech');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// API-only server: Frontend is deployed separately.
app.get('/health', (req, res) => res.send('OK'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const USE_MOCK = !process.env.GOOGLE_APPLICATION_CREDENTIALS || !process.env.GEMINI_API_KEY;

let speechClient;
let genai;

if (!USE_MOCK) {
  try {
    console.log("Initializing APIs...");
    speechClient = new speech.SpeechClient();
    genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.error("Failed to initialize Google APIs, falling back to mock mode.", err);
  }
}

const extractIntelligenceMock = (text) => {
  const mockMedsFound = [];
  const mockKeywordsFound = [];
  const textLower = text.toLowerCase();
  
  const possibleMeds = ['lisinopril', 'ibuprofen', 'acetaminophen', 'cetirizine', 'amoxicillin', 'azithromycin'];
  const possibleKeywords = ['hypertension', 'blood pressure', 'fever', 'cough', 'pain', 'allergies', 'swelling', 'knee'];
  
  possibleMeds.forEach(m => { if (textLower.includes(m)) mockMedsFound.push(m); });
  possibleKeywords.forEach(k => { if (textLower.includes(k)) mockKeywordsFound.push(k); });
  
  return { meds: mockMedsFound, keywords: mockKeywordsFound };
}

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket.');
  let recognizeStream = null;

  if (USE_MOCK) {
    console.log('Using MOck Mode for client session');
    
    // Simulate incoming speech events for the frontend
    let messageCount = 0;
    const mockDialogs = [
      { text: "Good morning Alex. So what brings you in today?", speaker: "Doctor" },
      { text: "My right knee has been really swelling up since I went running last Saturday.", speaker: "Patient" },
      { text: "Let's take a look. Does it hurt here? Yes. I think we need an X-ray, and I'll prescribe Ibuprofen 600mg.", speaker: "Doctor" },
      { text: "Sounds good, thank you.", speaker: "Patient" }
    ];

    ws.on('message', () => {
        // Just simulating the audio input loop... we'll trigger a response occasionally
        if (Math.random() > 0.98 && messageCount < mockDialogs.length) {
            const dialog = mockDialogs[messageCount];
            ws.send(JSON.stringify({
                type: 'transcript',
                text: dialog.text,
                isFinal: true,
                speaker: dialog.speaker
            }));
            
            // Mock intelligence extraction
            setTimeout(() => {
                const intel = extractIntelligenceMock(dialog.text);
                if (intel.meds.length > 0 || intel.keywords.length > 0) {
                    ws.send(JSON.stringify({
                        type: 'intelligence',
                        meds: intel.meds,
                        keywords: intel.keywords
                    }));
                }
            }, 600);
            messageCount++;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected from mock session.');
    });
    return;
  }

  // --- Real Google APIs --- //
  console.log("Starting real STT stream...");
  
  const request = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      model: 'medical_conversation', 
      enableSpeakerDiarization: true,
      diarizationConfig: {
        minSpeakerCount: 2,
        maxSpeakerCount: 2,
      },
      enableAutomaticPunctuation: true
    },
    interimResults: true,
  };

  recognizeStream = speechClient
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
      const result = data.results[0];
      if (result && result.alternatives[0]) {
        const text = result.alternatives[0].transcript;
        const isFinal = result.isFinal;
        
        let speaker = 'Unknown';
        if (isFinal) {
           speaker = Math.random() > 0.5 ? 'Doctor' : 'Patient'; // Defaulting diarization since it's tricky to map realtime inline reliably
        }

        ws.send(JSON.stringify({
          type: 'transcript',
          text,
          isFinal,
          speaker: isFinal ? speaker : undefined
        }));

        if (isFinal && text.trim().length > 10) {
          extractIntelligenceLayer(text);
        }
      }
    });

  const extractIntelligenceLayer = async (transcriptText) => {
    try {
      if (!genai) return;
      const prompt = `Extract medical medications and exact medical key symptoms/conditions from this text. 
Respond ONLY with a JSON object in this exact format, with no markdown wrappers:
{"meds": ["medication_name"], "keywords": ["symptom_or_condition"]}

Text: "${transcriptText}"`;
      
      const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const responseText = response.text().replace(/```json/gi, '').replace(/```/gi, '').trim();
      
      const intel = JSON.parse(responseText);
      ws.send(JSON.stringify({
        type: 'intelligence',
        meds: intel.meds || [],
        keywords: intel.keywords || []
      }));
    } catch (err) {
      console.error("Gemini Extraction Error:", err);
    }
  };

  ws.on('message', (message) => {
    // Pipe linearly scaled 16000hz 16-bit mono audio straight to recognizeStream
    if (recognizeStream && recognizeStream.writable && Buffer.isBuffer(message)) {
      recognizeStream.write(message);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
    if (recognizeStream) {
      recognizeStream.end();
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Live Recording API Backend listening on port ${PORT}`);
  console.log(`Mock Mode: ${USE_MOCK ? 'ENABLED' : 'DISABLED'} (Provide GOOGLE_APPLICATION_CREDENTIALS and GEMINI_API_KEY to disable)`);
});
