'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import type { ObservationPoint } from '@/lib/types';
import { formatDate } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(3,6,13,0.92)',
      borderColor: 'rgba(56,189,248,0.35)',
      borderWidth: 1,
      callbacks: {
        label: (context) => ` ${context.parsed.y} million km²`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(148,163,184,0.08)' },
      ticks: { color: '#64748b', maxTicksLimit: 8 },
    },
    y: {
      grid: { color: 'rgba(148,163,184,0.08)' },
      ticks: { color: '#64748b' },
      title: { display: true, text: 'million km²', color: '#64748b' },
    },
  },
};

export function SeaIceChart({ points }: { points: ObservationPoint[] }) {
  if (points.length === 0) {
    return (
      <div className="grid h-64 place-items-center text-sm text-slate-500">
        No sea-ice observations yet. Run the daily update from the admin console.
      </div>
    );
  }

  const data = {
    labels: points.map((point) => formatDate(point.observed_on, 'dd MMM')),
    datasets: [
      {
        label: 'Sea ice extent',
        data: points.map((point) => point.value),
        borderColor: '#38bdf8',
        backgroundColor: (context: { chart: ChartJS }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return 'rgba(56,189,248,0.2)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(56,189,248,0.45)');
          gradient.addColorStop(1, 'rgba(56,189,248,0)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="h-64">
      <Line options={options} data={data} />
    </div>
  );
}
