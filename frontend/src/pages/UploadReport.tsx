import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, File, X, CheckCircle, AlertCircle, Loader2,
  FileText, Image as ImageIcon, Info,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { reportsApi } from '../api/reports';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = '.pdf,.jpg,.jpeg,.png,.webp';
const MAX_SIZE_MB = 10;

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(file: File) {
  return file.type === 'application/pdf' ? FileText : ImageIcon;
}

export default function UploadReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [reportName, setReportName] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileError, setFileError] = useState('');

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return 'Unsupported file type. Please upload a PDF, JPG, JPEG, PNG, or WEBP.';
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File exceeds the ${MAX_SIZE_MB} MB size limit.`;
    }
    return null;
  };

  const handleFile = (f: File) => {
    const err = validateFile(f);
    if (err) { setFileError(err); return; }
    setFileError('');
    setFile(f);
    setStatus('idle');
    setErrorMessage('');
    if (!reportName) {
      setReportName(f.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '));
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
    e.target.value = '';
  };

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    setErrorMessage('');
    setFileError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('report', file);
    if (reportName) formData.append('name', reportName);
    if (reportDate) formData.append('date', reportDate);

    try {
      setStatus('uploading');
      const result = await reportsApi.upload(formData);
      setStatus('processing');
      // After a brief processing phase, navigate to the report details
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => navigate(`/reports/${result.reportId || result.id}`), 1200);
      }, 1500);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  const FileIcon = file ? getFileIcon(file) : File;

  return (
    <AppLayout>
      <PageHeader
        title="Upload report"
        subtitle="Upload a PDF or image of your lab report."
      />

      <div style={{ padding: '28px 32px', maxWidth: 720 }}>
        <Card style={{ marginBottom: 20 }}>
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Drop file here or click to browse"
            onClick={() => !file && fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            style={{
              border: `2px dashed ${dragOver ? 'var(--teal)' : file ? 'var(--gray-300)' : 'var(--gray-300)'}`,
              borderRadius: 'var(--radius)',
              padding: '40px 24px',
              textAlign: 'center',
              background: dragOver ? 'var(--teal-pale)' : file ? 'var(--gray-50)' : '#fff',
              transition: 'border-color 0.15s, background 0.15s',
              cursor: file ? 'default' : 'pointer',
            }}
          >
            {!file ? (
              <>
                <div style={{
                  width: 56, height: 56, background: 'var(--gray-100)',
                  borderRadius: 12, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  <Upload size={26} color="var(--gray-400)" />
                </div>
                <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6 }}>
                  Drag and drop your file here
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: 18 }}>
                  or click to browse your device
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  icon={<Upload size={14} />}
                >
                  Browse files
                </Button>
                <div style={{ marginTop: 20, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['PDF', 'JPG', 'JPEG', 'PNG', 'WEBP'].map((f) => (
                    <span key={f} style={{
                      fontSize: '0.6875rem', fontWeight: 600, color: 'var(--gray-500)',
                      background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 4,
                    }}>
                      {f}
                    </span>
                  ))}
                  <span style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', alignSelf: 'center' }}>
                    · Max {MAX_SIZE_MB} MB
                  </span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', flexWrap: 'wrap' }}>
                <div style={{
                  width: 48, height: 48, background: 'var(--teal-pale)',
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileIcon size={24} color="var(--teal)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, color: 'var(--gray-900)', fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: 2 }}>
                    {formatBytes(file.size)} · {file.type.split('/')[1].toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  aria-label="Remove file"
                  style={{
                    background: 'var(--gray-100)', border: 'none', borderRadius: '50%',
                    width: 30, height: 30, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <X size={14} color="var(--gray-500)" />
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={onFileInput}
            style={{ display: 'none' }}
            aria-hidden
          />

          {fileError && (
            <div role="alert" style={{
              marginTop: 12, padding: '9px 14px',
              background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--danger)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <AlertCircle size={15} aria-hidden />
              {fileError}
            </div>
          )}

          {/* Optional fields */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="upload-fields">
            <Input
              label="Report name"
              type="text"
              placeholder="e.g. Complete Blood Count"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              hint="Optional — auto-filled from filename"
            />
            <Input
              label="Report date"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              hint="Optional — date printed on the report"
            />
          </div>
        </Card>

        {/* Status messages */}
        {status === 'uploading' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px', background: 'var(--sky-pale)',
            border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)',
            marginBottom: 16, fontSize: '0.875rem', color: 'var(--navy)',
          }}>
            <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} color="var(--teal)" />
            Uploading your report…
          </div>
        )}
        {status === 'processing' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px', background: 'var(--teal-pale)',
            border: '1px solid rgba(13,140,140,0.25)', borderRadius: 'var(--radius)',
            marginBottom: 16, fontSize: '0.875rem', color: 'var(--teal)',
          }}>
            <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
            Processing report — extracting parameters…
          </div>
        )}
        {status === 'success' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px', background: 'var(--success-bg)',
            border: '1px solid var(--success-border)', borderRadius: 'var(--radius)',
            marginBottom: 16, fontSize: '0.875rem', color: 'var(--success)',
          }}>
            <CheckCircle size={18} />
            Report processed successfully. Redirecting…
          </div>
        )}
        {status === 'error' && (
          <div role="alert" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px', background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)', borderRadius: 'var(--radius)',
            marginBottom: 16, fontSize: '0.875rem', color: 'var(--danger)',
          }}>
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          display: 'flex', gap: 10, padding: '12px 16px',
          background: 'var(--sky-pale)', border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-sm)', marginBottom: 20,
          fontSize: '0.8125rem', color: 'var(--gray-600)',
        }}>
          <Info size={15} color="var(--sky)" style={{ flexShrink: 0, marginTop: 1 }} />
          MediLens extracts and explains report data for educational understanding only. Results are not medical advice.
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            onClick={handleUpload}
            disabled={!file || status === 'uploading' || status === 'processing' || status === 'success'}
            loading={status === 'uploading' || status === 'processing'}
            size="lg"
            icon={<Upload size={16} />}
          >
            {status === 'uploading' ? 'Uploading…' : status === 'processing' ? 'Processing…' : 'Upload and process'}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={removeFile}
            disabled={!file || status === 'uploading' || status === 'processing'}
          >
            Clear
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .upload-fields { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppLayout>
  );
}
