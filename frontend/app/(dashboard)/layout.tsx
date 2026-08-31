'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAuthStore } from '@/store/useAuthStore';

import { PendingApprovalScreen } from '@/components/dashboard/PendingApprovalScreen';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const theme = useAuthStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);

  // In Dark Theme: Sidebar and Topbar are navy blue (#0b1721), content is white (#f4f7f9)
  // In Light Theme: Sidebar and Topbar are white (#ffffff), content is navy blue (#071521)
  const isDark = theme !== 'light';

  // If not authenticated, do not render dashboard (prevents flash on sign out)
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
    return (
      <div className="min-h-screen bg-[#182e42] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#008b8b] border-t-transparent animate-spin" />
      </div>
    );
  }

  // If user is a researcher awaiting approval, show ONLY the Pending Approval screen
  const isPendingResearcher = user?.role === 'researcher' && !user?.is_approved;

  if (isPendingResearcher) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200 ${
          isDark ? 'bg-[#071521] text-white' : 'bg-[#f4f7f9] text-[#0b1721]'
        }`}
      >
        <main className="w-full flex items-center justify-center p-2 md:p-6 overflow-y-auto">
          <PendingApprovalScreen />
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${
        isDark ? 'bg-[#0b1721]' : 'bg-white'
      }`}
    >
      {/* Desktop Sticky Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />

        <main
          className={`flex-1 p-5 md:p-8 overflow-y-auto transition-colors ${
            isDark ? 'bg-[#f4f7f9] text-[#0b1721]' : 'bg-[#071521] text-white'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
