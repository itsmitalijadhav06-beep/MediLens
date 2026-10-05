import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, style, ...rest }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--gray-700)' }}
          >
            {label}
            {rest.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{
            padding: '9px 12px',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--gray-300)'}`,
            borderRadius: 'var(--radius-sm)',
            background: '#fff',
            color: 'var(--gray-900)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            width: '100%',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--teal)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,140,140,0.12)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--gray-300)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} role="alert" style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
