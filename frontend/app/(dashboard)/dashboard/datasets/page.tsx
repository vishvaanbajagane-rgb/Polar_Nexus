'use client';

import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Search } from 'lucide-react';

import { RegionBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { CardSkeletonGrid } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import type { Dataset, Page, PolarRegion } from '@/lib/types';
import { formatDate, formatSize } from '@/lib/utils';

const REGIONS: (PolarRegion | '')[] = ['', 'arctic', 'antarctic', 'himalaya', 'southern_ocean', 'global'];

export default function DatasetsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [page, setPage] = useState(1);

  const datasetsQuery = useQuery({
    queryKey: ['datasets', search, region, page],
    queryFn: async () => {
      const { data } = await api.get<Page<Dataset>>('/datasets', {
        params: { search: search || undefined, region: region || undefined, page, size: 12 },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

  const download = useMutation({
    mutationFn: async (dataset: Dataset) => {
      await api.post(`/datasets/${dataset.id}/download`);
      if (dataset.source_url) window.open(dataset.source_url, '_blank', 'noopener');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['datasets'] }),
  });

  const data = datasetsQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Polar datasets</h1>
          <p className="mt-1 text-sm text-slate-400">
            {data ? `${data.total} datasets available for your access level` : 'Loading catalogue…'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={search}
              placeholder="Search datasets"
              className="w-64 pl-9"
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={region}
            className="w-48"
            onChange={(event) => {
              setRegion(event.target.value);
              setPage(1);
            }}
          >
            {REGIONS.map((value) => (
              <option key={value || 'all'} value={value}>
                {value ? value.replace('_', ' ') : 'All regions'}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {datasetsQuery.isLoading ? (
        <CardSkeletonGrid />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.items.map((dataset) => (
            <Card key={dataset.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{dataset.title}</CardTitle>
                  <RegionBadge region={dataset.region} />
                </div>
                <CardDescription className="line-clamp-3">
                  {dataset.description ?? 'No description provided.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <dl className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>
                    <dt className="text-slate-500">Source</dt>
                    <dd className="text-slate-200">{dataset.source ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Format</dt>
                    <dd className="text-slate-200">{dataset.file_format ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Size</dt>
                    <dd className="text-slate-200">{formatSize(dataset.size_mb)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Updated</dt>
                    <dd className="text-slate-200">{formatDate(dataset.last_synced_at)}</dd>
                  </div>
                </dl>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  loading={download.isPending && download.variables?.id === dataset.id}
                  onClick={() => download.mutate(dataset)}
                >
                  <Download className="h-4 w-4" /> Download ({dataset.download_count})
                </Button>
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
