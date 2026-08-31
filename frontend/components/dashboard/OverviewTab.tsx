'use client';

import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Database,
  FlaskConical,
  Satellite,
} from 'lucide-react';

import {
  DatasetItem,
  INITIAL_DATASETS,
  INITIAL_PUBLICATIONS,
  INITIAL_SCIENTISTS,
  INITIAL_STATIONS,
} from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

interface OverviewTabProps {
  onSelectDataset?: (dataset: DatasetItem) => void;
}

export function OverviewTab({ onSelectDataset }: OverviewTabProps) {
  const setActiveTab = useAuthStore((state) => state.setActiveTab);
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  const metrics = [
    {
      label: 'Datasets',
      value: INITIAL_DATASETS.length,
      icon: Database,
      color: '#008b8b',
      tabId: 'datasets',
    },
    {
      label: 'Publications',
      value: INITIAL_PUBLICATIONS.length,
      icon: BookOpen,
      color: '#3b82f6',
      tabId: 'publications',
    },
    {
      label: 'Scientists',
      value: INITIAL_SCIENTISTS.length,
      icon: FlaskConical,
      color: '#8b5cf6',
      tabId: 'scientists',
    },
    {
      label: 'Stations',
      value: INITIAL_STATIONS.length,
      icon: Satellite,
      color: '#2e9e8f',
      tabId: 'stations',
    },
  ];

  const recentDatasets = INITIAL_DATASETS.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1721] to-[#0d2f3f] p-7 text-white shadow-xl border border-white/5">
        {/* Background decorative orb */}
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#008b8b]/20 blur-2xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-40 h-40 rounded-full border border-teal-500/10 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#5fd0c4] text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Discover • Understand • Innovate</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold leading-tight max-w-2xl text-white">
            Integrated Polar Science Outreach, Knowledge Repository & Media Dissemination
          </h1>

          <p className="text-[#9fb3c8] text-sm mt-2.5 max-w-xl leading-relaxed">
            Real-time access to NCPOR datasets, publications, stations and expedition observations across the Arctic and Antarctic.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(item.tabId)}
              className={`text-left p-5 rounded-2xl border transition-all hover:shadow-md active:scale-[0.99] select-none ${
                isDark
                  ? 'bg-white border-[#e5e7eb] hover:border-gray-300'
                  : 'bg-[#0f2233] border-white/10 hover:border-white/20'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${item.color}18` }}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} strokeWidth={1.8} />
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? 'text-[#0b1721]' : 'text-white'
                }`}
              >
                {item.value}
              </div>
              <div
                className={`text-xs font-medium mt-0.5 ${
                  isDark ? 'text-[#5a6f82]' : 'text-[#8aa0b3]'
                }`}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recently Updated Datasets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2
            className={`text-base font-bold ${
              isDark ? 'text-[#0b1721]' : 'text-white'
            }`}
          >
            Recently updated datasets
          </h2>
          <button
            type="button"
            onClick={() => setActiveTab('datasets')}
            className="text-xs font-semibold text-[#008b8b] hover:text-[#007575] flex items-center gap-1 transition"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recentDatasets.map((ds) => (
            <div
              key={ds.id}
              onClick={() => onSelectDataset && onSelectDataset(ds)}
              className={`p-4 rounded-xl border transition cursor-pointer hover:shadow-md select-none ${
                isDark
                  ? 'bg-white border-[#e5e7eb] hover:border-[#008b8b]/50'
                  : 'bg-[#0f2233] border-white/10 hover:border-[#008b8b]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-[#008b8b]">
                  {ds.code}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Approved
                </span>
              </div>

              <div
                className={`font-semibold text-sm line-clamp-1 mb-1 ${
                  isDark ? 'text-[#0b1721]' : 'text-white'
                }`}
              >
                {ds.title}
              </div>

              <div
                className={`text-xs ${
                  isDark ? 'text-[#5a6f82]' : 'text-[#8aa0b3]'
                }`}
              >
                {ds.domain} · {ds.region}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
