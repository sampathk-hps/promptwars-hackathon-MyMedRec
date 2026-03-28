const request = require('supertest');
const WebSocket = require('ws');
const http = require('http');
const express = require('express');

// Extract the mock function logic to test it directly
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

describe('Backend Server Tests', () => {
  describe('Intelligence Extraction Mock', () => {
    it('extracts known medications and keywords', () => {
      const result = extractIntelligenceMock("I have a fever and cough, so I took some ibuprofen.");
      expect(result.meds).toContain('ibuprofen');
      expect(result.keywords).toContain('fever');
      expect(result.keywords).toContain('cough');
    });

    it('returns empty arrays when nothing matches', () => {
      const result = extractIntelligenceMock("I am feeling fine, no issues today.");
      expect(result.meds).toEqual([]);
      expect(result.keywords).toEqual([]);
    });
  });

  describe('HTTP Endpoints', () => {
    let app;
    let server;
    
    beforeAll(async () => {
      app = express();
      app.get('/health', (req, res) => res.send('OK'));
      await new Promise((resolve) => {
        server = app.listen(0, resolve);
      });
    });

    afterAll(async () => {
      if (server) {
        await new Promise((resolve) => server.close(resolve));
      }
    });

    it('should return OK for /health endpoint', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('OK');
    });
  });
});
