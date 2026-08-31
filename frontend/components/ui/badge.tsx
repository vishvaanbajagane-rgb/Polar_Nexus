import * as React from 'react';

import { cn, REGION_COLORS, REGION_LABELS } from '@/lib/utils';
import type { PolarRegion } from '@/lib/types';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200',
        className,
      )}
      {...props}
    />
  );
}

export function RegionBadge({ region }: { region: PolarRegion }) {
  const color = REGION_COLORS[region];
  return (
    <Badge style={{ borderColor: `${color}55`, color, backgroundColor: `${color}14` }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {REGION_LABELS[region]}
    </Badge>
  );
}
