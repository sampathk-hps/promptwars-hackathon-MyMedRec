import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Pill, Calendar, Activity, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { Card, Badge } from '../components/UI';
import { useHealthRecord } from '../../application/hooks';

const Dashboard: React.FC = () => {
  const { record, loading } = useHealthRecord();

  if (loading || !record) return <div className="p-8">Loading dashboard...</div>;

  const { visits, medications, conditions, interactions } = record;

  const today = new Date('2026-03-28T00:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const recentVisits = [...visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const activeInteractionsCount = interactions.length;
  const activeMedsCount = medications.filter(m => m.status.startsWith('active')).length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Section */}
      <header>
        <h1 className="text-3xl font-bold">Welcome back, {record.patient.firstName}</h1>
        <p className="text-muted mt-1">Here's your health snapshot. &nbsp; • &nbsp; {today}</p>
      </header>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="icon-box icon-box-teal rounded"><Mic size={20} /></div>
            <div className="font-semibold text-lg">Total Visits</div>
          </div>
          <div className="text-3xl font-bold mt-2">{visits.length}</div>
          <div className="text-sm text-muted">3 in the last 90 days</div>
        </Card>
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="icon-box icon-box-emerald rounded"><Pill size={20} /></div>
            <div className="font-semibold text-lg">Active Medications</div>
          </div>
          <div className="text-3xl font-bold mt-2">{activeMedsCount}</div>
          <div className="text-sm text-coral font-medium">{activeInteractionsCount} interaction flagged</div>
        </Card>
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="icon-box icon-box-amber rounded"><Calendar size={20} /></div>
            <div className="font-semibold text-lg">Upcoming Follow-ups</div>
          </div>
          <div className="text-3xl font-bold mt-2">2</div>
          <div className="text-sm text-muted">Next: March 14</div>
        </Card>
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="icon-box icon-box-sky rounded"><Activity size={20} /></div>
            <div className="font-semibold text-lg">Conditions Tracked</div>
          </div>
          <div className="text-3xl font-bold mt-2">{conditions.filter(c => c.status === 'active' || c.status === 'pending').length}</div>
          <div className="text-sm text-primary font-medium">1 newly diagnosed</div>
        </Card>
      </div>

      {/* Drug Interaction Alert Card */}
      {interactions.map(interaction => {
        const med1 = medications.find(m => m.id === interaction.medication1Id);
        const med2 = medications.find(m => m.id === interaction.medication2Id);
        return (
          <Card key={interaction.id} className="card-alert-coral bg-coral-light border border-coral/20">
            <div className="flex items-start gap-4">
              <div className="text-coral mt-1"><AlertTriangle size={24} /></div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-coral mb-2">Drug Interaction Alert</h3>
                <p className="text-sm md:text-base text-text-primary mb-3">
                  Potential interaction detected between <span className="font-bold">{med1?.name.split(' ')[0]}</span> ({med1?.purpose}) and <span className="font-bold">{med2?.name.split(' ')[0]}</span> ({med2?.purpose}). {interaction.description.split('.')[1]}.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <Badge variant="gray">Flagged {interaction.dateFlagged}</Badge>
                  <Link to="/app/medications" className="text-coral font-semibold flex items-center gap-1 hover:underline">
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Follow-Ups Card */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 border-b pb-4">
            <Calendar size={20} className="text-amber" />
            <h2 className="text-lg font-semibold flex-1">Upcoming Follow-Ups</h2>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex gap-3">
              <div className="mt-2"><span className="status-dot bg-teal"></span></div>
              <div>
                <div className="font-semibold">Dermatology Follow-Up — Dr. Sarah Chen</div>
                <div className="text-xs text-muted mb-1">March 14, 2026</div>
                <div className="text-sm text-text-secondary">Follow up on mole biopsy results. Bring photos of any new or changing moles.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-2"><span className="status-dot bg-amber"></span></div>
              <div>
                <div className="font-semibold">Cardiology Check-In — Dr. James Okafor</div>
                <div className="text-xs text-muted mb-1">March 10, 2026</div>
                <div className="text-sm text-text-secondary">Blood pressure medication review. Bring 2 weeks of home BP readings.</div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t text-right">
            <Link to="/app/records" className="text-primary font-medium hover:underline text-sm flex items-center justify-end gap-1">
              View Full Timeline <ChevronRight size={16} />
            </Link>
          </div>
        </Card>

        {/* Recent Visits Card */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 border-b pb-4">
            <Mic size={20} className="text-primary" />
            <h2 className="text-lg font-semibold flex-1">Recent Visits</h2>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {recentVisits.map((visit, idx) => (
              <div key={visit.id} className="flex gap-3 relative pb-4">
                {idx !== recentVisits.length - 1 && (
                  <div className="absolute left-1.5 top-6 bottom-0 w-px bg-border-color border-l-2 border-gray-100"></div>
                )}
                <div className="mt-1 flex-shrink-0 z-10 bg-white"><span className="status-dot bg-primary"></span></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{visit.type} Visit</div>
                  <div className="text-xs text-muted mb-1">{visit.date} • {visit.provider.name}</div>
                  <div className="text-sm text-text-secondary line-clamp-2">{visit.summary.substring(0, 100)}...</div>
                  {idx === 0 && <Badge variant="coral" className="mt-2">1 interaction flagged</Badge>}
                  {idx === 1 && <Badge variant="amber" className="mt-2">Follow-up needed</Badge>}
                  {idx === 2 && <Badge variant="emerald" className="mt-2">All clear</Badge>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-4 border-t text-right">
            <Link to="/app/recordings" className="text-primary font-medium hover:underline text-sm flex items-center justify-end gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
        </Card>
      </div>

      {/* AI Health Insight */}
      <Card className="border-l-4 border-l-primary bg-primary-light">
        <div className="flex gap-3 items-start">
          <div className="text-primary mt-1"><Sparkles size={20} /></div>
          <div>
            <h3 className="font-semibold text-primary-dark mb-2">MyMedRec Health Insight</h3>
            <p className="text-sm md:text-base leading-relaxed text-text-secondary">
              Over the past 6 months, you've visited 5 different providers across 4 facilities. MyMedRec has tracked all medications prescribed by each provider and identified 1 potential drug interaction that was not flagged during your visits. Your cholesterol levels have been discussed in 3 separate appointments — your most recent bloodwork (Jan 2026) showed LDL at 142 mg/dL, slightly above the recommended range. Dr. Torres recommended dietary changes; consider following up if levels haven't improved by your next physical.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
