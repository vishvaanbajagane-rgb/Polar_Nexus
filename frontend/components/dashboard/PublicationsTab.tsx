'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  Layers,
  Search,
} from 'lucide-react';

import { INITIAL_PUBLICATIONS, PublicationItem } from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

export function PublicationsTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  const [publications] = useState<PublicationItem[]>(INITIAL_PUBLICATIONS);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const domains = ['All', 'Climate', 'Biology', 'Hydrography', 'Glaciology', 'Sea Ice', 'Atmospheric Science', 'Oceanography'];

  const filtered = publications.filter((p) => {
    const matchDomain = selectedDomain === 'All' || p.domain === selectedDomain;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.journal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDomain && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-[#0b1721]' : 'text-white'}`}>
            Peer-Reviewed Polar Publications
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-[#5a6f82]' : 'text-[#8aa0b3]'}`}>
            Indexed scholarly articles from NCPOR research expeditions with direct DOI and publisher repository links.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa0b3]" />
          <input
            type="text"
            placeholder="Search papers by title, author, or journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-10 pl-9 pr-4 text-xs rounded-xl border outline-none transition ${
              isDark
                ? 'bg-white border-gray-200 text-[#0b1721] placeholder-gray-400 focus:border-[#008b8b]'
                : 'bg-[#0f2233] border-white/10 text-white placeholder-[#8aa0b3] focus:border-[#008b8b]'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {domains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedDomain === d
                  ? 'bg-[#3b82f6] text-white shadow-sm'
                  : isDark
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  : 'bg-[#0f2233] border border-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-3.5">
        {filtered.map((pub) => {
          const isExpanded = expandedId === pub.id;
          return (
            <div
              key={pub.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-white border-gray-200 hover:shadow-md'
                  : 'bg-[#0f2233] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {pub.domain}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {pub.journal} ({pub.year})
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                      {pub.source_repository}
                    </span>
                  </div>

                  <h2 className={`text-base font-bold leading-snug ${isDark ? 'text-[#0b1721]' : 'text-white'}`}>
                    {pub.title}
                  </h2>

                  <p className={`text-xs font-medium ${isDark ? 'text-[#5a6f82]' : 'text-[#8aa0b3]'}`}>
                    Authors: {pub.authors}
                  </p>
                </div>

                {/* Right Direct Links */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#008b8b] hover:bg-[#007575] text-white font-semibold text-xs transition shadow-sm"
                  >
                    <span>Open Live Paper (DOI)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <span className="text-[11px] text-gray-500 font-mono">
                    Citations: {pub.citations}
                  </span>
                </div>
              </div>

              {/* Expandable Abstract Toggle */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#008b8b] hover:underline"
                >
                  <span>{isExpanded ? 'Hide Abstract' : 'View Full Abstract & Linked Data'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                  DOI: {pub.doi}
                </div>
              </div>

              {/* Abstract Drawer */}
              {isExpanded && (
                <div className={`mt-3 p-4 rounded-xl text-xs leading-relaxed border ${
                  isDark ? 'bg-[#f8fafc] border-gray-200 text-gray-700' : 'bg-black/20 border-white/5 text-gray-300'
                }`}>
                  <div className="font-bold text-[11px] uppercase tracking-wider text-[#008b8b] mb-1.5">
                    Abstract
                  </div>
                  <p>{pub.abstract}</p>

                  <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      Publisher Source: <strong className="text-gray-700 dark:text-gray-200">{pub.source_repository}</strong>
                    </span>
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#008b8b] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Direct Article Access: {pub.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
