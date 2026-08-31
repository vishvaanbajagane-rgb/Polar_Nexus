'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { RegionSummary } from '@/lib/types';
import { REGION_COLORS, REGION_LABELS } from '@/lib/utils';

export function RegionBreakdownChart({ summaries }: { summaries: RegionSummary[] }) {
  const data = summaries.map((summary) => ({
    region: REGION_LABELS[summary.region],
    color: REGION_COLORS[summary.region],
    datasets: summary.dataset_count,
    stations: summary.station_count,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
          <XAxis dataKey="region" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(56,189,248,0.06)' }}
            contentStyle={{
              background: 'rgba(3,6,13,0.92)',
              border: '1px solid rgba(56,189,248,0.35)',
              borderRadius: 12,
              color: '#e2e8f0',
            }}
          />
          <Bar dataKey="datasets" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.region} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
