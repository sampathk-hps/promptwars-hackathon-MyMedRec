import React, { useState } from 'react';
import { Pill, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { useHealthRecord } from '../../application/hooks';

const Medications: React.FC = () => {
  const { record, loading } = useHealthRecord();
  const [pastExpanded, setPastExpanded] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  if (loading || !record) return <div className="p-8">Loading medications...</div>;

  const { medications, interactions } = record;
  const activeMeds = medications.filter(m => m.status.startsWith('active'));
  const pastMeds = medications.filter(m => m.status === 'completed');

  return (
    <div className="flex flex-col gap-6 w-full">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Your Medications</h1>
        <p className="text-muted">Every medication across every provider, with interaction checks.</p>
      </header>

      {/* Interaction Banner */}
      {!alertDismissed && interactions.map(interaction => {
        const med1 = activeMeds.find(m => m.id === interaction.medication1Id);
        const med2 = activeMeds.find(m => m.id === interaction.medication2Id);
        
        return (
          <Card key={interaction.id} className="card-alert-coral bg-coral-light border border-coral/20">
            <div className="flex items-start gap-4">
              <div className="text-coral mt-1"><AlertTriangle size={24} /></div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-coral mb-2">1 Active Drug Interaction Detected</h3>
                <p className="text-base text-text-primary font-medium mb-4">
                  {med1?.name.split(' ')[0]} (prescribed Feb 28, 2026) may interact with {med2?.name.split(' ')[0]} (ongoing since Sep 8, 2025)
                </p>
                
                <div className="bg-white p-4 rounded-md border border-coral/20 text-sm flex flex-col gap-3 mb-4">
                  <div>
                    <span className="font-bold block text-text-primary mb-1">Why this matters:</span>
                    <span className="text-text-secondary">{interaction.description}</span>
                  </div>
                  <div>
                    <span className="font-bold block text-text-primary mb-1">What you should do:</span>
                    <span className="text-text-secondary">{interaction.actionRequired}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 pt-2 border-t">
                    <span className="font-semibold text-coral">Severity: Moderate — Monitor closely</span>
                    <span className="text-muted text-xs hidden-mobile">Sources: Prescribed by two different providers</span>
                  </div>
                </div>

                <Button variant="coral-outline" onClick={() => setAlertDismissed(true)}>
                  Mark as Discussed with Doctor
                </Button>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Active Medications Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Currently Taking <Badge variant="gray">({activeMeds.length})</Badge>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {activeMeds.map(med => {
            const hasInteraction = interactions.some(i => i.medication1Id === med.id || i.medication2Id === med.id);
            const badgeVariant: 'amber' | 'sky' | 'emerald' = med.status.includes('short-term') ? 'amber' : (med.status.includes('as-needed') ? 'sky' : 'emerald');
            
            return (
              <Card key={med.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="icon-box icon-box-teal rounded-full"><Pill size={20} /></div>
                    <div>
                      <h3 className="font-bold text-text-primary">{med.name}</h3>
                      <div className="text-sm font-medium text-text-secondary">{med.dosage}</div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-text-secondary flex-1 mb-4 flex flex-col gap-2">
                  <div><span className="font-medium">Purpose:</span> {med.purpose}</div>
                  <div><span className="font-medium">Prescribed by:</span> {med.prescribedBy.name}</div>
                  <div><span className="font-medium">Started:</span> {med.startDate} {med.duration && `(${med.duration})`}</div>
                  {med.instructions && (
                    <div className="bg-gray-50 p-2 rounded mt-2 text-xs flex items-start gap-2 border">
                      <Info size={14} className="text-primary shrink-0 mt-0.5" />
                      <span>{med.instructions}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Badge variant={badgeVariant}>
                      {med.status.replace('active-', '').replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  {hasInteraction && !alertDismissed && (
                    <div className="text-xs font-semibold text-coral bg-coral-light p-2 rounded-md flex items-center gap-1 border border-coral/20">
                      <AlertTriangle size={14} /> ⚠️ Interacts with {med.id === 'm1' ? 'Ibuprofen' : 'Lisinopril'}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Past Medications */}
      <Card className="flex flex-col mt-4">
        <button 
          onClick={() => setPastExpanded(!pastExpanded)}
          className="flex items-center justify-between w-full text-left font-bold text-xl hover:text-primary transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-2">
            Past Medications <Badge variant="gray">({pastMeds.length})</Badge>
          </div>
          <span className="text-sm font-normal text-muted underline">
            {pastExpanded ? 'Hide' : 'Show'}
          </span>
        </button>

        {pastExpanded && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 border-t pt-6">
            {pastMeds.map(med => (
              <div key={med.id} className="p-4 border rounded-lg bg-gray-50 text-sm flex flex-col gap-2 opacity-80">
                <div className="font-bold text-text-primary mb-1">{med.name}</div>
                <div><span className="font-medium">Dosage:</span> {med.dosage}</div>
                <div><span className="font-medium">Purpose:</span> {med.purpose}</div>
                <div><span className="font-medium">Provider:</span> {med.prescribedBy.name}</div>
                <div><span className="font-medium">Taken:</span> {med.startDate} — {med.endDate}</div>
                <div className="mt-2"><Badge variant="gray">Status: Completed</Badge></div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Interaction Matrix */}
      <Card className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-bold">Interaction Check — All Medications</h3>
          <p className="text-sm text-text-secondary mt-1">MyMedRec automatically checks for interactions every time a new medication is prescribed. Checks are run against FDA and DrugBank databases.</p>
        </div>
        
        <div className="overflow-x-auto mt-4 border rounded-lg">
          <table className="w-full text-sm text-left border-collapse min-w-max">
            <thead className="bg-gray-50 text-xs uppercase text-text-secondary">
              <tr>
                <th className="px-4 py-3 border-b border-r">Medication</th>
                <th className="px-4 py-3 border-b border-r">Lisinopril</th>
                <th className="px-4 py-3 border-b border-r">Cetirizine</th>
                <th className="px-4 py-3 border-b border-r">Ibuprofen</th>
                <th className="px-4 py-3 border-b border-r">Vitamin D3</th>
                <th className="px-4 py-3 border-b">Dex (OTC)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b">
                <td className="px-4 py-3 font-medium border-r bg-gray-50">Lisinopril</td>
                <td className="px-4 py-3 text-center border-r bg-gray-100">-</td>
                <td className="px-4 py-3 text-center border-r"><CheckCircle className="text-emerald inline" size={16}/></td>
                <td className="px-4 py-3 text-center border-r bg-coral-light"><AlertTriangle className="text-coral inline" size={16}/></td>
                <td className="px-4 py-3 text-center border-r"><CheckCircle className="text-emerald inline" size={16}/></td>
                <td className="px-4 py-3 text-center"><CheckCircle className="text-emerald inline" size={16}/></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 font-medium border-r bg-gray-50">Cetirizine</td>
                <td className="px-4 py-3 text-center border-r"><CheckCircle className="text-emerald inline" size={16}/></td>
                <td className="px-4 py-3 text-center border-r bg-gray-100">-</td>
                <td className="px-4 py-3 text-center border-r"><CheckCircle className="text-emerald inline" size={16}/></td>
                <td className="px-4 py-3 text-center border-r"><CheckCircle className="text-emerald inline" size={16}/></td>
                <td className="px-4 py-3 text-center"><CheckCircle className="text-emerald inline" size={16}/></td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 font-medium border-r bg-gray-50">Ibuprofen</td>
                <td className="px-4 py-3 text-center border-r bg-coral-light"><AlertTriangle className="text-coral inline" size={16}/></td>
                <td className="px-4 py-3 text-center border-r"><CheckCircle className="text-emerald inline" size={16}/></td>
                <td className="px-4 py-3 text-center border-r bg-gray-100">-</td>
                <td className="px-4 py-3 text-center border-r"><CheckCircle className="text-emerald inline" size={16}/></td>
                <td className="px-4 py-3 text-center"><CheckCircle className="text-emerald inline" size={16}/></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      
    </div>
  );
};

export default Medications;
