import React from 'react';
import { User, Mail, Phone, Hash, LogOut } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.username || user?.name || user?.email || 'User';
  const initial = displayName.trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppLayout>
      <PageHeader title="My profile" subtitle="Your account details." />
      <div style={{ padding: '28px 32px', maxWidth: 560 }}>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'var(--teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.25rem', fontWeight: 700, flexShrink: 0,
            }}>
              {initial}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--navy)' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                {user?.email ?? '—'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {user?.username && <InfoRow icon={<User size={15} />} label="Username" value={user.username} />}
            {user?.name && <InfoRow icon={<User size={15} />} label="Full name" value={user.name} />}
            <InfoRow icon={<Mail size={15} />} label="Email address" value={user?.email} />
            {user?.phoneNumber && <InfoRow icon={<Phone size={15} />} label="Phone number" value={user.phoneNumber} />}
            {user?.userId !== undefined && <InfoRow icon={<Hash size={15} />} label="User ID" value={`#${user.userId}`} />}
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>
            Sign out
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 16, lineHeight: 1.6 }}>
            You'll be returned to the home page. Your reports remain saved.
          </p>
          <Button variant="danger" icon={<LogOut size={15} />} onClick={handleLogout}>
            Sign out
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', background: 'var(--gray-50)',
      borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)',
    }}>
      <span style={{ color: 'var(--teal)', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray-900)', fontWeight: 500 }}>
          {value ?? '—'}
        </div>
      </div>
    </div>
  );
}
