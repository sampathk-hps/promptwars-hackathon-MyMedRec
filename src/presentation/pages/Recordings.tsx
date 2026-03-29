import React, { useState, useMemo } from 'react';
import { Mic, FileText, ChevronDown, ChevronUp, Pill, AlertTriangle } from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { useHealthRecord } from '../../application/hooks';
import { useLiveRecording } from '../../application/useLiveRecording';
import type { Visit } from '../../domain/types';

const getTypeColor = (type: string): 'coral' | 'sky' | 'teal' | 'indigo' | 'gray' => {
  switch(type) {
    case 'Urgent Care': return 'coral';
    case 'Specialist': return 'sky';
    case 'Primary Care': return 'teal';
    case 'Telehealth': return 'indigo';
    default: return 'gray';
  }
};

const VisitCard: React.FC<{ visit: Visit; defaultExpanded?: boolean }> = React.memo(({ visit, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-text-primary">{visit.date}</span>
            <span className="text-muted text-xs">•</span>
            <span className="text-sm text-text-secondary">{visit.durationMinutes} min</span>
            <Badge variant={getTypeColor(visit.type)}>{visit.type}</Badge>
          </div>
          <h3 className="text-lg font-bold text-text-primary">{visit.provider.name} — {visit.provider.facility}</h3>
          <p className="text-text-secondary font-medium">Reason: {visit.reason}</p>
        </div>
        <div className="flex items-center gap-2 text-primary bg-primary-light px-3 py-1.5 rounded-full text-sm font-medium self-start">
          <Mic size={16} /> {visit.durationMinutes}:{(visit.durationMinutes % 60).toString().padStart(2,'0')} recorded
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mt-2">
        <h4 className="font-semibold text-sm mb-2 text-text-primary flex items-center gap-2"><FileText size={16}/> Summary</h4>
        <p className="text-sm text-text-secondary leading-relaxed">{visit.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-2">
        {visit.medicationsPrescribed.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3">Medications Prescribed</h4>
            <div className="flex flex-col gap-2">
              {visit.medicationsPrescribed.map(med => (
                <div key={med.id} className="flex flex-col gap-1 p-3 border rounded-md bg-white shadow-sm border-border-color">
                  <div className="flex items-center gap-2 font-medium text-sm">
                    <Pill size={16} className="text-primary"/> {med.name}
                  </div>
                  <div className="text-xs text-muted pl-6">{med.dosage} {med.duration ? `— ${med.duration}` : ''}</div>
                  {med.id === 'm4' && (
                    <div className="pl-6 mt-1 text-xs font-semibold text-coral flex items-center gap-1">
                      <AlertTriangle size={12}/> Interacts with Lisinopril
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {visit.followUpActions.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3">Follow-Up Actions</h4>
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
              {visit.followUpActions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {visit.transcript && visit.transcript.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <button 
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls={`transcript-${visit.id}`}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />} 
            {expanded ? 'Hide' : 'Show'} Full Transcript
          </button>
          
          {expanded && (
            <div id={`transcript-${visit.id}`} className="mt-4 bg-gray-50 p-4 rounded-lg text-sm flex flex-col gap-3 font-mono">
              {visit.transcript.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span className={`font-semibold shrink-0 ${line.speaker === 'Sam' ? 'text-primary' : 'text-text-primary'}`}>
                    {line.speaker}:
                  </span>
                  <span className="text-text-secondary leading-relaxed">{line.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
});

VisitCard.displayName = 'VisitCard';

const Recordings: React.FC = () => {
  const { record, loading: fetchingRecord } = useHealthRecord();
  const { isRecording, transcripts, detectedKeywords, detectedMeds, startRecording, stopRecording } = useLiveRecording();

  if (fetchingRecord || !record) return <div className="p-8">Loading visits...</div>;

  // sort visits newest first
  const sortedVisits = useMemo(() => {
    return [...record.visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [record.visits]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Decorative Active Recording Banner */}
      {isRecording ? (
        <Card className="bg-coral-light border border-coral-light relative overflow-hidden flex flex-col gap-6 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-coral rounded-full opacity-10 blur-3xl mix-blend-multiply"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-coral rounded-full flex-shrink-0 animate-pulse" style={{ boxShadow: '0 0 8px rgba(249,112,102,0.8)' }}></div>
              <div>
                <div className="font-bold text-coral">Live Session Recording...</div>
                <div className="text-sm text-text-secondary">Capture and Intelligence Active</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-1 items-end h-6 opacity-75 animate-pulse">
                <div className="w-1 bg-coral rounded-t-sm h-4"></div>
                <div className="w-1 bg-coral rounded-t-sm h-6"></div>
                <div className="w-1 bg-coral rounded-t-sm h-3"></div>
                <div className="w-1 bg-coral rounded-t-sm h-5"></div>
                <div className="w-1 bg-coral rounded-t-sm h-4"></div>
              </div>
              <Button variant="coral-outline" className="text-xs px-4 py-2" onClick={stopRecording}>Stop Recording</Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 relative z-10 mt-2">
            <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto flex flex-col gap-3 border shadow-sm">
              <h4 className="font-semibold text-xs text-text-secondary uppercase tracking-wider sticky top-0 bg-white/90 backdrop-blur py-1 z-10">Live Transcript Diarization</h4>
              {transcripts.length === 0 && <span className="text-sm italic text-muted p-2">Listening...</span>}
              {transcripts.map((t) => (
                <div key={t.id} className="flex gap-3 text-sm animate-in fade-in slide-in-from-bottom-2 p-2 rounded-lg bg-white/50 border border-transparent hover:border-border-color">
                  <span className={`font-semibold shrink-0 w-16 text-right ${t.speaker === 'Doctor' ? 'text-primary' : 'text-coral'}`}>
                    {t.speaker || 'Unknown'}
                  </span>
                  <span className="text-text-primary leading-relaxed">{t.text}</span>
                </div>
              ))}
            </div>
            <div className="md:col-span-1 flex flex-col gap-4">
               <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border shadow-sm flex-1">
                 <h4 className="font-semibold text-xs text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                   <AlertTriangle size={14} className="text-coral" /> Detected Medications
                 </h4>
                 <div className="flex flex-col gap-2">
                    {detectedMeds.length === 0 && <span className="text-xs italic text-muted">Waiting for entities...</span>}
                    {detectedMeds.map((med, i) => (
                      <div key={i} className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-semibold animate-in zoom-in flex items-center gap-2 shadow-sm">
                        <Pill size={16}/> {med}
                      </div>
                    ))}
                 </div>
               </div>
               <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border shadow-sm flex-1">
                 <h4 className="font-semibold text-xs text-text-secondary uppercase tracking-wider mb-4">Live Keywords</h4>
                 <div className="flex flex-wrap gap-2">
                    {detectedKeywords.length === 0 && <span className="text-xs italic text-muted">Waiting for entities...</span>}
                    {detectedKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1.5 bg-sky-50 text-sky-700 border border-sky-100 rounded-md text-xs font-medium animate-in zoom-in shadow-sm">
                        {kw}
                      </span>
                    ))}
                 </div>
               </div>
            </div>
          </div>

        </Card>
      ) : (
        <Card className="bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
               <Mic size={24} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-text-primary">Ready to Record</h3>
               <p className="text-sm text-text-secondary mt-1 max-w-xl leading-relaxed">
                 Start a new session to capture doctor-patient dialogue in real-time. Our Gemini medical intelligence layer will extract key symptoms and medications continuously as you speak.
               </p>
             </div>
          </div>
          <Button variant="primary" className="shrink-0 font-semibold px-6" onClick={startRecording}>
            Start Live Recording
          </Button>
        </Card>
      )}

      <header className="flex flex-col gap-1 mt-6">
        <h1 className="text-3xl font-bold">Your Past Visits</h1>
        <p className="text-muted">Every appointment, captured and summarised in plain English.</p>
      </header>

      {/* Filter/Sort Bar UI (non-functional demo) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-y">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <select aria-label="Filter by provider" className="px-3 py-2 border rounded-md text-sm bg-white text-text-secondary outline-none">
            <option>All Providers</option>
            <option>Primary Care</option>
            <option>Specialist</option>
            <option>Urgent Care</option>
          </select>
          <select aria-label="Filter by time period" className="px-3 py-2 border rounded-md text-sm bg-white text-text-secondary outline-none">
            <option>All Time</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="text-sm font-medium text-text-secondary">
          {sortedVisits.length} visits recorded over 12 months
        </div>
      </div>

      {/* Visit List */}
      <div className="flex flex-col gap-6 w-full">
        {sortedVisits.map((visit, index) => (
          <VisitCard key={visit.id} visit={visit} defaultExpanded={index === 0} />
        ))}
      </div>
    </div>
  );
};

export default Recordings;
