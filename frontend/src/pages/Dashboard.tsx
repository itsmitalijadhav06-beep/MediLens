import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, ClipboardList, FileText, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';

const statCards = [
  { label: 'Total reports', icon: FileText, color: 'var(--teal)', bg: 'var(--teal-pale)' },
  { label: 'Parameters reviewed', icon: ClipboardList, color: 'var(--sky)', bg: 'var(--sky-pale)' },
  { label: 'Above range', icon: TrendingUp, color: 'var(--danger)', bg: 'var(--danger-bg)' },
  { label: 'Below range', icon: TrendingDown, color: 'var(--warning)', bg: 'var(--warning-bg)' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.username || user?.name || (user?.email ? user.email.split('@')[0] : '');

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back${displayName ? `, ${displayName}` : ''}.`}
        action={
          <Link to="/upload">
            <Button icon={<Upload size={15} />}>Upload report</Button>
          </Link>
        }
      />

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {statCards.map(({ label, icon: Icon, color, bg }) => (
            <Card key={label} padding="20px">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} color={color} aria-hidden />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>—</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: 2 }}>{label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="dashboard-grid">
          {/* Quick upload */}
          <Card>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>
              Upload a report
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 20, lineHeight: 1.6 }}>
              Upload a PDF or image of your lab report and MediLens will extract and explain each parameter.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {['PDF', 'JPG', 'JPEG', 'PNG', 'WEBP'].map((f) => (
                <span key={f} style={{
                  fontSize: '0.6875rem', fontWeight: 600, color: 'var(--teal)',
                  background: 'var(--teal-pale)', border: '1px solid rgba(13,140,140,0.2)',
                  padding: '2px 8px', borderRadius: 4,
                }}>
                  {f}
                </span>
              ))}
            </div>
            <Link to="/upload">
              <Button icon={<Upload size={15} />} fullWidth>Upload report</Button>
            </Link>
          </Card>

          {/* Recent reports */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>
                Recent reports
              </h2>
              <Link to="/reports" style={{ fontSize: '0.8125rem', color: 'var(--teal)', fontWeight: 500 }}>
                View all
              </Link>
            </div>
            <EmptyState
              icon={<ClipboardList size={40} />}
              title="No reports yet"
              description="Upload your first report to see it here."
            />
          </Card>
        </div>

        {/* Visual summary placeholder */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>
              Parameter overview
            </h2>
          </div>
          <EmptyState
            icon={<CheckCircle2 size={40} />}
            title="No chart data available"
            description="Upload a report to see a visual overview of your parameter statuses."
            action={
              <Link to="/upload">
                <Button variant="outline" size="sm" icon={<Upload size={14} />}>
                  Upload report
                </Button>
              </Link>
            }
          />
        </Card>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          div[style*="padding: '28px 32px'"] { padding: 16px !important; }
        }
      `}</style>
    </AppLayout>
  );
}
