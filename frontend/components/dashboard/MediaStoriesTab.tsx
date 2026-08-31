'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ExternalLink,
  Film,
  MapPin,
  Play,
  User,
  Video,
  X,
} from 'lucide-react';

import { INITIAL_MEDIA_STORIES, MediaStoryItem } from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

export function MediaStoriesTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  const [activeMedia, setActiveMedia] = useState<MediaStoryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Documentary', 'Field Dispatch', 'Photo Story', 'Interview'];

  const filtered = INITIAL_MEDIA_STORIES.filter(
    (m) => filterCategory === 'All' || m.category === filterCategory
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-[#0b1721]' : 'text-white'}`}>
            <Video className="w-5 h-5 text-[#008b8b]" />
            <span>Polar Media & Scientific Dispatches</span>
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#5a6f82]' : 'text-[#8aa0b3]'}`}>
            Field videos, photographic chronicles, and interviews from Bharati, Maitri, and Himadri research stations.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterCategory === c
                  ? 'bg-[#008b8b] text-white shadow-sm'
                  : isDark
                  ? 'bg-white text-[#5a6f82] hover:text-[#0b1721] border border-[#e5e7eb]'
                  : 'bg-[#0f2233] text-[#8aa0b3] hover:text-white border border-white/5'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveMedia(item)}
            className={`p-4 rounded-2xl border transition cursor-pointer hover:shadow-xl flex flex-col justify-between group ${
              isDark ? 'bg-white border-[#e5e7eb] text-[#0b1721]' : 'bg-[#0f2233] border-white/10 text-white'
            }`}
          >
            <div>
              {/* Media Thumbnail Container */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 mb-3.5">
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#008b8b]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-cyan-300">
                  {item.category}
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.duration}</span>
                </div>
              </div>

              <h3 className={`text-sm font-bold leading-snug mb-1.5 ${isDark ? 'text-[#0b1721]' : 'text-white'}`}>
                {item.title}
              </h3>

              <p className={`text-xs line-clamp-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                {item.summary}
              </p>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${
              isDark ? 'border-gray-100 text-gray-500' : 'border-white/10 text-[#8aa0b3]'
            }`}>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#008b8b]" />
                <span>{item.location}</span>
              </span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Media Viewer Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div
            className={`w-full max-w-2xl rounded-2xl p-6 shadow-2xl border ${
              isDark ? 'bg-white border-[#e5e7eb] text-[#0b1721]' : 'bg-[#0b1721] border-white/10 text-white'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#008b8b] bg-teal-500/10 px-2 py-0.5 rounded">
                  {activeMedia.category} · {activeMedia.duration}
                </span>
                <h2 className="text-base font-bold mt-1.5">{activeMedia.title}</h2>
              </div>
              <button
                onClick={() => setActiveMedia(null)}
                className={`p-1.5 rounded-lg transition ${
                  isDark ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Embed */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center mb-4 shadow-2xl border border-white/10">
              {activeMedia.youtube_id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeMedia.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeMedia.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : activeMedia.video_url ? (
                <iframe
                  src={activeMedia.video_url}
                  title={activeMedia.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={activeMedia.thumbnail_url}
                    alt={activeMedia.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40">
                    <div className="w-16 h-16 rounded-full bg-[#008b8b] flex items-center justify-center shadow-xl mb-2">
                      <Play className="w-7 h-7 ml-1" />
                    </div>
                    <span className="text-xs font-semibold">High-Definition Polar Stream</span>
                  </div>
                </div>
              )}
            </div>

            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              {activeMedia.summary}
            </p>

            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-3 border-t ${
              isDark ? 'border-gray-200 text-gray-500' : 'border-white/10 text-[#8aa0b3]'
            }`}>
              <div>
                <span>Location: <strong className={isDark ? 'text-[#0b1721]' : 'text-white'}>{activeMedia.location}</strong></span>
                <span className="mx-2">·</span>
                <span>Author: <strong className={isDark ? 'text-[#0b1721]' : 'text-white'}>{activeMedia.author}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                {activeMedia.youtube_id && (
                  <a
                    href={`https://www.youtube.com/watch?v=${activeMedia.youtube_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <a
                  href={activeMedia.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#008b8b] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>NCPOR Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
