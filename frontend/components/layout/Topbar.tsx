'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';

import { PolarLogo } from '@/components/ui/PolarLogo';
import { useAuthStore } from '@/store/useAuthStore';

interface TopbarProps {
  onMenuClick?: () => void;
  onSearchSubmit?: (query: string) => void;
}

export function Topbar({ onMenuClick, onSearchSubmit }: TopbarProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const theme = useAuthStore((state) => state.theme);
  const toggleTheme = useAuthStore((state) => state.toggleTheme);
  const activeTab = useAuthStore((state) => state.activeTab);
  const setActiveTab = useAuthStore((state) => state.setActiveTab);
  const notifications = useAuthStore((state) => state.notifications);
  const logout = useAuthStore((state) => state.logout);

  const [timeFilter, setTimeFilter] = useState('Last 12 months');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const isDark = theme !== 'light';
  const userRole = user?.role || 'public';
  const isAdmin = userRole === 'admin';

  // Filter unread notifications relevant to current user
  const unreadCount = notifications.filter((notif) => {
    if (notif.read) return false;
    if (notif.target_email && notif.target_email !== user?.email) return false;
    if (notif.target_role && notif.target_role !== 'all') {
      if (notif.target_role === 'admin' && !isAdmin) return false;
      if (notif.target_role !== 'admin' && notif.target_role !== userRole) return false;
    }
    return true;
  }).length;

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <header
      className={`sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b transition-colors select-none ${
        isDark
          ? 'bg-[#071521] border-white/5 text-white'
          : 'bg-white border-[#e5e7eb] text-[#0b1721]'
      }`}
    >
      {/* Left: Maps / Dataviz Pill */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'map' ? 'overview' : 'map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'map'
              ? 'bg-[#008b8b] text-white shadow-sm'
              : isDark
              ? 'bg-[#112338] text-[#9fb3c8] hover:text-white border border-white/5'
              : 'bg-[#f4f7f9] text-[#0b1721] hover:bg-[#e0f2f7] border border-[#e5e7eb]'
          }`}
        >
          <span>Maps / Dataviz</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#008b8b]/20 text-[#5fd0c4]">
            new
          </span>
        </button>
      </div>

      {/* Spacer to push controls to the right */}
      <div className="flex-1" />

      {/* Right section: Filters, status, theme toggle, bell, user info */}
      <div className="flex items-center gap-3">
        {/* Time filter dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isDark
                ? 'bg-[#0f2233] border-white/10 text-[#c7d8e8] hover:text-white'
                : 'bg-white border-[#e5e7eb] text-[#4b5563] hover:bg-[#f8fafc]'
            }`}
          >
            <span>{timeFilter}</span>
            <ChevronDown className="w-3 h-3 text-[#8aa0b3]" />
          </button>

          {showTimeDropdown && (
            <div
              className={`absolute right-0 mt-1 w-36 py-1 rounded-lg border shadow-xl z-50 text-xs ${
                isDark
                  ? 'bg-[#0f2233] border-white/10 text-white'
                  : 'bg-white border-[#e5e7eb] text-[#0b1721]'
              }`}
            >
              {['Last 12 months', 'Last 3 years', 'All Time'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTimeFilter(t);
                    setShowTimeDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#008b8b]/10 ${
                    timeFilter === t ? 'font-bold text-[#008b8b]' : ''
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Last sync badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#8aa0b3]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Last sync 04:10 UTC</span>
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          className={`p-2 rounded-lg transition ${
            isDark
              ? 'text-[#8aa0b3] hover:text-white hover:bg-white/5'
              : 'text-[#5a6f82] hover:text-[#0b1721] hover:bg-[#f4f7f9]'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`relative p-2 rounded-lg transition ${
            activeTab === 'notifications'
              ? 'text-[#008b8b] bg-[#008b8b]/10'
              : isDark
              ? 'text-[#8aa0b3] hover:text-white hover:bg-white/5'
              : 'text-[#5a6f82] hover:text-[#0b1721] hover:bg-[#f4f7f9]'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#008b8b] animate-pulse" />
          )}
        </button>

        {/* Logo circle */}
        <div className="w-7 h-7 rounded-full overflow-hidden bg-transparent flex items-center justify-center p-0.5">
          <PolarLogo size={24} />
        </div>

        {/* User profile with Administrator */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-7 h-7 rounded-full bg-[#0b1721] border border-white/20 text-white flex items-center justify-center text-xs font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'O'}
          </div>
          <div className="hidden md:block leading-tight text-left">
            <div className={`text-xs font-semibold capitalize ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
              {user?.full_name || 'Administrator'}
            </div>
            <div className="text-[10px] text-[#8aa0b3] max-w-[140px] truncate">
              {user?.email || 'obitovish2008@gmail.com'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="ml-2 text-xs text-[#8aa0b3] hover:text-rose-400 font-medium hover:underline flex items-center gap-1"
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
