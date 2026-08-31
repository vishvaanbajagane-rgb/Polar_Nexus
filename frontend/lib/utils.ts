import { clsx, type ClassValue } from 'clsx';
import { format, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

import type { EventSeverity, PolarRegion, UserRole } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const REGION_LABELS: Record<PolarRegion, string> = {
  arctic: 'Arctic',
  antarctic: 'Antarctic',
  himalaya: 'Third Pole',
  southern_ocean: 'Southern Ocean',
  global: 'Global',
};

export const REGION_COLORS: Record<PolarRegion, string> = {
  arctic: '#38bdf8',
  antarctic: '#a78bfa',
  himalaya: '#f472b6',
  southern_ocean: '#22d3ee',
  global: '#94a3b8',
};

export const SEVERITY_COLORS: Record<EventSeverity, string> = {
  low: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30',
  moderate: 'text-amber-300 bg-amber-500/10 border-amber-400/30',
  high: 'text-orange-300 bg-orange-500/10 border-orange-400/30',
  critical: 'text-rose-300 bg-rose-500/10 border-rose-400/30',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  public: 'Public Explorer',
  educator: 'Educator',
  researcher: 'Researcher',
  admin: 'Administrator',
};

export function formatDate(value?: string | null, pattern = 'dd MMM yyyy') {
  if (!value) return '—';
  try {
    return format(parseISO(value), pattern);
  } catch {
    return value;
  }
}

export function formatNumber(value?: number | null, digits = 0) {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatSize(mb?: number | null) {
  if (!mb) return '—';
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`;
}
