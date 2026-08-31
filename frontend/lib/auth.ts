'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import type { AuthTokens, User, UserRole } from '@/lib/types';
import { useAuthStore } from '@/store/useAuthStore';

const ROLE_RANK: Record<UserRole, number> = {
  public: 0,
  educator: 1,
  researcher: 2,
  admin: 3,
};

export async function login(email: string, password: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/login', { email, password });
  useAuthStore.getState().setSession(data);
  return data;
}

export async function register(payload: {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  organization?: string;
  country?: string;
}): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/register', payload);
  useAuthStore.getState().setSession(data);
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  useAuthStore.getState().setUser(data);
  return data;
}

export function logout() {
  useAuthStore.getState().logout();
}

/** Client-side route guard used by the dashboard layout and admin pages. */
export function useRequireAuth(minimumRole: UserRole = 'public') {
  const router = useRouter();
  const { user, accessToken, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken || !user) {
      router.replace('/login');
      return;
    }
    if (ROLE_RANK[user.role] < ROLE_RANK[minimumRole]) {
      router.replace('/dashboard');
    }
  }, [accessToken, hydrated, minimumRole, router, user]);

  return { user, ready: hydrated && Boolean(user) };
}
