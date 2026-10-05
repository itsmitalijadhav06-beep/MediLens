import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, Upload, Eye, Trash2, Hash, Calendar,
  Loader2, AlertCircle, CheckCircle2, TrendingUp, TrendingDown,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { Report } from '../types';
import { reportsApi } from '../api/reports';

export default function ReportHistory() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    reportsApi
      .list()
      .then((data) => setReports(data))
      .catch((err) => setError(err?.response?.data?.message || 'Could not load reports.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await reportsApi.delete(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Delete failed. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Report history"
        subtitle="All your uploaded and processed reports."
        action={
          <Link to="/upload">
            <Button icon={<Upload size={15} />} size="sm">Upload report</Button>
          </Link>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray-500)', padding: '24px 0' }}>
            <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
            Loading reports…
          </div>
        )}

        {error && (
          <div role="alert" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)', borderRadius: 'var(--radius)',
            color: 'var(--danger)', fontSize: '0.875rem', marginBottom: 20,
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <Card>
            <EmptyState
              icon={<ClipboardList size={44} />}
              title="No reports available"
              description="You haven't uploaded any reports yet. Upload a PDF or image of a lab report to get started."
              action={
                <Link to="/upload">
                  <Button icon={<Upload size={15} />}>Upload your first report</Button>
                </Link>
              }
            />
          </Card>
        )}

        {!loading && reports.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reports.map((report) => (
              <Card key={report.id} padding="18px 20px">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {/* Report identity */}
                  <div style={{
                    width: 40, height: 40, background: 'var(--teal-pale)',
                    borderRadius: 10, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <ClipboardList size={20} color="var(--teal)" aria-hidden />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.9375rem', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {report.name}
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        <Hash size={12} aria-hidden /> Report #{report.id}
                      </span>
                      {report.date && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                          <Calendar size={12} aria-hidden />
                          {new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      {report.parameterCount !== undefined && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                          {report.parameterCount} parameter{report.parameterCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status mini-pills */}
                  {report.statusSummary && (
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} className="status-pills">
                      <StatusPill count={report.statusSummary.normal} Icon={CheckCircle2} color="var(--success)" bg="var(--success-bg)" label="normal" />
                      <StatusPill count={report.statusSummary.above} Icon={TrendingUp} color="var(--danger)" bg="var(--danger-bg)" label="above" />
                      <StatusPill count={report.statusSummary.below} Icon={TrendingDown} color="var(--warning)" bg="var(--warning-bg)" label="below" />
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Link to={`/reports/${report.id}`}>
                      <Button variant="outline" size="sm" icon={<Eye size={14} />}>View</Button>
                    </Link>
                    {confirmId === report.id ? (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={deletingId === report.id}
                          onClick={() => handleDelete(report.id)}
                        >
                          Confirm
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmId(report.id)}
                        aria-label={`Delete report ${report.name}`}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--gray-400)', padding: 6, borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .status-pills { display: none !important; }
        }
      `}</style>
    </AppLayout>
  );
}

function StatusPill({ count, Icon, color, bg, label }: {
  count: number; Icon: any; color: string; bg: string; label: string;
}) {
  return (
    <span
      aria-label={`${count} ${label}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 20, background: bg,
        fontSize: '0.75rem', fontWeight: 600, color,
      }}
    >
      <Icon size={11} aria-hidden /> {count}
    </span>
  );
}
