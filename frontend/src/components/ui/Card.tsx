import React, { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  padding?: string;
}

export default function Card({ children, style, padding = '24px' }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--gray-200)',
        boxShadow: 'var(--shadow-sm)',
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
