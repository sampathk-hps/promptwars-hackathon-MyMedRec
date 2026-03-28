import React, { useState } from 'react';
import { Card, Badge } from '../components/UI';
import { useHealthRecord } from '../../application/hooks';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ConditionRow: React.FC<{
  title: string;
  dotColor: string;
  diagnosed: string;
  management: string;
  provider: string;
  resolved?: string;
}> = ({ title, dotColor, diagnosed, management, provider, resolved }) => (
  <div className="flex gap-4">
    <div className="mt-2 flex-shrink-0"><span className={`status-dot bg-${dotColor}`}></span></div>
    <div className="flex-1">
      <h4 className="font-semibold text-text-primary">{title}</h4>
      <div className="text-xs text-muted mb-1">
        {resolved ? `Diagnosed: ${diagnosed} • Resolved: ${resolved}` : `Diagnosed: ${diagnosed} • provider: ${provider}`}
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{management}</p>
    </div>
  </div>
);

const HealthRecord: React.FC = () => {
  const { record, loading } = useHealthRecord();
  const [resolvedExpanded, setResolvedExpanded] = useState(false);

  if (loading || !record) return <div className="p-8">Loading record...</div>;

  const { patient, conditions, labPanels } = record;
  const resolvedConditions = conditions.filter(c => c.status === 'resolved');

  return (
    <div className="flex flex-col gap-6 w-full">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Your Health Record</h1>
        <p className="text-muted">Your complete medical history in one place, in plain English.</p>
      </header>

      {/* Patient Summary */}
      <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-t-4 border-t-primary">
        <div className="avatar avatar-lg shrink-0 w-16 h-16 text-2xl">AJ</div>
        <div className="flex-1 grid md:grid-cols-2 gap-4 w-full">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{patient.firstName} {patient.lastName}</h2>
            <div className="text-sm text-muted mb-2">Age: 34 / DOB: {patient.dateOfBirth} / Blood type: {patient.bloodType}</div>
            <div className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">Primary Care:</span> {patient.primaryCareProvider.name}, {patient.primaryCareProvider.facility}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">Allergies:</span> {patient.allergies.join(', ')}
            </div>
            <div className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">Emergency Contact:</span> {patient.emergencyContact.name} ({patient.emergencyContact.relationship}), {patient.emergencyContact.phone}
            </div>
          </div>
        </div>
      </Card>

      {/* Active Conditions */}
      <Card className="flex flex-col gap-6">
        <h3 className="text-xl font-bold border-b pb-4">Active Conditions</h3>
        <div className="flex flex-col gap-6">
          <ConditionRow 
            title="Stage 1 Hypertension (High Blood Pressure)" dotColor="teal" 
            diagnosed="Sep 8, 2025" provider="Dr. James Okafor"
            management="Managed with Lisinopril 10mg daily. Blood pressure currently averaging 128/82 with medication." 
          />
          <ConditionRow 
            title="Elevated LDL Cholesterol" dotColor="amber" 
            diagnosed="Jan 15, 2026" provider="Dr. Michael Torres"
            management="LDL 142 mg/dL. Currently managed with diet and exercise changes. Medication may be considered if not improved by July 2026." 
          />
          <ConditionRow 
            title="Seasonal Allergic Rhinitis (Allergies)" dotColor="sky" 
            diagnosed="Aug 20, 2025" provider="Dr. Michael Torres"
            management="Managed with Cetirizine 10mg daily and Flonase as needed. Symptoms worst in spring/summer." 
          />
          <ConditionRow 
            title="Pending: Mole Biopsy Results" dotColor="gray" 
            diagnosed="Feb 12, 2026" provider="Dr. Sarah Chen"
            management="Irregular mole on upper back biopsied by Dr. Sarah Chen. Results pending. Follow-up March 14, 2026." 
          />
        </div>
      </Card>

      {/* Resolved Conditions */}
      <Card className="flex flex-col">
        <button 
          onClick={() => setResolvedExpanded(!resolvedExpanded)}
          className="flex items-center justify-between w-full text-left font-bold text-xl hover:text-primary transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-2">
            Resolved Conditions <Badge variant="gray">({resolvedConditions.length})</Badge>
          </div>
          {resolvedExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {resolvedExpanded && (
          <div className="flex flex-col gap-6 mt-6 border-t pt-6">
            <ConditionRow 
              title="Acute Bronchitis" dotColor="emerald" 
              diagnosed="Oct 18, 2025" resolved="Nov 2025" provider="Dr. Amy Nguyen"
              management="Treated with Azithromycin. Post-infectious cough lingered ~5 weeks total but fully resolved." 
            />
            <ConditionRow 
              title="Strep Throat" dotColor="emerald" 
              diagnosed="May 22, 2025" resolved="Jun 2025" provider="Dr. Michael Torres"
              management="Treated with 10-day course of Amoxicillin. Full recovery." 
            />
            <ConditionRow 
              title="Lower Back Strain" dotColor="emerald" 
              diagnosed="Jul 10, 2025" resolved="Sep 2025" provider="Dr. Emily Park"
              management="Treated with physical therapy (12 sessions) and short-term muscle relaxant. Pain fully resolved after 8 weeks." 
            />
          </div>
        )}
      </Card>

      {/* Lab Results */}
      <Card className="flex flex-col gap-6">
        <h3 className="text-xl font-bold border-b pb-4">Lab Results</h3>
        {labPanels.map((panel, i) => (
          <div key={panel.id} className={i !== 0 ? "pt-6 border-t" : ""}>
            <h4 className="font-semibold text-text-primary mb-4">{panel.name} — {panel.dateDrawn}</h4>
            <div className="divide-y border rounded-lg overflow-hidden border-border-color">
              <div className="grid grid-cols-4 p-3 bg-gray-50 text-xs font-semibold text-text-secondary">
                <div className="col-span-2">Test Name</div>
                <div>Result</div>
                <div>Status</div>
              </div>
              {panel.results.map(result => (
                <div key={result.id} className="grid grid-cols-4 p-3 items-center text-sm bg-white">
                  <div className="col-span-2 font-medium text-text-primary">{result.name}</div>
                  <div className="text-text-secondary">
                    {result.value} <span className="text-xs text-muted">{result.unit}</span>
                  </div>
                  <div>
                    {result.status === 'normal' && <Badge variant="emerald">Normal</Badge>}
                    {result.status === 'high' && <Badge variant="amber">High</Badge>}
                    {result.status === 'low' && <Badge variant="amber">Low</Badge>}
                    {result.status === 'borderline' && <Badge variant="amber">Borderline</Badge>}
                  </div>
                </div>
              ))}
            </div>
            {i === 0 && (
              <div className="mt-3 text-sm text-text-secondary bg-gray-50 p-3 rounded flex items-center gap-2">
                <span className="font-semibold text-amber">↑ 14 mg/dL</span> LDL increase from March 2025 baseline
              </div>
            )}
          </div>
        ))}
      </Card>
      
      {/* Vitals Over Time */}
      <Card className="flex flex-col">
        <h3 className="text-xl font-bold mb-6 border-b pb-4">Vitals Trend</h3>
        <div className="bg-gray-50 p-6 rounded-lg text-sm text-text-secondary">
          <div className="font-semibold text-text-primary mb-4">Blood Pressure Log</div>
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex justify-between">
              <span>Mar 2025 (Baseline):</span> <span className="font-medium text-text-primary">130/84 mmHg</span>
            </div>
            <div className="flex justify-between">
              <span>Aug 2025:</span> <span className="font-medium text-amber">134/86 mmHg</span>
            </div>
            <div className="flex justify-between font-semibold text-text-primary bg-primary-light p-2 rounded -mx-2 items-center">
              <span>Sep 2025:</span> 
              <div className="flex flex-col items-end">
                <span className="text-amber">136/87 mmHg</span>
                <span className="text-xs text-primary font-normal">Started Lisinopril</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Jan 2026:</span> <span className="font-medium text-emerald">128/82 mmHg</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HealthRecord;
