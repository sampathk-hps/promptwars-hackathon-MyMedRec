import { useState, useRef, useCallback } from 'react';

export interface TranscriptLine {
  id: string;
  speaker?: string;
  text: string;
  isFinal: boolean;
}

export const useLiveRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [detectedMeds, setDetectedMeds] = useState<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const startRecording = useCallback(async () => {
    try {
      let defaultWsUrl = 'ws://localhost:3001';
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        defaultWsUrl = `${protocol}//${window.location.host}`;
      }
      const wsUrl = import.meta.env.VITE_WS_URL || defaultWsUrl;
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connection established.');
        setIsRecording(true);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'transcript') {
          setTranscripts((prev) => {
            const newVals = [...prev];
            // If it's partial, we just append or update the last line
            // For simplicity, let's treat full lines as distinct and just accumulate
            if (data.isFinal) {
              const line: TranscriptLine = {
                id: Math.random().toString(36).substring(7),
                text: data.text,
                isFinal: true,
                speaker: data.speaker,
              };
              return [...newVals, line];
            }
            return newVals;
          });
        } else if (data.type === 'intelligence') {
          if (data.keywords && data.keywords.length > 0) {
            setDetectedKeywords((prev) => {
              const unique = new Set([...prev, ...data.keywords]);
              return Array.from(unique);
            });
          }
          if (data.meds && data.meds.length > 0) {
            setDetectedMeds((prev) => {
              const unique = new Set([...prev, ...data.meds]);
              return Array.from(unique);
            });
          }
        }
      };

      // Set up audio capturing
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000, // Google STT target
      });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16
        const buffer = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          let s = Math.max(-1, Math.min(1, inputData[i]));
          buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        wsRef.current.send(buffer.buffer);
      };

    } catch (err) {
      console.error('Failed to start recording:', err);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
      });
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    transcripts,
    detectedKeywords,
    detectedMeds,
    startRecording,
    stopRecording,
  };
};
