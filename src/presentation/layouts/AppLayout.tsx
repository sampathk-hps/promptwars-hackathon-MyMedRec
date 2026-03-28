import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mic, FileText, Pill, Bell, LogOut } from 'lucide-react';
import { Logo } from '../components/UI';
import { useAuth } from '../../application/context/AuthContext';

const NAV_ITEMS = [
  { path: '/app', icon: LayoutDashboard, label: 'Home' },
  { path: '/app/recordings', icon: Mic, label: 'Visits' },
  { path: '/app/records', icon: FileText, label: 'Records' },
  { path: '/app/medications', icon: Pill, label: 'Meds' },
];

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
      
      {/* Mobile Top Bar */}
      <header className="hidden-desktop" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        backgroundColor: 'white', borderBottom: '1px solid var(--border-color)',
        zIndex: 40, padding: '0 var(--spacing-4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div className="scale-75 origin-left"><Logo /></div>
        <div className="flex items-center gap-4">
          <div style={{ position: 'relative' }}>
            <Bell size={20} className="text-muted" />
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              backgroundColor: 'var(--coral)', color: 'white',
              fontSize: '10px', width: '14px', height: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', fontWeight: 'bold'
            }}><span className="sr-only">2 unread notifications</span><span aria-hidden="true">2</span></span>
          </div>
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="avatar avatar-sm outline outline-1 outline-offset-2 outline-border" />
          ) : (
            <div className="avatar avatar-sm outline outline-1 outline-offset-2 outline-border">{user?.name?.charAt(0) || 'U'}</div>
          )}
          <button onClick={logout} className="text-muted hover:text-red-500 p-2 ml-2" title="Logout" aria-label="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside aria-label="Sidebar" className="hidden-mobile flex-col border-r bg-white" style={{
        position: 'fixed', top: 0, bottom: 0, left: 0, width: '240px',
        borderRight: '1px solid var(--border-color)', zIndex: 40,
        backgroundColor: 'white'
      }}>
        <div className="p-6">
          <Logo />
        </div>
        <nav aria-label="Desktop Navigation" className="flex-1 px-4 flex flex-col gap-2 mt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t" style={{ borderTop: '1px solid var(--border-color)'}}>
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="avatar" />
            ) : (
              <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-primary-dark truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-muted truncate">{user?.email || ''}</div>
            </div>
            <button onClick={logout} className="text-muted hover:text-red-500 p-2" title="Logout" aria-label="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full" style={{ 
        paddingTop: 'calc(60px + var(--spacing-6))', /* Mobile header height + padding */
        paddingBottom: 'calc(64px + var(--spacing-6))', /* Mobile tab bar height + padding */
      }}>
        {/* On Desktop, override paddings and give left margin */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            main {
              margin-left: 240px;
              padding-top: var(--spacing-8) !important;
              padding-bottom: var(--spacing-8) !important;
            }
          }
        `}} />
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav aria-label="Mobile Navigation" className="hidden-desktop" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '64px',
        backgroundColor: 'white', borderTop: '1px solid var(--border-color)',
        zIndex: 40, display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center gap-1 w-full h-full"
              style={{ color: isActive ? 'var(--primary)' : 'var(--text-secondary)' }}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};
