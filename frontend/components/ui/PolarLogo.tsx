'use client';

import React from 'react';

interface PolarLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'emblem' | 'mark' | 'badge';
}

export function PolarLogo({ size = 48, className = '', variant = 'emblem' }: PolarLogoProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none overflow-hidden rounded-full ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      aria-label="Polar Nexus"
    >
      <img
        src="/logo.png"
        alt="Polar Nexus Logo"
        className="w-full h-full object-cover rounded-full scale-[1.04]"
      />
    </div>
  );
}
