'use client';

import React, { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  Layers,
  Radio,
  Satellite,
  Thermometer,
  Wind,
} from 'lucide-react';

import { INITIAL_STATIONS, StationItem } from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const PARAMETERS = [
  { id: 'temp', label: 'Temperature (°C)', unit: '°C' },
  { id: 'wind', label: 'Surface Wind Speed (kt)', unit: 'kt' },
  { id: 'ice', label: 'Sea-Ice Extent / Cover (%)', unit: '%' },
  { id: 'radiation', label: 'Solar Irradiance (W/m²)', unit: 'W/m²' },
];

const STATION_COLORS: Record<string, string> = {
  Maitri: '#008b8b',
  Bharati: '#3b82f6',
  Himadri: '#8b5cf6',
  IndARC: '#2e9e8f',
  'Dakshin Gangotri': '#f59e0b',
  'Prydz Bay Ocean Observatory': '#ec4899',
};

export function StationsTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  const [selectedStations, setSelectedStations] = useState<StationItem[]>([
    INITIAL_STATIONS[0], // Maitri
    INITIAL_STATIONS[1], // Bharati
  ]);
  const [selectedParam, setSelectedParam] = useState('temp');

  const toggleStation = (station: StationItem) => {
    setSelectedStations((prev) => {
      const exists = prev.find((s) => s.id === station.id);
      if (exists) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((s) => s.id !== station.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), station];
      }
      return [...prev, station];
    });
  };

  // Build chart dataset
  const chartData = MONTH_LABELS.map((month, index) => {
    const row: Record<string, string | number> = { month };
    selectedStations.forEach((st) => {
      if (selectedParam === 'temp') {
        row[st.name] = st.monthly_temps[index];
      } else if (selectedParam === 'wind') {
        row[st.name] = st.monthly_wind[index];
      } else if (selectedParam === 'ice') {
        row[st.name] = st.monthly_ice[index];
      } else if (selectedParam === 'radiation') {
        row[st.name] = st.monthly_radiation[index];
      }
    });
    return row;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
          Stations & Observations
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
          Compare stations, regions and meteorological parameters against historical climatological baselines.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Station Selection Checkbox list */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0f2233] border-white/10' : 'bg-white border-[#e5e7eb]'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#008b8b] mb-3">
              Select Stations ({selectedStations.length}/4)
            </div>
            <div className="space-y-1.5">
              {INITIAL_STATIONS.map((st) => {
                const isChecked = !!selectedStations.find((s) => s.id === st.id);
                return (
                  <label
                    key={st.id}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-cyan-500/10 border border-cyan-500/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStation(st)}
                      className="mt-1 accent-[#008b8b]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
                          {st.name}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${
                            st.status === 'nominal' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          ● {st.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8aa0b3] truncate mt-0.5">
                        {st.location}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Parameter Chart Workspace */}
        <div className="flex-1 min-w-0 space-y-4">
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-[#0f2233] border-white/10' : 'bg-white border-[#e5e7eb]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#008b8b]">
                  Comparison Workspace
                </div>
                <h3 className={`text-sm font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
                  Annual Climatological Cycle
                </h3>
              </div>

              {/* Parameter Selector Dropdown */}
              <select
                value={selectedParam}
                onChange={(e) => setSelectedParam(e.target.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border outline-none ${
                  isDark
                    ? 'bg-[#071521] border-white/10 text-white'
                    : 'bg-[#f4f7f9] border-[#e5e7eb] text-[#0b1721]'
                }`}
              >
                {PARAMETERS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0b1721] text-white">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Recharts Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1b3245' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={isDark ? '#8aa0b3' : '#64748b'} fontSize={11} />
                  <YAxis
                    stroke={isDark ? '#8aa0b3' : '#64748b'}
                    fontSize={11}
                    unit={PARAMETERS.find((p) => p.id === selectedParam)?.unit}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0b1721' : '#ffffff',
                      borderColor: isDark ? '#1a354b' : '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend />
                  {selectedStations.map((st) => (
                    <Line
                      key={st.id}
                      type="monotone"
                      dataKey={st.name}
                      stroke={STATION_COLORS[st.name] || '#008b8b'}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-Time Sensor Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedStations.map((st) => (
              <div
                key={st.id}
                className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-[#091724] border-white/5' : 'bg-white border-[#e5e7eb]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#5fd0c4]">{st.name}</span>
                  <span className="text-[10px] text-emerald-400">● LIVE</span>
                </div>
                <div className="text-lg font-bold">
                  {st.live_temp}°C
                </div>
                <div className="text-[10px] text-[#8aa0b3] mt-1">
                  Wind: {st.live_wind} kt · {st.sensors_active} sensors active
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
