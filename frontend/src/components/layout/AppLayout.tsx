import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, ClipboardList, User, LogOut,
  Menu, X, Microscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Report', Icon: Upload },
  { to: '/reports', label: 'Report History', Icon: ClipboardList },
  { to: '/profile', label: 'My Profile', Icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = ({ mobile = false }) => {
    const displayName = user?.username || user?.name || user?.email || 'User';
    const initial = displayName.trim().charAt(0).toUpperCase();

    return (
      <aside
        role="navigation"
        aria-label="Main navigation"
        style={{
          width: mobile ? '100%' : 'var(--sidebar-width)',
          background: 'var(--navy)',
          display: 'flex',
          flexDirection: 'column',
          height: mobile ? 'auto' : '100vh',
          position: mobile ? 'relative' : 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        {/* Brand */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, background: 'var(--teal)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Microscope size={18} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>
                MediLens
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6875rem' }}>
                Medical Report Platform
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                transition: 'background 0.15s, color 0.15s',
              })}
            >
              <Icon size={18} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', marginBottom: 4,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--teal)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
                flexShrink: 0,
              }}>
                {initial}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: '0.8125rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 'var(--radius-sm)',
            color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none',
            fontSize: '0.875rem', cursor: 'pointer', transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={18} aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
};

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <div style={{ width: 'var(--sidebar-width)', flexShrink: 0 }} className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile header */}
      <div className="mobile-header" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--navy)', padding: '12px 16px',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--teal)',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Microscope size={14} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9375rem' }}>MediLens</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          style={{ background: 'none', border: 'none', color: '#fff', padding: 4 }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="mobile-nav-overlay" style={{
          position: 'fixed', top: 52, left: 0, right: 0, zIndex: 190,
        }}>
          <Sidebar mobile />
        </div>
      )}

      {/* Main content */}
      <main
        role="main"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          main { padding-top: 52px; }
        }
      `}</style>
    </div>
  );
}
