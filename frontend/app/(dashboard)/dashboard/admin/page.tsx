'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { CheckCircle2, RefreshCw, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth';
import type { DailyUpdateLog, Page, ResearcherApplication, User } from '@/lib/types';
import { cn, formatDate, ROLE_LABELS } from '@/lib/utils';

const TAB_TRIGGER =
  'rounded-xl px-4 py-2 text-sm text-slate-400 data-[state=active]:bg-ice-500/15 data-[state=active]:text-white';

export default function AdminPage() {
  const { ready } = useRequireAuth('admin');
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const applications = useQuery({
    queryKey: ['applications'],
    queryFn: async () =>
      (await api.get<ResearcherApplication[]>('/users/applications/all')).data,
    enabled: ready,
  });

  const users = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get<Page<User>>('/users', { params: { size: 50 } })).data,
    enabled: ready,
  });

  const logs = useQuery({
    queryKey: ['update-logs'],
    queryFn: async () =>
      (await api.get<DailyUpdateLog[]>('/dashboard/update-logs', { params: { limit: 25 } })).data,
    enabled: ready,
  });

  const review = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'approved' | 'rejected';
    }) => {
      await api.post(`/users/applications/${id}/review`, {
        status,
        review_notes: notes[id] || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const triggerUpdate = useMutation({
    mutationFn: async () => api.post('/dashboard/trigger-daily-update'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['update-logs'] }),
  });

  if (!ready) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin console</h1>
          <p className="mt-1 text-sm text-slate-400">
            Approve researcher access, manage users and run data synchronisation
          </p>
        </div>
        <Button loading={triggerUpdate.isPending} onClick={() => triggerUpdate.mutate()}>
          <RefreshCw className="h-4 w-4" /> Run daily update now
        </Button>
      </div>

      <Tabs.Root defaultValue="applications">
        <Tabs.List className="mb-4 inline-flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
          <Tabs.Trigger value="applications" className={TAB_TRIGGER}>
            Researcher applications
          </Tabs.Trigger>
          <Tabs.Trigger value="users" className={TAB_TRIGGER}>
            Users
          </Tabs.Trigger>
          <Tabs.Trigger value="logs" className={TAB_TRIGGER}>
            Sync logs
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="applications" className="space-y-4">
          {applications.isLoading ? <Skeleton className="h-32" /> : null}
          {applications.data?.length === 0 ? (
            <p className="text-sm text-slate-500">No applications yet.</p>
          ) : null}
          {applications.data?.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      {application.user?.full_name ?? 'Applicant'}
                    </CardTitle>
                    <CardDescription>
                      {application.user?.email} · {application.institution}
                    </CardDescription>
                  </div>
                  <Badge
                    className={cn(
                      'capitalize',
                      application.status === 'approved'
                        ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                        : application.status === 'rejected'
                          ? 'border-rose-400/30 bg-rose-500/10 text-rose-300'
                          : 'border-amber-400/30 bg-amber-500/10 text-amber-300',
                    )}
                  >
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <p>
                  <span className="text-slate-500">Research area:</span>{' '}
                  {application.research_area ?? '—'}
                </p>
                <p>
                  <span className="text-slate-500">Motivation:</span>{' '}
                  {application.motivation ?? '—'}
                </p>
                <p className="text-xs text-slate-500">
                  Submitted {formatDate(application.created_at, 'dd MMM yyyy HH:mm')}
                </p>
                {application.status === 'pending' ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      className="max-w-sm"
                      placeholder="Review notes (optional)"
                      value={notes[application.id] ?? ''}
                      onChange={(event) =>
                        setNotes((current) => ({ ...current, [application.id]: event.target.value }))
                      }
                    />
                    <Button
                      size="sm"
                      variant="success"
                      loading={review.isPending && review.variables?.id === application.id}
                      onClick={() => review.mutate({ id: application.id, status: 'approved' })}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => review.mutate({ id: application.id, status: 'rejected' })}
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                ) : application.review_notes ? (
                  <p className="text-xs text-slate-500">Notes: {application.review_notes}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </Tabs.Content>

        <Tabs.Content value="users">
          <Card>
            <CardContent className="overflow-x-auto py-4">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2">Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.data?.items.map((user) => (
                    <tr key={user.id} className="text-slate-300">
                      <td className="py-3">{user.full_name}</td>
                      <td className="text-slate-400">{user.email}</td>
                      <td>{ROLE_LABELS[user.role]}</td>
                      <td>{user.is_verified ? 'Yes' : 'No'}</td>
                      <td className="text-slate-400">{formatDate(user.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="logs" className="space-y-3">
          {logs.data?.map((log) => (
            <div
              key={log.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
            >
              <div>
                <p className="text-slate-100">{log.task_name}</p>
                <p className="text-xs text-slate-500">
                  {log.source ?? 'internal'} · {formatDate(log.started_at, 'dd MMM yyyy HH:mm')}
                  {log.message ? ` · ${log.message}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge>+{log.records_created} new</Badge>
                <Badge>{log.records_updated} updated</Badge>
                <Badge
                  className={cn(
                    'capitalize',
                    log.status === 'success'
                      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-400/30 bg-rose-500/10 text-rose-300',
                  )}
                >
                  {log.status}
                </Badge>
              </div>
            </div>
          ))}
          {logs.data?.length === 0 ? (
            <p className="text-sm text-slate-500">No synchronisation runs recorded yet.</p>
          ) : null}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
