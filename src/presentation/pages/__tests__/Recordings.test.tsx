import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Recordings from '../../pages/Recordings';
import { vi } from 'vitest';
import type { TranscriptLine } from '../../../application/useLiveRecording';
import type { Visit } from '../../../domain/types';

// Mock dependencies
const mockStartRecording = vi.fn();
const mockStopRecording = vi.fn();

let mockUseLiveRecording: {
  isRecording: boolean;
  transcripts: TranscriptLine[];
  detectedKeywords: string[];
  detectedMeds: string[];
  startRecording: any;
  stopRecording: any;
} = {
  isRecording: false,
  transcripts: [],
  detectedKeywords: [],
  detectedMeds: [],
  startRecording: mockStartRecording,
  stopRecording: mockStopRecording,
};

let mockUseHealthRecord: {
  loading: boolean;
  record: { visits: Visit[] }
} = {
  loading: false,
  record: { visits: [] }
};

vi.mock('../../../application/useLiveRecording', () => ({
  useLiveRecording: () => mockUseLiveRecording
}));

vi.mock('../../../application/hooks', () => ({
  useHealthRecord: () => mockUseHealthRecord
}));

describe('Recordings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLiveRecording = {
      isRecording: false,
      transcripts: [],
      detectedKeywords: [],
      detectedMeds: [],
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
    };
    mockUseHealthRecord = {
      loading: false,
      record: { visits: [] }
    };
  });

  it('renders loading state initially', () => {
    mockUseHealthRecord.loading = true;
    render(
      <MemoryRouter>
        <Recordings />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading visits...')).toBeInTheDocument();
  });

  it('renders Ready to Record state', () => {
    render(
      <MemoryRouter>
        <Recordings />
      </MemoryRouter>
    );
    expect(screen.getByText('Ready to Record')).toBeInTheDocument();
    
    // Test start recording button
    const startBtn = screen.getByRole('button', { name: /Start Live Recording/i });
    fireEvent.click(startBtn);
    expect(mockStartRecording).toHaveBeenCalled();
  });

  it('renders active live recording state with transcripts and detected entities', () => {
    mockUseLiveRecording = {
      ...mockUseLiveRecording,
      isRecording: true,
      transcripts: [{ id: '1', speaker: 'Doctor', text: 'Take ibuprofen.', isFinal: true }],
      detectedKeywords: ['pain'],
      detectedMeds: ['Ibuprofen'],
    };

    render(
      <MemoryRouter>
        <Recordings />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Live Session Recording...')).toBeInTheDocument();
    expect(screen.getByText('Take ibuprofen.')).toBeInTheDocument();
    expect(screen.getByText('pain')).toBeInTheDocument();
    // Use getAllByText because Ibuprofen might be rendered multiple times or inside a Pill component alongside other text
    expect(screen.getAllByText(/Ibuprofen/i).length).toBeGreaterThan(0);

    // Test stop recording
    const stopBtn = screen.getByRole('button', { name: /Stop Recording/i });
    fireEvent.click(stopBtn);
    expect(mockStopRecording).toHaveBeenCalled();
  });

  it('renders past visits and sorts them newest first', () => {
    mockUseHealthRecord.record.visits = [
      {
        id: '1',
        date: '2023-01-01',
        durationMinutes: 15,
        type: 'Primary Care',
        provider: { name: 'Dr. Smith', facility: 'Clinic A' } as any,
        reason: 'Checkup',
        summary: 'All good',
        medicationsPrescribed: [],
        followUpActions: [],
        transcript: []
      },
      {
        id: '2',
        date: '2023-06-05',
        durationMinutes: 20,
        type: 'Specialist',
        provider: { name: 'Dr. Jones', facility: 'Hospital B' } as any,
        reason: 'Pain',
        summary: 'Needs rest',
        medicationsPrescribed: [],
        followUpActions: ['Rest', 'Ice'],
        transcript: []
      }
    ];

    render(
      <MemoryRouter>
        <Recordings />
      </MemoryRouter>
    );

    // Look for all dates rendered, they should be in 2023-06-05 then 2023-01-01 order in the DOM
    const dates = screen.getAllByText(/2023-/);
    expect(dates[0]).toHaveTextContent('2023-06-05');
    expect(dates[1]).toHaveTextContent('2023-01-01');

    // Follow-up actions present
    expect(screen.getByText('Rest')).toBeInTheDocument();
    expect(screen.getByText('Ice')).toBeInTheDocument();
  });

  it('renders medications and expands/collapses transcript in VisitCard', () => {
    mockUseHealthRecord.record.visits = [
      {
        id: 'visit-123',
        date: '2023-10-10',
        durationMinutes: 10,
        type: 'Urgent Care',
        provider: { name: 'Dr. Evans', facility: 'Urgent Care Center' } as any,
        reason: 'Cough',
        summary: 'Prescribed meds',
        medicationsPrescribed: [
          { id: 'm1', name: 'Amoxicillin', dosage: '500mg', duration: '7 days' } as any,
          { id: 'm4', name: 'Lisinopril', dosage: '10mg' } as any // m4 triggers the warning
        ],
        followUpActions: [],
        transcript: [{ speaker: 'Doctor', text: 'How are you?' }, { speaker: 'Patient', text: 'I have a cough.' }]
      }
    ];

    render(
      <MemoryRouter>
        <Recordings />
      </MemoryRouter>
    );

    // Medications
    expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    expect(screen.getByText(/500mg/)).toBeInTheDocument();
    expect(screen.getByText('Lisinopril')).toBeInTheDocument();
    // Warning for m4
    expect(screen.getByText('Interacts with Lisinopril')).toBeInTheDocument();

    // Transcript toggle (expanded by default for index === 0)
    const toggleBtn = screen.getByRole('button', { name: /Hide Full Transcript/i });
    expect(screen.getByText('How are you?')).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    
    // Now collapsed
    expect(screen.getByRole('button', { name: /Show Full Transcript/i })).toBeInTheDocument();
    expect(screen.queryByText('How are you?')).not.toBeInTheDocument();

    // Expand again
    fireEvent.click(screen.getByRole('button', { name: /Show Full Transcript/i }));
    expect(screen.getByText('How are you?')).toBeInTheDocument();
  });
});
