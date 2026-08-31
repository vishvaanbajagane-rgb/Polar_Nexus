'use client';

import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Globe,
  MapPin,
  TrendingDown,
} from 'lucide-react';

import { INITIAL_EVENTS } from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

export function EnvironmentalEventsTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span>Polar Environmental Events & Anomalies</span>
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
          Automated anomaly detections across sea-ice extent, ice-shelf calving, stratospheric ozone depletion, and thermal pulses.
        </p>
      </div>

      {/* Events Timeline Cards */}
      <div className="space-y-3.5">
        {INITIAL_EVENTS.map((evt) => (
          <div
            key={evt.id}
            className={`p-5 rounded-2xl border transition hover:shadow-md ${
              isDark ? 'bg-[#0f2233] border-white/5' : 'bg-white border-[#e5e7eb]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    evt.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : evt.severity === 'Warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  ● {evt.severity} Alert
                </span>
                <span className="text-xs font-semibold text-[#5fd0c4]">
                  {evt.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#8aa0b3]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{evt.date}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{evt.coordinates}</span>
                </span>
              </div>
            </div>

            <h2 className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
              {evt.title}
            </h2>

            <p className="text-xs leading-relaxed text-gray-300 dark:text-gray-300 mb-3">
              {evt.description}
            </p>

            <div className="p-3 rounded-xl bg-black/20 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span className="text-[#8aa0b3]">Quantified Anomaly Metric:</span>
              </div>
              <span className="font-mono font-bold text-cyan-200">
                {evt.anomaly_metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
