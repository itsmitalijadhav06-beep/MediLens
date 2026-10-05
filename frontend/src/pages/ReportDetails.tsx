import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Hash, CheckCircle2, TrendingUp, TrendingDown,
  Loader2, AlertCircle, ShieldAlert, Trash2, BrainCircuit, FileText,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ParameterTable from '../components/reports/ParameterTable';
import StatusDonutChart from '../components/charts/StatusDonutChart';
import { Report } from '../types';
import { reportsApi } from '../api/reports';

export default function ReportDetails() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    setLoading(true);
    reportsApi
      .getById(Number(reportId))
      .then((data) => setReport(data))
      .catch((err) => setError(err?.response?.data?.message || 'Could not load this report.'))
      .finally(() => setLoading(false));
  }, [reportId]);

  const handleDelete = async () => {
    if (!report) return;
    setDeleting(true);
    try {
      await reportsApi.delete(report.id);
      navigate('/reports', { replace: true });
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setError('Delete failed. Please try again.');
    }
  };

  return (
    <AppLayout>
      {/* Top bar */}
      <div style={{
        padding: '20px 32px 0',
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
      }}>
        <div style={{ marginBottom: 14 }}>
          <Link
            to="/reports"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} /> Back to history
          </Link>
        </div>

        {report && !loading && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
                {report.name}
              </h1>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                  <Hash size={13} aria-hidden /> Report #{report.id}
                </span>
                {report.date && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                    <Calendar size={13} aria-hidden />
                    {new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Delete this report"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--danger-bg)', color: 'var(--danger)',
                border: '1px solid var(--danger-border)', cursor: 'pointer',
                fontSize: '0.8125rem', fontWeight: 500,
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 24, color: 'var(--gray-500)' }}>
            <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
            Loading report…
          </div>
        )}

        {/* Error */}
        {error && (
          <div role="alert" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)', borderRadius: 'var(--radius)',
            color: 'var(--danger)', fontSize: '0.875rem',
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Empty / no report */}
        {!loading && !error && !report && (
          <Card>
            <EmptyState
              icon={<FileText size={44} />}
              title="Report not found"
              description="This report may have been deleted or the link is incorrect."
              action={<Link to="/reports"><Button variant="outline">View all reports</Button></Link>}
            />
          </Card>
        )}

        {/* Report content */}
        {!loading && report && (
          <>
            {/* Status summary + chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="details-grid">
              <Card>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 16 }}>
                  Parameter status
                </h2>
                {report.statusSummary ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Normal', count: report.statusSummary.normal, color: 'var(--success)', bg: 'var(--success-bg)', Icon: CheckCircle2 },
                      { label: 'Above range', count: report.statusSummary.above, color: 'var(--danger)', bg: 'var(--danger-bg)', Icon: TrendingUp },
                      { label: 'Below range', count: report.statusSummary.below, color: 'var(--warning)', bg: 'var(--warning-bg)', Icon: TrendingDown },
                    ].map(({ label, count, color, bg, Icon }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: bg, borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color }}>
                          <Icon size={15} aria-hidden />
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
                        </div>
                        <span style={{ fontWeight: 700, color, fontSize: '1.0625rem' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No summary available.</p>
                )}
              </Card>

              <Card>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 16 }}>
                  Distribution
                </h2>
                <StatusDonutChart
                  normal={report.statusSummary?.normal ?? 0}
                  above={report.statusSummary?.above ?? 0}
                  below={report.statusSummary?.below ?? 0}
                />
              </Card>
            </div>

            {/* AI Summary */}
            {report.aiSummary ? (
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 36, height: 36, background: 'var(--teal-pale)',
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BrainCircuit size={18} color="var(--teal)" />
                  </div>
                  <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>
                    AI-assisted summary
                  </h2>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.75, margin: 0 }}>
                  {report.aiSummary}
                </p>
                <Disclaimer />
              </Card>
            ) : (
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 36, height: 36, background: 'var(--teal-pale)',
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BrainCircuit size={18} color="var(--teal)" />
                  </div>
                  <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>
                    AI-assisted summary
                  </h2>
                </div>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', margin: '0 0 16px' }}>
                  No summary available for this report.
                </p>
                <Disclaimer />
              </Card>
            )}

            {/* Parameters table */}
            <Card>
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 16 }}>
                Detailed results
              </h2>
              <ParameterTable parameters={report.parameters ?? []} />
            </Card>
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(15,39,68,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteConfirm(false); }}
        >
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            padding: 28, maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-lg)',
          }}>
            <h2 id="delete-dialog-title" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>
              Delete this report?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 24, lineHeight: 1.6 }}>
              This will permanently delete <strong>{report?.name}</strong>. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>
                Delete report
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppLayout>
  );
}

function Disclaimer() {
  return (
    <div style={{
      marginTop: 16, padding: '10px 14px',
      background: 'var(--sky-pale)', border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: 8,
    }}>
      <ShieldAlert size={14} color="var(--sky)" style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.6 }}>
        <strong>Educational observation only.</strong> This is not intended as medical diagnosis or treatment advice. Consult a qualified healthcare provider to interpret your results.
      </p>
    </div>
  );
}
