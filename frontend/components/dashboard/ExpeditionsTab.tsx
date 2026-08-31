'use client';

import React from 'react';
import {
  Calendar,
  Compass,
  MapPin,
  Ship,
  User,
} from 'lucide-react';

import { INITIAL_EXPEDITIONS } from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

export function ExpeditionsTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
          <Ship className="w-5 h-5 text-[#008b8b]" />
          <span>Polar Expeditions Directory</span>
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
          Chronicles of the Indian Scientific Expeditions to Antarctica (ISEA), Arctic Campaigns, and Southern Ocean voyages.
        </p>
      </div>

      {/* Expeditions List */}
      <div className="space-y-4">
        {INITIAL_EXPEDITIONS.map((exp) => (
          <div
            key={exp.id}
            className={`p-6 rounded-2xl border transition hover:shadow-lg ${
              isDark ? 'bg-[#0f2233] border-white/5' : 'bg-white border-[#e5e7eb]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#008b8b] bg-cyan-500/10 px-2.5 py-0.5 rounded">
                  {exp.code}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    exp.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  ● {exp.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#8aa0b3]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp.dates}</span>
                </span>
                <span>Season: {exp.season}</span>
              </div>
            </div>

            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
              {exp.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3.5 rounded-xl bg-black/20 text-xs">
              <div>
                <span className="text-[#8aa0b3] text-[10px] uppercase block">Expedition Vessel</span>
                <span className="font-bold text-white mt-0.5 flex items-center gap-1">
                  <Ship className="w-3.5 h-3.5 text-[#5fd0c4]" />
                  {exp.vessel}
                </span>
              </div>
              <div>
                <span className="text-[#8aa0b3] text-[10px] uppercase block">Voyage Leader</span>
                <span className="font-bold text-white mt-0.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#3b82f6]" />
                  {exp.leader}
                </span>
              </div>
              <div>
                <span className="text-[#8aa0b3] text-[10px] uppercase block">Geographic Sector</span>
                <span className="font-bold text-white mt-0.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  {exp.region}
                </span>
              </div>
            </div>

            {/* Scientific Objectives */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5fd0c4]">
                Scientific Objectives & Milestones
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {exp.objectives.map((obj, i) => (
                  <li
                    key={i}
                    className="text-xs text-gray-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008b8b] mt-1.5 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stations visited */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-[#8aa0b3]">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#008b8b]" />
                <span>Base Ports & Stations: <strong>{exp.stations_visited.join(' → ')}</strong></span>
              </div>
              <span>Datasets Harvested: <strong>{exp.datasets_collected}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
