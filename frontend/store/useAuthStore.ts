import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthTokens, User, UserRole } from '@/lib/types';
import { INITIAL_NOTIFICATIONS, NotificationItem } from '@/lib/polar-data';

const ROLE_RANK: Record<UserRole, number> = {
  public: 0,
  educator: 1,
  researcher: 2,
  admin: 3,
};

export interface PendingResearcherItem {
  id: string;
  name: string;
  email: string;
  age?: string | number;
  doctorateDegree?: string;
  workedIn?: string;
  workedAs?: string;
  location?: string;
  fieldOfResearch?: string;
  organization: string;
  role: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  theme: 'dark' | 'light';
  activeTab: string;
  pendingResearchers: PendingResearcherItem[];
  notifications: NotificationItem[];
  setSession: (tokens: AuthTokens) => void;
  setUser: (user: User) => void;
  setHydrated: (value: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
  logout: () => void;
  hasRole: (minimum: UserRole) => boolean;
  addPendingResearcher: (item: Omit<PendingResearcherItem, 'id' | 'appliedDate' | 'status'> & { id?: string; appliedDate?: string }) => void;
  approveResearcher: (id: string) => void;
  rejectResearcher: (id: string) => void;
  addNotification: (notif: NotificationItem) => void;
  markAllNotificationsAsRead: () => void;
  toggleNotificationRead: (id: string) => void;
  checkApprovalStatus: () => boolean;
}

const DEFAULT_DEMO_USER: User = {
  id: 'usr-1',
  email: 'obitovish2008@gmail.com',
  full_name: 'Administrator',
  role: 'admin',
  organization: 'National Centre for Polar and Ocean Research',
  is_approved: true,
  created_at: '2026-01-15T08:00:00Z',
};

const INITIAL_PENDING_USERS: PendingResearcherItem[] = [
  {
    id: 'req-1',
    name: 'Dr. Ananya Sharma',
    email: 'a.sharma@iisc.ac.in',
    age: 36,
    doctorateDegree: 'Ph.D. in Polar Cryospheric Geophysics',
    workedIn: 'Indian Institute of Science (IISc), Bangalore',
    workedAs: 'Associate Professor & Senior Glaciologist',
    location: 'Bangalore, Karnataka, India',
    fieldOfResearch: 'Antarctic Ice Shelf Dynamics',
    organization: 'Indian Institute of Science, Bangalore',
    role: 'Glaciologist',
    appliedDate: '2026-08-28',
    status: 'pending',
  },
  {
    id: 'req-2',
    name: 'Dr. Vikram Joshi',
    email: 'v.joshi@nio.org',
    age: 41,
    doctorateDegree: 'Ph.D. in Marine Oceanography',
    workedIn: 'CSIR - National Institute of Oceanography (NIO)',
    workedAs: 'Principal Oceanographic Analyst',
    location: 'Goa, India',
    fieldOfResearch: 'Southern Ocean Biogeochemistry',
    organization: 'CSIR - National Institute of Oceanography',
    role: 'Oceanographic Analyst',
    appliedDate: '2026-08-29',
    status: 'pending',
  },
  {
    id: 'req-3',
    name: 'Kavita Menon',
    email: 'kavita.m@nplindia.org',
    age: 29,
    doctorateDegree: 'Ph.D. Scholar in Atmospheric Physics',
    workedIn: 'CSIR - National Physical Laboratory (NPL)',
    workedAs: 'Junior Research Scientist',
    location: 'New Delhi, India',
    fieldOfResearch: 'Polar Aerosols & Ozone Column Analysis',
    organization: 'CSIR - National Physical Laboratory',
    role: 'Atmospheric Physicist',
    appliedDate: '2026-08-30',
    status: 'pending',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: true,
      theme: 'dark',
      activeTab: 'overview',
      pendingResearchers: INITIAL_PENDING_USERS,
      notifications: INITIAL_NOTIFICATIONS,
      setSession: (tokens) =>
        set({
          user: tokens.user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        }),
      setUser: (user) => set({ user }),
      setHydrated: (value) => set({ hydrated: value }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setActiveTab: (activeTab) => set({ activeTab }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
      hasRole: (minimum) => {
        const role = get().user?.role;
        if (!role) return false;
        return ROLE_RANK[role] >= ROLE_RANK[minimum];
      },
      addPendingResearcher: (item) => {
        const existing = get().pendingResearchers.find(
          (r) => r.email.toLowerCase() === item.email.toLowerCase()
        );

        const newReq: PendingResearcherItem = {
          id: existing?.id || item.id || `req-${Date.now()}`,
          name: item.name || existing?.name || 'Researcher',
          email: item.email,
          age: item.age || existing?.age,
          doctorateDegree: item.doctorateDegree || existing?.doctorateDegree,
          workedIn: item.workedIn || item.organization || existing?.workedIn || existing?.organization || 'Polar Science Researcher',
          workedAs: item.workedAs || item.role || existing?.workedAs || existing?.role || 'Researcher',
          location: item.location || existing?.location || 'India',
          fieldOfResearch: item.fieldOfResearch || existing?.fieldOfResearch,
          organization: item.organization || item.workedIn || existing?.organization || 'Polar Science Researcher',
          role: item.role || item.workedAs || existing?.role || 'Researcher',
          appliedDate: existing?.appliedDate || item.appliedDate || new Date().toISOString().split('T')[0],
          status: existing?.status || 'pending',
        };

        const degreeText = newReq.doctorateDegree ? ` [${newReq.doctorateDegree}]` : '';
        const orgText = newReq.workedIn ? ` from ${newReq.workedIn}` : '';
        const locText = newReq.location ? ` (${newReq.location})` : '';

        const adminNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: 'New Researcher Access Request',
          message: `${newReq.name}${degreeText}${orgText}${locText} (${newReq.email}) has submitted researcher credentials. An email alert has been dispatched to admin inbox for verification.`,
          timestamp: 'Just now',
          type: 'info',
          read: false,
          link_tab: 'console',
          target_role: 'admin',
        };

        set((state) => {
          const filtered = state.pendingResearchers.filter(
            (r) => r.email.toLowerCase() !== item.email.toLowerCase()
          );
          return {
            pendingResearchers: [newReq, ...filtered],
            notifications: [adminNotif, ...state.notifications],
          };
        });
      },
      approveResearcher: (id) => {
        set((state) => {
          let approvedName = 'Researcher';
          let approvedEmail = '';
          const updatedList = state.pendingResearchers.map((r) => {
            if (r.id === id || r.email.toLowerCase() === id.toLowerCase()) {
              approvedName = r.name;
              approvedEmail = r.email;
              return { ...r, status: 'approved' as const };
            }
            return r;
          });

          // If current logged-in user matches the approved person, mark is_approved = true
          let currentUser = state.user;
          if (
            currentUser &&
            (currentUser.id === id ||
              (approvedEmail && currentUser.email.toLowerCase() === approvedEmail.toLowerCase()))
          ) {
            currentUser = {
              ...currentUser,
              is_approved: true,
              role: 'researcher',
            };
          }

          const approvalNotif: NotificationItem = {
            id: `notif-adm-${Date.now()}`,
            title: 'Researcher Access Approved',
            message: `${approvedName} (${approvedEmail || id}) has been granted full researcher access.`,
            timestamp: 'Just now',
            type: 'success',
            read: false,
            link_tab: 'console',
            target_role: 'admin',
          };

          const userDirectNotif: NotificationItem = {
            id: `notif-user-${Date.now()}`,
            title: 'Researcher Application Approved!',
            message: `Congratulations ${approvedName}! Your research credential verification has been approved. You now have full access to submit datasets, view raw station telemetry, and publish findings.`,
            timestamp: 'Just now',
            type: 'success',
            read: false,
            link_tab: 'overview',
            target_email: approvedEmail || undefined,
            target_role: 'researcher',
          };

          return {
            pendingResearchers: updatedList,
            user: currentUser,
            notifications: [approvalNotif, userDirectNotif, ...state.notifications],
          };
        });
      },
      rejectResearcher: (id) =>
        set((state) => ({
          pendingResearchers: state.pendingResearchers.map((r) =>
            r.id === id ? { ...r, status: 'rejected' } : r
          ),
        })),
      addNotification: (notif) =>
        set((state) => ({
          notifications: [notif, ...state.notifications],
        })),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      toggleNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: !n.read } : n
          ),
        })),
      checkApprovalStatus: () => {
        const state = get();
        if (!state.user) return false;
        if (state.user.role !== 'researcher') return true;
        if (state.user.is_approved) return true;

        const found = state.pendingResearchers.find(
          (r) => r.email.toLowerCase() === state.user?.email.toLowerCase()
        );
        if (found && found.status === 'approved') {
          set({
            user: {
              ...state.user,
              is_approved: true,
            },
          });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'polar-nexus-auth',
      partialize: ({
        user,
        accessToken,
        refreshToken,
        theme,
        activeTab,
        pendingResearchers,
        notifications,
      }) => ({
        user,
        accessToken,
        refreshToken,
        theme,
        activeTab,
        pendingResearchers,
        notifications,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
