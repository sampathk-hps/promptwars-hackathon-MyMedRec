import { renderHook, act } from '@testing-library/react';
import { useLiveRecording } from '../useLiveRecording';
import { vi } from 'vitest';

describe('useLiveRecording', () => {
  let mockWebSocket: any;
  let mockMediaStream: any;
  let originalGetUserMedia: any;
  let originalAudioContext: any;

  beforeEach(() => {
    mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      readyState: 1, // OPEN
    };
    
    // Mock WebSocket globally
    (globalThis as any).WebSocket = class {
      constructor() {
        return mockWebSocket;
      }
    };
    mockMediaStream = {
      getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }])
    };
    originalGetUserMedia = navigator.mediaDevices?.getUserMedia;
    
    // Polyfill mediaDevices if not exists for jsdom
    if (!navigator.mediaDevices) {
      (navigator as any).mediaDevices = {};
    }
    
    navigator.mediaDevices.getUserMedia = vi.fn().mockResolvedValue(mockMediaStream);

    // Mock AudioContext
    originalAudioContext = window.AudioContext;
    (window as any).AudioContext = class {
      constructor() {
        return {
          createMediaStreamSource: vi.fn().mockReturnValue({ connect: vi.fn() }),
          createScriptProcessor: vi.fn().mockReturnValue({
            connect: vi.fn(),
            disconnect: vi.fn(),
            onaudioprocess: null
          }),
          destination: {},
          close: vi.fn().mockResolvedValue(undefined)
        };
      }
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    (globalThis as any).WebSocket = WebSocket;
    navigator.mediaDevices.getUserMedia = originalGetUserMedia;
    (window as any).AudioContext = originalAudioContext;
  });

  it('initially does not record', () => {
    const { result } = renderHook(() => useLiveRecording());
    expect(result.current.isRecording).toBe(false);
    expect(result.current.transcripts).toEqual([]);
    expect(result.current.detectedKeywords).toEqual([]);
    expect(result.current.detectedMeds).toEqual([]);
  });

  it('connects to websocket and updates state on start', async () => {
    const { result } = renderHook(() => useLiveRecording());
    
    await act(async () => {
      await result.current.startRecording();
    });
    
    // trigger open
    act(() => {
      mockWebSocket.onopen();
    });
    
    expect(result.current.isRecording).toBe(true);
    
    // trigger message (transcript)
    act(() => {
      mockWebSocket.onmessage({
        data: JSON.stringify({
          type: 'transcript',
          text: 'test transcript',
          isFinal: true,
          speaker: 'Doctor'
        })
      });
    });
    
    expect(result.current.transcripts.length).toBe(1);
    expect(result.current.transcripts[0].text).toBe('test transcript');

    // trigger message (intelligence)
    act(() => {
      mockWebSocket.onmessage({
        data: JSON.stringify({
          type: 'intelligence',
          meds: ['Motrin'],
          keywords: ['Headache']
        })
      });
    });
    
    expect(result.current.detectedMeds).toContain('Motrin');
    expect(result.current.detectedKeywords).toContain('Headache');
  });

  it('cleans up on stopRecording', async () => {
    const { result } = renderHook(() => useLiveRecording());
    
    await act(async () => {
      await result.current.startRecording();
    });
    
    act(() => {
      result.current.stopRecording();
    });
    
    expect(result.current.isRecording).toBe(false);
    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
