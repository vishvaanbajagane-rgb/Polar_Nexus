'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ExternalLink, Quote, Search } from 'lucide-react';

import { Badge, RegionBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { CardSkeletonGrid } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import type { Page, Publication } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function PublicationsPage() {
  const [search, setSearch] = useState('');
  const [openAccess, setOpenAccess] = useState('');
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['publications', search, openAccess, page],
    queryFn: async () => {
      const { data } = await api.get<Page<Publication>>('/publications', {
        params: {
          search: search || undefined,
          open_access: openAccess === '' ? undefined : openAccess === 'true',
          page,
          size: 12,
        },
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
          <h1 className="text-2xl font-semibold">Publications</h1>
          <p className="mt-1 text-sm text-slate-400">
            Synced nightly from Crossref and Semantic Scholar
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={search}
              placeholder="Search titles and abstracts"
              className="w-72 pl-9"
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={openAccess}
            className="w-44"
            onChange={(event) => {
              setOpenAccess(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All access</option>
            <option value="true">Open access</option>
            <option value="false">Subscription</option>
          </Select>
        </div>
      </div>

      {query.isLoading ? (
        <CardSkeletonGrid />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data?.items.map((publication) => (
            <Card key={publication.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base leading-snug">{publication.title}</CardTitle>
                  <RegionBadge region={publication.region} />
                </div>
                <CardDescription className="line-clamp-3">
                  {publication.abstract ?? 'Abstract unavailable.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-400">
                  {(publication.authors ?? []).slice(0, 4).join(', ') || 'Unknown authors'}
                  {publication.authors && publication.authors.length > 4 ? ' et al.' : ''}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge>{publication.journal ?? 'Preprint'}</Badge>
                  <Badge>{formatDate(publication.published_on)}</Badge>
                  <Badge className="gap-1">
                    <Quote className="h-3 w-3" /> {publication.citation_count}
                  </Badge>
                  {publication.is_open_access ? (
                    <Badge className="border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                      Open access
                    </Badge>
                  ) : null}
                </div>
                {publication.url || publication.doi ? (
                  <Button asChild size="sm" variant="secondary">
                    <a
                      href={publication.url ?? `https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" /> Read paper
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
