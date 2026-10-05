import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--teal)',
    color: '#fff',
    border: '1px solid var(--teal)',
  },
  secondary: {
    background: 'var(--navy)',
    color: '#fff',
    border: '1px solid var(--navy)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--gray-700)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--danger-bg)',
    color: 'var(--danger)',
    border: '1px solid var(--danger-border)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--teal)',
    border: '1px solid var(--teal)',
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { fontSize: '0.8125rem', padding: '6px 14px', borderRadius: 'var(--radius-sm)' },
  md: { fontSize: '0.875rem', padding: '9px 20px', borderRadius: 'var(--radius-sm)' },
  lg: { fontSize: '1rem', padding: '12px 28px', borderRadius: 'var(--radius)' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontWeight: 500,
        transition: 'opacity 0.15s, transform 0.1s',
        width: fullWidth ? '100%' : undefined,
        opacity: disabled || loading ? 0.65 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) (e.currentTarget as HTMLButtonElement).style.opacity = '1';
      }}
      {...rest}
    >
      {loading ? <Loader2 size={16} className="spin" style={{ animation: 'spin 0.8s linear infinite' }} /> : icon}
      {children}
    </button>
  );
}
