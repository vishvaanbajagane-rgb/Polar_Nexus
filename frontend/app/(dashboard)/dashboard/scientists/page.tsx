'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ExternalLink, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CardSkeletonGrid } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import type { Page, Scientist } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

export default function ScientistsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['scientists', search, page],
    queryFn: async () => {
      const { data } = await api.get<Page<Scientist>>('/scientists', {
        params: { search: search || undefined, page, size: 12 },
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
          <h1 className="text-2xl font-semibold">Polar scientists</h1>
          <p className="mt-1 text-sm text-slate-400">
            Profiles enriched from ORCID with Crossref citation metrics
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            placeholder="Search name, institution, specialisation"
            className="w-80 pl-9"
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {query.isLoading ? (
        <CardSkeletonGrid />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.items.map((scientist) => (
            <Card key={scientist.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-ice-400 to-aurora-violet text-sm font-semibold text-abyss-950">
                    {scientist.full_name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </span>
                  <div>
                    <CardTitle className="text-base">{scientist.full_name}</CardTitle>
                    <CardDescription>
                      {scientist.institution ?? 'Independent'} · {scientist.country ?? '—'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-400 line-clamp-3">
                  {scientist.bio ?? scientist.specialization ?? 'Polar research scientist.'}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge>h-index {scientist.h_index}</Badge>
                  <Badge>{formatNumber(scientist.citation_count)} citations</Badge>
                  <Badge>{scientist.publication_count} papers</Badge>
                </div>
                {scientist.orcid_id ? (
                  <Button asChild size="sm" variant="ghost">
                    <a
                      href={`https://orcid.org/${scientist.orcid_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" /> ORCID {scientist.orcid_id}
                    </a>
                  </Button>
                ) : null}
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
