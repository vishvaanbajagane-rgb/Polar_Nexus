'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Compass,
  ExternalLink,
  Eye,
  Globe,
  Layers,
  Loader2,
  MapPin,
  Maximize2,
  Radio,
  RotateCcw,
  Satellite,
  ShieldCheck,
  Snowflake,
  Thermometer,
  Wind,
} from 'lucide-react';

import { INITIAL_STATIONS, StationItem } from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';
import type { MapTilerStyleKey } from '@/components/maps/PolarMap';

// Dynamically load the Leaflet Map component on client side only (avoid SSR window errors)
const PolarLeafletMap = dynamic(() => import('@/components/maps/PolarMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[580px] rounded-2xl flex flex-col items-center justify-center bg-[#cde3f7]/50 border border-white/10 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#008b8b]" />
      <span className="text-xs font-semibold text-gray-700">Loading MapTiler Polar Basemap...</span>
    </div>
  ),
});

export function ExploreMapTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  const [selectedStation, setSelectedStation] = useState<StationItem>(INITIAL_STATIONS[0]);
  const [activeRegion, setActiveRegion] = useState<'all' | 'antarctic' | 'arctic' | 'himalaya'>('all');
  const [mapStyle, setMapStyle] = useState<MapTilerStyleKey>('outdoor');
  const [showOverlays, setShowOverlays] = useState<boolean>(true);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
            Explore Polar Geospatial Map
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
            Vibrant MapTiler geospatial projection with dark blue polar cryosphere regions and Indian research stations.
          </p>
        </div>

        {/* Region Jumper & Style Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Region Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-[#0f2233] border-white/10' : 'bg-white border-gray-200'
          }`}>
            {[
              { id: 'all', label: 'Global View' },
              { id: 'antarctic', label: 'Antarctica' },
              { id: 'arctic', label: 'Arctic' },
              { id: 'himalaya', label: 'Himalayas' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRegion(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeRegion === tab.id
                    ? 'bg-[#008b8b] text-white shadow-sm'
                    : isDark
                    ? 'text-[#8aa0b3] hover:text-white'
                    : 'text-gray-600 hover:text-[#0b1721]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Style Selector */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-[#0f2233] border-white/10' : 'bg-white border-gray-200'
          }`}>
            {[
              { id: 'outdoor', label: 'Outdoor (Colorful)' },
              { id: 'satellite', label: 'Satellite' },
              { id: 'winter', label: 'Winter' },
              { id: 'basic', label: 'Vector Clean' },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setMapStyle(style.id as any)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  mapStyle === style.id
                    ? 'bg-[#0b1721] text-cyan-400 font-bold border border-cyan-500/30'
                    : isDark
                    ? 'text-[#8aa0b3] hover:text-white'
                    : 'text-gray-600 hover:text-[#0b1721]'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map & Station Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Interactive Leaflet Map Container */}
        <div className="lg:col-span-2 relative rounded-2xl border overflow-hidden min-h-[580px] shadow-xl border-gray-200 dark:border-white/10 bg-[#cde3f7]">
          <PolarLeafletMap
            height={580}
            styleKey={mapStyle}
            targetRegion={activeRegion}
            selectedStationId={selectedStation?.id}
            onSelectStation={(st) => setSelectedStation(st)}
            showOverlays={showOverlays}
          />

          {/* Overlays toggle in top-left */}
          <div className="absolute top-4 left-4 z-20">
            <button
              type="button"
              onClick={() => setShowOverlays(!showOverlays)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/75 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition shadow-lg"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showOverlays ? 'Polar Shading: ON' : 'Polar Shading: OFF'}</span>
            </button>
          </div>

          {/* MapTiler Branding Logo Badge in bottom-left */}
          <div className="absolute bottom-3 left-4 z-20 pointer-events-none flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white border border-white/10">
            <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex-shrink-0" />
            <span className="font-bold tracking-tight">maptiler</span>
          </div>
        </div>

        {/* Selected Station Telemetry Card */}
        <div className="space-y-4">
          <div
            className={`p-5 rounded-2xl border transition-colors ${
              isDark ? 'bg-[#0f2233] border-white/10 text-white' : 'bg-white border-[#e5e7eb] text-[#0b1721]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#008b8b]">
                {selectedStation?.id.toUpperCase()}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{selectedStation?.status}</span>
              </span>
            </div>

            <h2 className="text-lg font-bold">
              {selectedStation?.name}
            </h2>
            <p className={`text-xs mt-0.5 flex items-center gap-1 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
              <MapPin className="w-3 h-3 text-[#008b8b] flex-shrink-0" />
              <span>{selectedStation?.location}</span>
            </p>

            <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {selectedStation?.description}
            </p>

            {/* Live Sensor Readings */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-center">
                <Thermometer className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <div className="text-[10px] text-[#8aa0b3]">Live Temp</div>
                <div className="text-xs font-bold text-cyan-300">
                  {selectedStation?.live_temp}°C
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-500/10 text-center">
                <Wind className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-[10px] text-[#8aa0b3]">Live Wind</div>
                <div className="text-xs font-bold text-blue-300 truncate">
                  {selectedStation?.live_wind} kn
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/10 text-center">
                <Radio className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-[10px] text-[#8aa0b3]">Pressure</div>
                <div className="text-xs font-bold text-purple-300">
                  {selectedStation?.live_pressure} hPa
                </div>
              </div>
            </div>

            {/* Station Metadata */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#8aa0b3] block">Established:</span>
                <span className="font-semibold">{selectedStation?.established_year}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#8aa0b3] block">Active Sensors:</span>
                <span className="font-semibold text-emerald-400">{selectedStation?.sensors_active} telemetry feeds</span>
              </div>
            </div>

            {/* Telemetry link */}
            {selectedStation?.source_telemetry_url && (
              <a
                href={selectedStation.source_telemetry_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#008b8b]/20 hover:bg-[#008b8b]/30 text-[#5fd0c4] text-xs font-semibold transition"
              >
                <span>View Full Telemetry Feed</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Quick Station Selector List */}
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0f2233] border-white/10 text-white' : 'bg-white border-[#e5e7eb] text-[#0b1721]'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-[#8aa0b3] mb-2.5">
              All Research Stations ({INITIAL_STATIONS.length})
            </div>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {INITIAL_STATIONS.map((st) => {
                const isSelected = selectedStation?.id === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStation(st)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-[#008b8b] text-white font-semibold shadow-sm'
                        : isDark
                        ? 'text-[#8aa0b3] hover:bg-white/5 hover:text-white'
                        : 'text-[#5a6f82] hover:bg-gray-100 hover:text-[#0b1721]'
                    }`}
                  >
                    <span className="truncate">{st.name}</span>
                    <span className="text-[10px] opacity-80">{st.region}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
