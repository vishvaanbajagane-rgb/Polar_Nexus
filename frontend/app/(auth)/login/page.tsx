'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Lock, Mail } from 'lucide-react';

import { PolarLogo } from '@/components/ui/PolarLogo';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const pendingResearchers = useAuthStore((state) => state.pendingResearchers);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = (loginEmail: string) => {
    const emailLower = loginEmail.trim().toLowerCase();

    // Determine role based on email patterns
    const isAdmin =
      emailLower === 'obitovish2008@gmail.com' ||
      emailLower === 'admin@ncpor.res.in' ||
      emailLower.includes('admin');

    const isEducator =
      emailLower.includes('educator') ||
      emailLower.includes('teacher') ||
      emailLower.includes('edu');

    const isPublic =
      emailLower.includes('public') ||
      emailLower.includes('explorer');

    // Look up existing researcher record if any
    const existingPending = pendingResearchers.find(
      (r) => r.email.toLowerCase() === emailLower
    );

    let finalRole: UserRole = 'researcher';
    let finalApproved = false;
    let finalName = existingPending?.name || '';
    let finalOrg = existingPending?.workedIn || existingPending?.organization || '';

    if (isAdmin) {
      finalRole = 'admin';
      finalApproved = true;
      finalName = 'Administrator';
      finalOrg = 'National Centre for Polar and Ocean Research (NCPOR)';
    } else if (isEducator) {
      finalRole = 'educator';
      finalApproved = true;
      finalName = finalName || 'Polar Science Educator';
      finalOrg = finalOrg || 'Polar Outreach & Educational Network';
    } else if (isPublic) {
      finalRole = 'public';
      finalApproved = true;
      finalName = finalName || 'Public Explorer';
      finalOrg = finalOrg || 'Polar Citizen Science Community';
    } else {
      // Researcher
      finalRole = 'researcher';
      finalApproved = existingPending?.status === 'approved';
      finalName = existingPending?.name || 'Researcher';
      finalOrg = existingPending?.workedIn || existingPending?.organization || 'Polar Science Researcher';
    }

    setUser({
      id: `usr-${Date.now()}`,
      email: emailLower,
      full_name: finalName,
      role: finalRole,
      age: existingPending?.age,
      doctorate_degree: existingPending?.doctorateDegree,
      worked_in: existingPending?.workedIn,
      worked_as: existingPending?.workedAs,
      location: existingPending?.location,
      field_of_research: existingPending?.fieldOfResearch,
      organization: finalOrg,
      is_approved: finalApproved,
      created_at: new Date().toISOString(),
    });

    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      performLogin(email);
    }, 250);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[440px] rounded-[28px] bg-white px-8 py-9 md:px-9 md:py-9 shadow-2xl border border-gray-200 select-none text-[#0b1721]"
    >
      {/* Top Emblem Logo Box */}
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 rounded-2xl border border-gray-200 bg-white p-1.5 flex items-center justify-center shadow-md">
          <PolarLogo size={56} />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0b1721]">
          Polar Nexus
        </h1>
        <p className="mt-1 text-xs md:text-sm text-[#5a6f82]">
          Sign in to access your portal view
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs md:text-sm font-bold text-[#0b1721]"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3]" />
            <input
              id="email"
              type="email"
              autoComplete="off"
              required
              placeholder="name@institute.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-10 pr-3.5 text-sm font-medium text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs md:text-sm font-bold text-[#0b1721]"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3]" />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-10 pr-3.5 text-sm font-medium text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[#5a6f82] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-[#0b1721]"
            />
            <span>Remember me</span>
          </label>

          <a
            href="#forgot"
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset link sent to your registered email.');
            }}
            className="text-xs font-semibold text-[#0b1721] underline hover:text-[#008b8b]"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-[#0b1721] hover:bg-[#162a3c] text-sm font-bold text-white shadow-lg transition-all active:scale-[0.99] disabled:opacity-70 mt-3 cursor-pointer"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Bottom Link */}
      <div className="mt-6 text-center text-xs text-[#5a6f82]">
        New here?{' '}
        <Link
          href="/register"
          className="font-bold text-[#0b1721] underline hover:text-[#008b8b]"
        >
          Create an account
        </Link>
      </div>
    </motion.div>
  );
}
