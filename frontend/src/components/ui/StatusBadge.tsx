import React from 'react';
import { ParameterStatus } from '../../types';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ParameterStatus;
  showIcon?: boolean;
}

const config = {
  normal: {
    label: 'Normal',
    bg: 'var(--success-bg)',
    color: 'var(--success)',
    border: 'var(--success-border)',
    Icon: CheckCircle,
  },
  above: {
    label: 'Above range',
    bg: 'var(--danger-bg)',
    color: 'var(--danger)',
    border: 'var(--danger-border)',
    Icon: TrendingUp,
  },
  below: {
    label: 'Below range',
    bg: 'var(--warning-bg)',
    color: 'var(--warning)',
    border: 'var(--warning-border)',
    Icon: TrendingDown,
  },
};

export default function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const { label, bg, color, border, Icon } = config[status];
  return (
    <span
      aria-label={`Status: ${label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: '0.75rem',
        fontWeight: 600,
        background: bg,
        color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {showIcon && <Icon size={12} aria-hidden />}
      {label}
    </span>
  );
}
