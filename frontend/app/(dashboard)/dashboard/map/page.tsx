'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Layers, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { MapConfig, RegionSummary, Station } from '@/lib/types';
import { formatNumber, REGION_COLORS, REGION_LABELS } from '@/lib/utils';

const PolarMap = dynamic(() => import('@/components/maps/PolarMap'), {
  ssr: false,
  loading: () => (
    <div className="grid h-[560px] place-items-center rounded-2xl border border-white/10 bg-white/5">
      <Loader2 className="h-8 w-8 animate-spin text-ice-300" />
    </div>
  ),
});

export default function MapPage() {
  const [style, setStyle] = useState<'basemap' | 'satellite'>('basemap');

  const configQuery = useQuery({
    queryKey: ['map-config'],
    queryFn: async () => (await api.get<MapConfig>('/stations/map-config')).data,
  });
  const stationsQuery = useQuery({
    queryKey: ['stations'],
    queryFn: async () => (await api.get<Station[]>('/stations')).data,
  });
  const summaryQuery = useQuery({
    queryKey: ['region-summary'],
    queryFn: async () => (await api.get<RegionSummary[]>('/stations/region-summary')).data,
  });

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-3 border-b border-slate-300 bg-gradient-to-r from-[#eef5fa] to-[#f5f9fc] px-5 py-3.5 shadow-sm">
        <span className="text-sm font-medium text-slate-600">Maps</span>
        <span className="text-slate-400">/</span>
        <span className="text-sm font-medium text-slate-600">Dataviz</span>
        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          New
        </span>
      </div>

      {configQuery.data ? (
        <div className="relative overflow-hidden bg-white shadow-sm">
          <PolarMap
            config={configQuery.data}
            stations={stationsQuery.data ?? []}
            summaries={summaryQuery.data ?? []}
            style={style}
            height={620}
          />
          <div className="absolute right-5 top-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setStyle('basemap')}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                style === 'basemap'
                  ? 'border-sky-400 bg-sky-50 text-sky-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Basemap view"
            >
              Base
            </button>
            <button
              type="button"
              onClick={() => setStyle('satellite')}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                style === 'satellite'
                  ? 'border-sky-400 bg-sky-50 text-sky-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Satellite view"
            >
              Sat
            </button>
          </div>
        </div>
      ) : (
        <div className="grid h-[620px] place-items-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        </div>
      )}
    </div>
  );
}
