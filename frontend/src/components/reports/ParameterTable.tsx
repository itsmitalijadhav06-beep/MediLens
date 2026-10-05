import React, { useState } from 'react';
import { Parameter } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ParameterTableProps {
  parameters: Parameter[];
}

export default function ParameterTable({ parameters }: ParameterTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!parameters.length) {
    return (
      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', padding: '24px 0', textAlign: 'center' }}>
        No parameters available.
      </p>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
            {['Test', 'Value', 'Unit', 'Reference range', 'Status'].map((col) => (
              <th
                key={col}
                scope="col"
                style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontWeight: 600, color: 'var(--gray-700)', fontSize: '0.8125rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
            <th scope="col" style={{ padding: '10px 16px', width: 40 }} aria-label="Expand" />
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, idx) => {
            const key = `${param.name}-${idx}`;
            const isExpanded = expandedRow === key;
            return (
              <React.Fragment key={key}>
                <tr
                  style={{
                    borderBottom: isExpanded ? 'none' : '1px solid var(--gray-100)',
                    background: isExpanded ? 'var(--gray-50)' : '#fff',
                    transition: 'background 0.1s',
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--navy)' }}>
                    {param.name}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--gray-900)', fontWeight: 600 }}>
                    {param.value}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--gray-500)' }}>
                    {param.unit || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--gray-600)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                    {param.referenceRange || '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={param.status} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {param.explanation && (
                      <button
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Hide' : 'Show'} explanation for ${param.name}`}
                        onClick={() => setExpandedRow(isExpanded ? null : key)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--teal)', display: 'flex', alignItems: 'center',
                        }}
                      >
                        <Info size={15} />
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    )}
                  </td>
                </tr>
                {isExpanded && param.explanation && (
                  <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <td colSpan={6} style={{ padding: '0 16px 14px', background: 'var(--gray-50)' }}>
                      <div style={{
                        padding: '12px 16px',
                        background: 'var(--teal-pale)', border: '1px solid rgba(13,140,140,0.2)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem',
                        color: 'var(--gray-700)', lineHeight: 1.7,
                      }}>
                        <strong style={{ color: 'var(--teal)', display: 'block', marginBottom: 4 }}>
                          What this means
                        </strong>
                        {param.explanation}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
