'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Building,
  ExternalLink,
  FlaskConical,
  Mail,
  MapPin,
  Ship,
  User,
} from 'lucide-react';

import {
  INITIAL_PUBLICATIONS,
  INITIAL_SCIENTISTS,
  ScientistItem,
} from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

export function ScientistsTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  const [selectedScientistId, setSelectedScientistId] = useState<string>(
    INITIAL_SCIENTISTS[0].id
  );

  const selectedScientist =
    INITIAL_SCIENTISTS.find((s) => s.id === selectedScientistId) ||
    INITIAL_SCIENTISTS[0];

  const linkedPublications = INITIAL_PUBLICATIONS.filter((p) =>
    selectedScientist.publication_ids.includes(p.id)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
          Polar Scientists & Research Directory
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
          Researcher profiles linked to their datasets, publications, expeditions, and observation stations.
        </p>
      </div>

      {/* Directory Layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Scientists List */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-2.5">
          {INITIAL_SCIENTISTS.map((sci) => {
            const isSelected = sci.id === selectedScientistId;
            const initial = sci.name.replace('Dr. ', '').charAt(0);

            return (
              <button
                key={sci.id}
                type="button"
                onClick={() => setSelectedScientistId(sci.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-[#e0f2f7] dark:bg-[#008b8b]/20 border-[#008b8b] shadow-sm'
                    : isDark
                    ? 'bg-[#0f2233] border-white/5 hover:bg-white/5'
                    : 'bg-white border-[#e5e7eb] hover:bg-[#f4f7f9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: sci.avatar_color }}
                  >
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-bold truncate ${
                        isDark ? 'text-white' : 'text-[#0b1721]'
                      }`}
                    >
                      {sci.name}
                    </div>
                    <div className="text-[11px] text-[#8aa0b3] truncate mt-0.5">
                      {sci.role_title}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#5fd0c4] uppercase font-semibold tracking-wider mt-2 truncate">
                  {sci.domains.join(' · ')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Selected Scientist Details */}
        <div className="flex-1 min-w-0">
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#0f2233] border-white/10' : 'bg-white border-[#e5e7eb]'
            }`}
          >
            {/* Top Profile Banner */}
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md"
                style={{ backgroundColor: selectedScientist.avatar_color }}
              >
                {selectedScientist.name.replace('Dr. ', '').charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-[#0b1721]'
                  }`}
                >
                  {selectedScientist.name}
                </h2>
                <div className="text-xs font-medium text-[#5fd0c4] mt-0.5">
                  {selectedScientist.role_title}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#8aa0b3] mt-2">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>{selectedScientist.organization}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedScientist.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs leading-relaxed text-gray-300 dark:text-gray-300 mb-6">
              {selectedScientist.bio}
            </p>

            {/* Metric Counters */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/10 text-center">
                <Ship className="w-4 h-4 text-[#8b5cf6] mx-auto mb-1" />
                <div className="text-base font-bold text-purple-300">
                  {selectedScientist.expeditions.length}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[#8aa0b3]">
                  Expeditions
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 text-center">
                <MapPin className="w-4 h-4 text-[#008b8b] mx-auto mb-1" />
                <div className="text-base font-bold text-[#5fd0c4]">
                  {selectedScientist.stations.length}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[#8aa0b3]">
                  Stations Visited
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 text-center">
                <BookOpen className="w-4 h-4 text-[#3b82f6] mx-auto mb-1" />
                <div className="text-base font-bold text-blue-300">
                  {linkedPublications.length}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[#8aa0b3]">
                  Publications
                </div>
              </div>
            </div>

            {/* Expeditions & Stations lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8aa0b3] mb-2">
                  Expeditions Participated
                </div>
                <ul className="space-y-1.5">
                  {selectedScientist.expeditions.map((exp, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-300 flex items-start gap-2"
                    >
                      <Ship className="w-3.5 h-3.5 text-[#8aa0b3] mt-0.5 flex-shrink-0" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8aa0b3] mb-2">
                  Stations & Deployments
                </div>
                <ul className="space-y-1.5">
                  {selectedScientist.stations.map((st, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-300 flex items-start gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#8aa0b3] mt-0.5 flex-shrink-0" />
                      <span>{st} Research Station</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Linked Publications */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8aa0b3] mb-2">
                Recent Peer-Reviewed Publications
              </div>
              <div className="space-y-2">
                {linkedPublications.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-3.5 rounded-xl border transition ${
                      isDark
                        ? 'bg-[#091724] border-white/5 hover:border-cyan-500/40'
                        : 'bg-[#f8fafc] border-[#e5e7eb] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white hover:text-[#5fd0c4]">
                        {p.title}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                    <div className="text-[11px] text-[#8aa0b3] mt-1">
                      {p.journal} · {p.year} · {p.authors}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
