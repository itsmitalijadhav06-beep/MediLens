import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 24px',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <div style={{ color: 'var(--gray-300)', marginBottom: 4 }}>{icon}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gray-700)', margin: 0 }}>{title}</h3>
      {description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', maxWidth: 320, lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
