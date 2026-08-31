'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  Filter,
  Info,
  Radio,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';

import { NotificationItem } from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

export function NotificationsTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';
  const setActiveTab = useAuthStore((state) => state.setActiveTab);
  const user = useAuthStore((state) => state.user);
  const notifications = useAuthStore((state) => state.notifications);
  const markAllAsRead = useAuthStore((state) => state.markAllNotificationsAsRead);
  const toggleRead = useAuthStore((state) => state.toggleNotificationRead);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'role' | 'alerts'>('all');

  const userRole = user?.role || 'public';
  const isAdmin = userRole === 'admin';

  // Strict Filter: Only notifications targeted to this user's email, or matching this user's specific role, or broadcast to 'all'
  const visibleNotifications = notifications.filter((notif) => {
    // Direct user-targeted notification
    if (notif.target_email) {
      if (notif.target_email !== user?.email) return false;
    } else if (notif.target_role && notif.target_role !== 'all') {
      // Role-specific notification
      if (notif.target_role === 'admin' && !isAdmin) return false;
      if (notif.target_role !== 'admin' && notif.target_role !== userRole) return false;
    }

    // Filter by UI category tab
    if (activeFilter === 'unread') return !notif.read;
    if (activeFilter === 'role') return notif.target_role === userRole || notif.target_email === user?.email;
    if (activeFilter === 'alerts') return notif.type === 'alert';

    return true;
  });

  const getRoleBadge = (notif: NotificationItem) => {
    if (notif.target_email) {
      return (
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
          Direct to You
        </span>
      );
    }
    if (notif.target_role === 'admin') {
      return (
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-1">
          <ShieldCheck className="w-2.5 h-2.5" />
          Admin Exclusive
        </span>
      );
    }
    if (notif.target_role === 'researcher') {
      return (
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
          <UserCheck className="w-2.5 h-2.5" />
          Researcher
        </span>
      );
    }
    if (notif.target_role === 'educator') {
      return (
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Academic & Student
        </span>
      );
    }
    return (
      <span className="text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
        General Broadcast
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
            <Bell className="w-5 h-5 text-[#008b8b]" />
            <span>Notifications & Operational Alerts</span>
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
            Showing personalized operational notices, verification updates, and telemetry alerts for{' '}
            <strong className="capitalize">{user?.role || 'Guest'}</strong> account.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'All My Notices' },
          { id: 'unread', label: 'Unread' },
          { id: 'role', label: `Role-Specific (${user?.role || 'user'})` },
          { id: 'alerts', label: 'Priority Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeFilter === tab.id
                ? 'bg-[#008b8b] text-white shadow-sm'
                : isDark
                ? 'bg-[#0f2233] text-[#8aa0b3] hover:text-white border border-white/5'
                : 'bg-white text-[#5a6f82] hover:text-[#0b1721] border border-[#e5e7eb]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {visibleNotifications.length === 0 ? (
          <div
            className={`p-10 rounded-2xl border text-center ${
              isDark ? 'bg-[#0f2233] border-white/5 text-[#8aa0b3]' : 'bg-white border-[#e5e7eb] text-[#5a6f82]'
            }`}
          >
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#008b8b]" />
            <div className="text-sm font-semibold">No notifications in this category</div>
            <div className="text-xs mt-1 opacity-70">
              You are all caught up on alerts and role updates.
            </div>
          </div>
        ) : (
          visibleNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                toggleRead(notif.id);
                if (notif.link_tab) setActiveTab(notif.link_tab);
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 hover:shadow-md ${
                !notif.read
                  ? isDark
                    ? 'bg-[#0f283d] border-[#008b8b]/40'
                    : 'bg-[#f0f9fa] border-[#008b8b]/40'
                  : isDark
                  ? 'bg-[#0f2233] border-white/5'
                  : 'bg-white border-[#e5e7eb]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  notif.type === 'alert'
                    ? 'bg-rose-500/20 text-rose-400'
                    : notif.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}
              >
                {notif.type === 'alert' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : notif.type === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
                      {notif.title}
                    </h3>
                    {getRoleBadge(notif)}
                  </div>
                  <span className="text-[10px] text-[#8aa0b3] flex-shrink-0 ml-2">{notif.timestamp}</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
