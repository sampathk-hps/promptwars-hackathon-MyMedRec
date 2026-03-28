import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Logo, Button } from '../components/UI';
import { Menu } from 'lucide-react';

export const LandingLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* Sticky Navigation */}
      <nav aria-label="Main Navigation" style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          
          <div className="hidden-mobile gap-8 items-center font-medium text-muted">
            <a href="#features" className="hover:text-primary">Features</a>
            <a href="#how-it-works" className="hover:text-primary">How It Works</a>
            <a href="#security" className="hover:text-primary">Security</a>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/app">
              <Button className="hidden-mobile">Try the Demo</Button>
            </Link>
            <button aria-label="Toggle Navigation Menu" className="hidden-desktop btn-outline p-2" style={{ borderRadius: 'var(--radius-md)' }}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }} className="py-8 px-4 md:px-8">
        <div className="max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo />
          <div className="flex gap-4 text-sm text-muted">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#security">Security</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
          <div className="text-sm text-muted">
            Your health conversations, captured and clarified. <br/>
            &copy; 2026 MyMedRec. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
