import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, FileText, Shield, Pill, Clock, Lock, Server, Trash } from 'lucide-react';
import { Button, Card } from '../components/UI';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 md:gap-24 mb-24">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 md:py-32 overflow-hidden">
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '80vw', height: '80vw', maxWidth: '800px', maxHeight: '800px',
          background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, rgba(250,250,248,0) 70%)',
          zIndex: -1, borderRadius: '50%'
        }} />
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <p className="text-primary font-bold tracking-wide text-xs md:text-sm" style={{ letterSpacing: '3px' }}>
            YOUR HEALTH, YOUR WORDS
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary-dark">
            Never forget what your <br/> doctor said. Ever again.
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mt-4">
            MyMedRec listens to your medical appointments and turns every conversation into a clear, jargon-free health record. Medications, dosages, follow-ups, and flags for drug interactions — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/app">
              <Button style={{ padding: '16px 32px', fontSize: '1.125rem' }}>Try the Demo</Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>See How It Works</Button>
            </a>
          </div>
          <p className="text-sm text-muted mt-4">
            Used across 24,000+ appointments · 98% comprehension accuracy · Trusted by 8,400+ patients
          </p>
        </div>

        {/* Stats Card */}
        <div className="max-w-5xl mx-auto mt-16 mt-24">
          <Card className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-coral">40-80%</div>
              <div className="text-sm text-muted mt-2">Of medical info forgotten after a visit</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted mt-2">MyMedRec comprehension accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald">12min</div>
              <div className="text-sm text-muted mt-2">Avg summary ready time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber">3.2</div>
              <div className="text-sm text-muted mt-2">Avg drug interactions flagged per user</div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Three steps to never miss a detail</h2>
          <p className="text-xl text-muted">No setup. No training. Just hit record.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="flex flex-col gap-4 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <div className="icon-box icon-box-teal mb-2"><Mic size={24}/></div>
            <h3 className="text-xl font-semibold">Record Your Visit</h3>
            <p className="text-muted">Open MyMedRec before your appointment and tap record. It runs silently in the background, capturing the full conversation with your doctor, nurse, or specialist. Works for in-person visits and telehealth calls.</p>
          </Card>
          <Card className="flex flex-col gap-4 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            <div className="icon-box icon-box-emerald mb-2"><FileText size={24}/></div>
            <h3 className="text-xl font-semibold">Get Your Summary</h3>
            <p className="text-muted">After the visit, MyMedRec generates a plain-English summary: what was discussed, what was diagnosed, what medications were prescribed with dosages, and exactly what you need to do next. No medical jargon.</p>
          </Card>
          <Card className="flex flex-col gap-4 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
            <div className="icon-box icon-box-sky mb-2"><Shield size={24}/></div>
            <h3 className="text-xl font-semibold">Build Your Record</h3>
            <p className="text-muted">Every visit adds to your personal health timeline. Medications are tracked, drug interactions are flagged automatically, and your full history travels with you to every new doctor.</p>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Everything your medical records should be</h2>
          <p className="text-xl text-muted">Built for patients, not paperwork.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="flex gap-4">
            <div className="icon-box icon-box-teal shrink-0"><Mic size={24}/></div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Ambient Recording</h3>
              <p className="text-muted text-sm">Runs silently during any medical appointment. Works in noisy waiting rooms, telehealth calls, and specialist consultations. Multi-speaker detection identifies doctor vs. patient automatically.</p>
            </div>
          </Card>
          <Card className="flex gap-4">
            <div className="icon-box icon-box-emerald shrink-0"><FileText size={24}/></div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Plain English Summaries</h3>
              <p className="text-muted text-sm">Translates 'bilateral otitis media with effusion' into 'fluid behind both eardrums causing hearing issues.' Every summary is written for humans, not clinicians.</p>
            </div>
          </Card>
          <Card className="flex gap-4">
            <div className="icon-box icon-box-coral shrink-0"><Pill size={24}/></div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Drug Interaction Alerts</h3>
              <p className="text-muted text-sm">Tracks every medication you're prescribed across all providers. Automatically flags dangerous interactions, duplicate prescriptions, and dosage concerns — even when your doctors don't talk to each other.</p>
            </div>
          </Card>
          <Card className="flex gap-4">
            <div className="icon-box icon-box-amber shrink-0"><Clock size={24}/></div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow-Up Tracking</h3>
              <p className="text-muted text-sm">Never miss a follow-up. MyMedRec extracts every action item — referrals, lab tests, follow-up appointments, lifestyle changes — and reminds you what's due and when.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Your health data stays yours</h2>
          <p className="text-xl text-muted">Privacy isn't a feature — it's the foundation.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="icon-box icon-box-gray"><Lock size={24} /></div>
            <h3 className="text-lg font-semibold">End-to-End Encrypted</h3>
            <p className="text-muted text-sm">All recordings and health data are encrypted at rest and in transit. We can't read your records even if we wanted to.</p>
          </div>
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="icon-box icon-box-gray"><Server size={24} /></div>
            <h3 className="text-lg font-semibold">On-Device Processing</h3>
            <p className="text-muted text-sm">Audio is processed locally on your device. Raw recordings never leave your phone. Only your encrypted summaries sync to the cloud.</p>
          </div>
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="icon-box icon-box-gray"><Trash size={24} /></div>
            <h3 className="text-lg font-semibold">You Own Your Data</h3>
            <p className="text-muted text-sm">Export everything. Delete everything. Your data is yours — always portable, always deletable, never sold.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">People are finally understanding their health</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="flex flex-col gap-4">
            <p className="text-muted italic flex-1">"My mom has 4 specialists and takes 11 medications. Before MyMedRec, I was scribbling notes on my phone trying to keep up. Now I just record the visit and everything's captured — medications, dosages, follow-ups. Last month it flagged an interaction between her blood thinner and a new arthritis med that none of her doctors caught."</p>
            <div className="font-semibold">— Rachel M., Caregiver</div>
          </Card>
          <Card className="flex flex-col gap-4">
            <p className="text-muted italic flex-1">"I have ADHD and I literally cannot retain what my doctor says once I walk out the door. MyMedRec changed everything. I can go back and read exactly what was discussed, in words I actually understand. It's like having a medical translator in my pocket."</p>
            <div className="font-semibold">— James T., Patient</div>
          </Card>
          <Card className="flex flex-col gap-4">
            <p className="text-muted italic flex-1">"After my cancer diagnosis, I was in a fog during every appointment. My wife and I would argue about what the oncologist actually said. Now we both just open MyMedRec after and read the summary together. It's brought clarity to the scariest time of our lives."</p>
            <div className="font-semibold">— David & Maria K., Patients</div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 w-full mb-16">
        <Card className="text-center py-16 px-8 flex flex-col items-center gap-6" style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-border)' }}>
          <h2 className="text-3xl font-bold text-primary-dark">See what MyMedRec feels like</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">Explore the demo dashboard with 12 months of realistic medical history for a fictional patient. See recordings, summaries, medications, and drug interaction alerts.</p>
          <Link to="/app">
            <Button style={{ padding: '16px 32px', fontSize: '1.125rem' }}>Open Demo Dashboard</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
