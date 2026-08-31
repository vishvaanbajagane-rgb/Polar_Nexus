'use client';

import React from 'react';
import {
  AlertCircle,
  Bell,
  Bookmark,
  BookOpen,
  Database,
  FlaskConical,
  Home,
  LucideIcon,
  Map,
  Network,
  Satellite,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  Video,
} from 'lucide-react';

import { PolarLogo } from '@/components/ui/PolarLogo';
import { useAuthStore } from '@/store/useAuthStore';

interface NavItemDef {
  id: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  divider?: boolean;
}

export const SIDEBAR_NAV: NavItemDef[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'map', label: 'Explore Map', icon: Map },
  { id: 'search', label: 'Unified Search', icon: Search },
  { id: 'ai', label: 'AI Research Assistant', icon: Sparkles },
  { id: 'datasets', label: 'Datasets', icon: Database },
  { id: 'publications', label: 'Publications', icon: BookOpen },
  { id: 'knowledge', label: 'Knowledge Graph', icon: Network },
  { id: 'expeditions', label: 'Expeditions', icon: Ship },
  { id: 'stations', label: 'Stations & Observations', icon: Satellite },
  { id: 'events', label: 'Environmental Events', icon: AlertCircle },
  { id: 'media', label: 'Media & Stories', icon: Video },
  { id: 'scientists', label: 'Scientists', icon: FlaskConical },
  { id: 'saved', label: 'Saved Research', icon: Bookmark },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'divider', label: '', icon: Home, divider: true },
  { id: 'console', label: 'Admin Console', icon: ShieldCheck, adminOnly: true },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const activeTab = useAuthStore((state) => state.activeTab);
  const setActiveTab = useAuthStore((state) => state.setActiveTab);
  const theme = useAuthStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);

  const isDark = theme !== 'light';
  const isAdmin = user?.role === 'admin' || user?.role === 'researcher';

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onNavigate) onNavigate();
  };

  const navItems = SIDEBAR_NAV.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      className={`w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col transition-colors duration-200 select-none ${
        isDark
          ? 'bg-[#0b1721] text-white border-r border-white/5'
          : 'bg-white text-[#0b1721] border-r border-[#e5e7eb]'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`px-5 py-4 flex items-center gap-3 border-b ${
          isDark ? 'border-white/5' : 'border-[#e5e7eb]'
        }`}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-transparent flex-shrink-0">
          <PolarLogo size={36} className="rounded-full" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight">Polar Nexus</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-sidebar-scroll">
        {navItems.map((item, index) => {
          if (item.divider) {
            return (
              <div
                key={`divider-${index}`}
                className={`my-2 h-px ${isDark ? 'bg-white/10' : 'bg-[#e5e7eb]'}`}
              />
            );
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? isDark
                    ? 'bg-[#172d3f] text-white font-semibold shadow-sm'
                    : 'bg-[#e0f2f7] text-[#0b1721] font-semibold'
                  : isDark
                  ? 'text-[#9fb3c8] hover:bg-white/5 hover:text-white'
                  : 'text-[#5a6f82] hover:bg-[#f4f7f9] hover:text-[#0b1721]'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Catalogue Status */}
      <div
        className={`p-4 border-t text-[11px] ${
          isDark
            ? 'border-white/5 bg-[#07131d] text-[#8aa0b3]'
            : 'border-[#e5e7eb] bg-[#f8fafc] text-[#5a6f82]'
        }`}
      >
        <div className="font-semibold uppercase tracking-wider text-[9px] text-[#9aa5b1] mb-1">
          Catalogue Status
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className={isDark ? 'text-[#5fd0c4]' : 'text-emerald-700'}>
            All sources nominal
          </span>
        </div>
      </div>
    </aside>
  );
}
