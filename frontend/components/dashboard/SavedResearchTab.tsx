'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Database,
  ExternalLink,
  Trash2,
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';

interface SavedItem {
  id: string;
  type: 'dataset' | 'publication' | 'query';
  title: string;
  codeOrAuthors: string;
  dateSaved: string;
}

const INITIAL_SAVED: SavedItem[] = [
  {
    id: 's-1',
    type: 'dataset',
    title: 'Weddell Sea sea-ice thickness composite',
    codeOrAuthors: 'NCPOR-SI-0207',
    dateSaved: '2 days ago',
  },
  {
    id: 's-2',
    type: 'publication',
    title: 'Decadal variability of Indian Antarctic station temperatures',
    codeOrAuthors: 'Dr. Thamban Meloth et al. (2025)',
    dateSaved: '4 days ago',
  },
  {
    id: 's-3',
    type: 'dataset',
    title: 'Kongsfjorden fjord mooring IndARC time series',
    codeOrAuthors: 'NCPOR-HYD-0041',
    dateSaved: '1 week ago',
  },
];

export function SavedResearchTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';
  const setActiveTab = useAuthStore((state) => state.setActiveTab);

  const [savedItems, setSavedItems] = useState<SavedItem[]>(INITIAL_SAVED);

  const removeItem = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
          <Bookmark className="w-5 h-5 text-[#008b8b]" />
          <span>Saved Research & Bookmarks</span>
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
          Your pinned datasets, bookmarked publications, and saved research queries.
        </p>
      </div>

      {/* Saved List */}
      <div className="space-y-3">
        {savedItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition hover:shadow-md ${
              isDark ? 'bg-[#0f2233] border-white/5' : 'bg-white border-[#e5e7eb]'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.type === 'dataset' ? 'bg-teal-500/15 text-[#5fd0c4]' : 'bg-blue-500/15 text-blue-400'
                }`}
              >
                {item.type === 'dataset' ? <Database className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#008b8b]">
                    {item.type}
                  </span>
                  <span className="text-xs text-[#8aa0b3]">• Saved {item.dateSaved}</span>
                </div>
                <h3 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
                  {item.title}
                </h3>
                <div className="text-xs text-[#8aa0b3] truncate">{item.codeOrAuthors}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab(item.type === 'dataset' ? 'datasets' : 'publications')}
                className="px-3 py-1.5 rounded-lg bg-[#008b8b]/15 text-[#5fd0c4] hover:bg-[#008b8b]/30 text-xs font-semibold flex items-center gap-1 transition"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                title="Remove from saved"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {savedItems.length === 0 && (
          <div className="py-16 text-center text-xs text-[#8aa0b3]">
            No saved research items yet. Bookmark datasets and publications across the portal to review them here.
          </div>
        )}
      </div>
    </div>
  );
}
