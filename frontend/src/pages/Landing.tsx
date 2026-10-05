import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, FileSearch, BrainCircuit, ShieldCheck, ChevronRight, BarChart3, ClipboardList } from 'lucide-react';

const features = [
  {
    Icon: FileSearch,
    title: 'Automated extraction',
    description: 'Upload a PDF or image of your medical report. MediLens reads and structures every parameter for you.',
  },
  {
    Icon: BarChart3,
    title: 'Visual dashboard',
    description: 'See your results at a glance — which values are within range and which need attention.',
  },
  {
    Icon: BrainCircuit,
    title: 'Plain-language explanations',
    description: 'Every parameter comes with a clear, jargon-free explanation of what it measures and why it matters.',
  },
  {
    Icon: ClipboardList,
    title: 'Report history',
    description: 'All your reports in one place. Review any past result whenever you need it.',
  },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--gray-200)',
        padding: '0 32px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: 'var(--teal)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Microscope size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--navy)' }}>MediLens</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" style={{
              fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)',
              padding: '7px 16px', borderRadius: 'var(--radius-sm)',
              transition: 'color 0.15s',
            }}>
              Sign in
            </Link>
            <Link to="/register" style={{
              fontSize: '0.875rem', fontWeight: 600, color: '#fff',
              padding: '7px 18px', borderRadius: 'var(--radius-sm)',
              background: 'var(--teal)', transition: 'opacity 0.15s',
            }}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 55%, #1a4a6e 100%)',
        padding: '96px 32px 88px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(13,140,140,0.18)', border: '1px solid rgba(13,140,140,0.35)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 32,
          }}>
            <ShieldCheck size={14} color="var(--teal-light)" />
            <span style={{ fontSize: '0.8125rem', color: 'var(--teal-light)', fontWeight: 500 }}>
              For personal understanding, not clinical diagnosis
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
            color: '#fff', lineHeight: 1.15, marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            Understand your medical<br />
            <span style={{ color: 'var(--teal-light)' }}>reports, simply.</span>
          </h1>

          <p style={{
            fontSize: '1.0625rem', color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px',
          }}>
            MediLens reads your lab reports, structures every parameter, and explains what each value means — in plain language.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--teal)', color: '#fff', fontWeight: 600,
              fontSize: '0.9375rem', padding: '13px 28px', borderRadius: 'var(--radius)',
            }}>
              Upload your first report <ChevronRight size={16} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(255,255,255,0.18)',
              fontWeight: 500, fontSize: '0.9375rem', padding: '13px 28px', borderRadius: 'var(--radius)',
            }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Supported formats */}
      <section style={{ background: 'var(--gray-50)', padding: '20px 32px', borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>Accepts:</span>
          {['PDF', 'JPG', 'JPEG', 'PNG', 'WEBP'].map((fmt) => (
            <span key={fmt} style={{
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy)',
              background: '#fff', border: '1px solid var(--gray-300)',
              padding: '3px 10px', borderRadius: 4,
            }}>
              {fmt}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
              What MediLens does
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--gray-500)', maxWidth: 480, margin: '0 auto' }}>
              From raw report to clear understanding, in one step.
            </p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24,
          }}>
            {features.map(({ Icon, title, description }) => (
              <div key={title} style={{
                padding: 28, borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)', background: '#fff',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  width: 44, height: 44, background: 'var(--teal-pale)',
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 16,
                }}>
                  <Icon size={22} color="var(--teal)" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.6, margin: 0 }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{
        background: 'var(--sky-pale)', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)',
        padding: '28px 32px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <ShieldCheck size={20} color="var(--sky)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>
            <strong>Educational use only.</strong> MediLens helps you understand the content of your lab reports. It is not a diagnostic tool and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider about your results.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '28px 32px', background: '#fff', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
          <div style={{
            width: 24, height: 24, background: 'var(--teal)',
            borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Microscope size={12} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)' }}>MediLens</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', margin: 0 }}>
          &copy; {new Date().getFullYear()} MediLens. For educational purposes only.
        </p>
      </footer>
    </div>
  );
}
