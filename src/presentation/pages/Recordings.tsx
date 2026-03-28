import React, { useState } from 'react';
import { Mic, FileText, ChevronDown, ChevronUp, Pill, AlertTriangle } from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { useHealthRecord } from '../../application/hooks';
import type { Visit } from '../../domain/types';

const VisitCard: React.FC<{ visit: Visit; defaultExpanded?: boolean }> = ({ visit, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const getTypeColor = (type: string): 'coral' | 'sky' | 'teal' | 'indigo' | 'gray' => {
    switch(type) {
      case 'Urgent Care': return 'coral';
      case 'Specialist': return 'sky';
      case 'Primary Care': return 'teal';
      case 'Telehealth': return 'indigo';
      default: return 'gray';
    }
  };

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
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />} 
            {expanded ? 'Hide' : 'Show'} Full Transcript
          </button>
          
          {expanded && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm flex flex-col gap-3 font-mono">
              {visit.transcript.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span className={`font-semibold shrink-0 ${line.speaker === 'Alex' ? 'text-primary' : 'text-text-primary'}`}>
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
};

const Recordings: React.FC = () => {
  const { record, loading } = useHealthRecord();

  if (loading || !record) return <div className="p-8">Loading visits...</div>;

  // sort visits newest first
  const sortedVisits = [...record.visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Decorative Active Recording Banner */}
      <Card className="bg-coral-light border border-coral-light animate-pulse relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-coral rounded-full opacity-10 blur-3xl mix-blend-multiply"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-coral rounded-full flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(249,112,102,0.8)' }}></div>
            <div>
              <div className="font-bold text-coral">Recording in progress...</div>
              <div className="text-sm text-text-secondary">General Practice — Started 14 min ago</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-1 items-end h-6">
              <div className="waveform-bar h-4"></div>
              <div className="waveform-bar h-6"></div>
              <div className="waveform-bar h-3"></div>
              <div className="waveform-bar h-5"></div>
              <div className="waveform-bar h-4"></div>
            </div>
            <Button variant="coral-outline" className="text-xs px-4 py-2">Stop Recording</Button>
          </div>
        </div>
      </Card>

      <header className="flex flex-col gap-1 mt-2">
        <h1 className="text-3xl font-bold">Your Visits</h1>
        <p className="text-muted">Every appointment, captured and summarised in plain English.</p>
      </header>

      {/* Filter/Sort Bar UI (non-functional demo) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-y">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <select className="px-3 py-2 border rounded-md text-sm bg-white text-text-secondary outline-none">
            <option>All Providers</option>
            <option>Primary Care</option>
            <option>Specialist</option>
            <option>Urgent Care</option>
          </select>
          <select className="px-3 py-2 border rounded-md text-sm bg-white text-text-secondary outline-none">
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
