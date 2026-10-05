import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusDonutChartProps {
  normal: number;
  above: number;
  below: number;
}

export default function StatusDonutChart({ normal, above, below }: StatusDonutChartProps) {
  const total = normal + above + below;

  if (total === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 200, color: 'var(--gray-400)', fontSize: '0.875rem',
      }}>
        No chart data available.
      </div>
    );
  }

  const data = {
    labels: ['Normal', 'Above range', 'Below range'],
    datasets: [
      {
        data: [normal, above, below],
        backgroundColor: ['#0f766e', '#b91c1c', '#b45309'],
        borderColor: ['#f0fdf9', '#fef2f2', '#fffbeb'],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 16,
          font: { size: 12, family: "'Inter', sans-serif" },
          color: '#334155',
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} (${Math.round((ctx.parsed / total) * 100)}%)`,
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: 220 }}>
      <Doughnut data={data} options={options} aria-label="Parameter status distribution chart" />
    </div>
  );
}
