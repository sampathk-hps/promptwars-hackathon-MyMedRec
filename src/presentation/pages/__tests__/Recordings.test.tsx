import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Recordings from '../../pages/Recordings';
import { vi } from 'vitest';

// Mock the hooks
vi.mock('../../../application/useLiveRecording', () => ({
  useLiveRecording: () => ({
    isRecording: false,
    transcripts: [],
    detectedKeywords: [],
    detectedMeds: [],
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
  })
}));

vi.mock('../../../application/hooks', () => ({
  useHealthRecord: () => ({
    loading: false,
    record: { visits: [] }
  })
}));

describe('Recordings Page', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <Recordings />
      </MemoryRouter>
    );
    expect(screen.getByText('Ready to Record')).toBeInTheDocument();
  });
});
