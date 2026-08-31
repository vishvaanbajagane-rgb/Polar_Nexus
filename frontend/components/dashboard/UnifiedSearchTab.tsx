'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Database,
  ExternalLink,
  FlaskConical,
  Radio,
  Search,
  Ship,
  X,
} from 'lucide-react';

import {
  INITIAL_DATASETS,
  INITIAL_EXPEDITIONS,
  INITIAL_PUBLICATIONS,
  INITIAL_SCIENTISTS,
  INITIAL_STATIONS,
  PROMPT_SUGGESTIONS,
} from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

const CATEGORIES = [
  'All',
  'Datasets',
  'Publications',
  'Stations',
  'Expeditions',
  'Scientists',
];

const DOMAINS = [
  'Sea Ice',
  'Oceanography',
  'Glaciology',
  'Atmospheric Science',
  'Biology',
  'Climate',
  'Hydrography',
];

export function UnifiedSearchTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Filter datasets
  const filteredDatasets = useMemo(() => {
    return INITIAL_DATASETS.filter((ds) => {
      const matchesQuery =
        !query ||
        ds.title.toLowerCase().includes(query.toLowerCase()) ||
        ds.code.toLowerCase().includes(query.toLowerCase()) ||
        ds.description.toLowerCase().includes(query.toLowerCase()) ||
        ds.domain.toLowerCase().includes(query.toLowerCase());

      const matchesDomain =
        selectedDomains.length === 0 || selectedDomains.includes(ds.domain);
      const matchesStatus =
        selectedStatus.length === 0 || selectedStatus.includes(ds.status);

      return matchesQuery && matchesDomain && matchesStatus;
    });
  }, [query, selectedDomains, selectedStatus]);

  // Filter publications
  const filteredPublications = useMemo(() => {
    return INITIAL_PUBLICATIONS.filter((pub) => {
      const matchesQuery =
        !query ||
        pub.title.toLowerCase().includes(query.toLowerCase()) ||
        pub.authors.toLowerCase().includes(query.toLowerCase()) ||
        pub.abstract.toLowerCase().includes(query.toLowerCase()) ||
        pub.domain.toLowerCase().includes(query.toLowerCase());

      const matchesDomain =
        selectedDomains.length === 0 || selectedDomains.includes(pub.domain);

      return matchesQuery && matchesDomain;
    });
  }, [query, selectedDomains]);

  // Filter stations
  const filteredStations = useMemo(() => {
    return INITIAL_STATIONS.filter((st) => {
      return (
        !query ||
        st.name.toLowerCase().includes(query.toLowerCase()) ||
        st.location.toLowerCase().includes(query.toLowerCase()) ||
        st.region.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [query]);

  // Filter scientists
  const filteredScientists = useMemo(() => {
    return INITIAL_SCIENTISTS.filter((sci) => {
      return (
        !query ||
        sci.name.toLowerCase().includes(query.toLowerCase()) ||
        sci.role_title.toLowerCase().includes(query.toLowerCase()) ||
        sci.domains.some((d) => d.toLowerCase().includes(query.toLowerCase()))
      );
    });
  }, [query]);

  // Filter expeditions
  const filteredExpeditions = useMemo(() => {
    return INITIAL_EXPEDITIONS.filter((exp) => {
      return (
        !query ||
        exp.title.toLowerCase().includes(query.toLowerCase()) ||
        exp.vessel.toLowerCase().includes(query.toLowerCase()) ||
        exp.code.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [query]);

  const totalResults =
    (selectedCategory === 'All' || selectedCategory === 'Datasets'
      ? filteredDatasets.length
      : 0) +
    (selectedCategory === 'All' || selectedCategory === 'Publications'
      ? filteredPublications.length
      : 0) +
    (selectedCategory === 'All' || selectedCategory === 'Stations'
      ? filteredStations.length
      : 0) +
    (selectedCategory === 'All' || selectedCategory === 'Expeditions'
      ? filteredExpeditions.length
      : 0) +
    (selectedCategory === 'All' || selectedCategory === 'Scientists'
      ? filteredScientists.length
      : 0);

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
          Unified Polar Search
        </h1>
        <p className={`text-xs mt-1 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
          Search across datasets, peer-reviewed publications, stations, scientists, and expeditions.
        </p>
      </div>

      {/* Main Search Input & Prompt Pills */}
      <div
        className={`p-4 rounded-xl border ${
          isDark ? 'bg-[#0f2233] border-white/10' : 'bg-white border-[#e5e7eb]'
        }`}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa0b3]" />
            <input
              type="text"
              placeholder="Search datasets, papers, stations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full h-10 pl-9 pr-8 rounded-lg text-sm outline-none transition ${
                isDark
                  ? 'bg-[#071521] border border-white/10 text-white placeholder-[#6d849b] focus:border-[#008b8b]'
                  : 'bg-[#f8fafc] border border-[#e5e7eb] text-[#0b1721] placeholder-[#9aa5b1] focus:border-[#008b8b]'
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            className="h-10 px-5 rounded-lg bg-[#008b8b] text-white text-xs font-semibold hover:bg-[#007575] transition"
          >
            Search
          </button>
        </div>

        {/* Suggestion Prompts */}
        <div className="flex flex-wrap gap-2 mt-3">
          {PROMPT_SUGGESTIONS.slice(0, 4).map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuery(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                isDark
                  ? 'bg-white/5 border-white/10 text-[#c7d8e8] hover:bg-[#008b8b]/20 hover:text-[#5fd0c4]'
                  : 'bg-[#f4f7f9] border-[#e5e7eb] text-[#4b5563] hover:bg-[#e0f2f7] hover:text-[#008b8b]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-[#008b8b] text-white'
                : isDark
                ? 'bg-[#0f2233] text-[#8aa0b3] hover:text-white border border-white/5'
                : 'bg-white text-[#5a6f82] hover:text-[#0b1721] border border-[#e5e7eb]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results and Sidebar Filter Layout */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left Filters */}
        <div className="w-full md:w-56 flex-shrink-0 space-y-4">
          <div
            className={`p-4 rounded-xl border sticky top-20 ${
              isDark ? 'bg-[#0f2233] border-white/10' : 'bg-white border-[#e5e7eb]'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#008b8b] mb-3">
              Scientific Domain
            </div>
            <div className="space-y-1.5">
              {DOMAINS.map((domain) => {
                const checked = selectedDomains.includes(domain);
                return (
                  <label
                    key={domain}
                    className="flex items-center gap-2 text-xs cursor-pointer select-none py-0.5 text-gray-300 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDomain(domain)}
                      className="rounded accent-[#008b8b]"
                    />
                    <span className={checked ? 'font-bold text-[#5fd0c4]' : 'text-gray-400'}>
                      {domain}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#008b8b] mt-5 mb-3">
              Status Filter
            </div>
            <div className="space-y-1.5">
              {['Approved', 'Under Review'].map((st) => {
                const checked = selectedStatus.includes(st);
                return (
                  <label
                    key={st}
                    className="flex items-center gap-2 text-xs cursor-pointer select-none py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStatus(st)}
                      className="rounded accent-[#008b8b]"
                    />
                    <span className={checked ? 'font-bold text-[#5fd0c4]' : 'text-gray-400'}>
                      {st}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 space-y-3">
          <div className="text-xs text-[#8aa0b3] font-medium">
            Found <span className="font-bold text-[#5fd0c4]">{totalResults}</span> records
          </div>

          {/* Datasets Results */}
          {(selectedCategory === 'All' || selectedCategory === 'Datasets') &&
            filteredDatasets.map((ds) => (
              <div
                key={ds.id}
                className={`p-4 rounded-xl border transition hover:shadow-md ${
                  isDark ? 'bg-[#0f2233] border-white/5' : 'bg-white border-[#e5e7eb]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-[#008b8b]" />
                    <span className="text-xs font-mono font-bold text-[#008b8b]">
                      {ds.code}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Dataset
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      ds.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ds.status}
                  </span>
                </div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
                  {ds.title}
                </h3>
                <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {ds.description}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[#8aa0b3]">
                  <span>Domain: <strong>{ds.domain}</strong></span>
                  <span>Region: <strong>{ds.region}</strong></span>
                  <span>Format: <strong>{ds.format}</strong></span>
                  <span>Size: <strong>{ds.file_size}</strong></span>
                </div>
              </div>
            ))}

          {/* Publications Results */}
          {(selectedCategory === 'All' || selectedCategory === 'Publications') &&
            filteredPublications.map((pub) => (
              <div
                key={pub.id}
                className={`p-4 rounded-xl border transition hover:shadow-md ${
                  isDark ? 'bg-[#0f2233] border-white/5' : 'bg-white border-[#e5e7eb]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#3b82f6]" />
                    <span className="text-[10px] font-semibold text-[#3b82f6] uppercase">
                      Publication
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#8aa0b3]">
                    {pub.year}
                  </span>
                </div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
                  {pub.title}
                </h3>
                <div className="text-xs text-[#5a6f82] mt-0.5">
                  {pub.journal} · {pub.authors}
                </div>
                <p className={`text-xs mt-2 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {pub.abstract}
                </p>
              </div>
            ))}

          {/* Stations Results */}
          {(selectedCategory === 'All' || selectedCategory === 'Stations') &&
            filteredStations.map((st) => (
              <div
                key={st.id}
                className={`p-4 rounded-xl border transition hover:shadow-md ${
                  isDark ? 'bg-[#0f2233] border-white/5' : 'bg-white border-[#e5e7eb]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#2e9e8f]" />
                    <span className="text-xs font-mono font-bold text-[#2e9e8f]">
                      {st.code}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">Station</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ● {st.status.toUpperCase()}
                  </span>
                </div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
                  {st.name} Station
                </h3>
                <div className="text-xs text-[#5a6f82] mt-0.5">{st.location}</div>
              </div>
            ))}

          {totalResults === 0 && (
            <div className="py-16 text-center text-sm text-[#8aa0b3]">
              No records found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
