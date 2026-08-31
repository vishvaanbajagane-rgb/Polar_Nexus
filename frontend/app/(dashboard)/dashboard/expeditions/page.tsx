'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CalendarDays, Ship, Users } from 'lucide-react';

import { Badge, RegionBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/input';
import { CardSkeletonGrid } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import type { Expedition, Page } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  planned: 'border-sky-400/30 bg-sky-500/10 text-sky-300',
  ongoing: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  completed: 'border-slate-400/30 bg-slate-500/10 text-slate-300',
  cancelled: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
};

export default function ExpeditionsPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['expeditions', status, page],
    queryFn: async () => {
      const { data } = await api.get<Page<Expedition>>('/expeditions', {
        params: { status: status || undefined, page, size: 12 },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

  const data = query.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Expeditions</h1>
          <p className="mt-1 text-sm text-slate-400">Indian and international polar campaigns</p>
        </div>
        <Select
          value={status}
          className="w-48"
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="planned">Planned</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      {query.isLoading ? (
        <CardSkeletonGrid />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.items.map((expedition) => (
            <Card key={expedition.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{expedition.name}</CardTitle>
                  <RegionBadge region={expedition.region} />
                </div>
                <CardDescription className="line-clamp-3">
                  {expedition.objective ?? 'Objective to be announced.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-ice-300" />
                  {formatDate(expedition.start_date)} → {formatDate(expedition.end_date)}
                </p>
                <p className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-ice-300" />
                  {expedition.vessel ?? 'Vessel TBD'}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-ice-300" />
                  {expedition.team_size ?? '—'} members
                </p>
                <Badge className={cn('capitalize', STATUS_STYLES[expedition.status])}>
                  {expedition.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data && data.pages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-slate-400">
            Page {data.page} of {data.pages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= data.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
