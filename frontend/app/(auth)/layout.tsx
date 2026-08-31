'use client';

import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col justify-center items-center overflow-hidden bg-[#182e42] px-4 py-8 select-none">
      {/* Background Graphic matching the exact sample layout */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Subtle radial dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#16293a]/80 via-[#182e42]/60 to-[#0e1d2b]/95 z-10" />

        {/* Backdrop Logo Watermark Illustration */}
        <div className="relative w-[1100px] h-[1100px] opacity-20 filter saturate-150 transform scale-110">
          <img
            src="/logo.png"
            alt="Polar Nexus"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Watermark Bottom Text */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-10 opacity-30 select-none">
          <div className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.25em] text-[#8eaec7]">
            POLAR NEXUS
          </div>
          <div className="text-xs md:text-sm font-semibold tracking-[0.4em] text-[#8eaec7] mt-2">
            DISCOVER • UNDERSTAND • INNOVATE
          </div>
        </div>
      </div>

      {/* Main Card */}
      <main className="relative z-20 w-full flex justify-center">
        {children}
      </main>
    </div>
  );
}
