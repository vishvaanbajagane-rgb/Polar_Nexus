'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Lock, Mail } from 'lucide-react';

import { PolarLogo } from '@/components/ui/PolarLogo';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addPendingResearcher = useAuthStore((state) => state.addPendingResearcher);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const newUser = {
        id: `usr-${Date.now()}`,
        email,
        full_name: '',
        role: 'researcher' as const,
        organization: '',
        is_approved: false,
        created_at: new Date().toISOString(),
      };
      setUser(newUser);
      setIsLoading(false);
      router.push('/role-selection');
    }, 400);
  };

  const handleGoogleSignup = () => {
    const googleUser = {
      id: `usr-google-${Date.now()}`,
      email: '',
      full_name: '',
      role: 'researcher' as const,
      organization: '',
      is_approved: false,
      created_at: new Date().toISOString(),
    };
    setUser(googleUser);
    router.push('/role-selection');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[440px] rounded-[24px] bg-white px-9 py-9 shadow-2xl border border-gray-100/90 select-none"
    >
      {/* Top Emblem Logo Box */}
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 rounded-2xl border border-gray-200 bg-white p-1 flex items-center justify-center shadow-sm">
          <PolarLogo size={56} />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-6 text-center">
        <h1 className="text-[22px] font-bold tracking-tight text-[#0b1721]">
          Polar Nexus
        </h1>
        <p className="mt-1 text-sm text-[#5a6f82]">
          Create your researcher or explorer account
        </p>
      </div>
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="flex w-full h-11 items-center justify-center gap-3 rounded-lg border border-[#e5e7eb] bg-white text-sm font-medium text-[#0b1721] transition hover:bg-[#f8fafc] active:scale-[0.99]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e5e7eb]" />
          <span className="text-[11px] font-semibold text-[#9aa5b1] uppercase tracking-wider">
            OR
          </span>
          <div className="h-px flex-1 bg-[#e5e7eb]" />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reg-email"
              className="mb-1.5 block text-xs font-semibold text-[#0b1721]"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aa5b1]" />
              <input
                id="reg-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#e5e7eb] bg-white pl-10 pr-3.5 text-sm text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:ring-2 focus:ring-[#008b8b]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="mb-1.5 block text-xs font-semibold text-[#0b1721]"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aa5b1]" />
              <input
                id="reg-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#e5e7eb] bg-white pl-10 pr-3.5 text-sm text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:ring-2 focus:ring-[#008b8b]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-confirm"
              className="mb-1.5 block text-xs font-semibold text-[#0b1721]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aa5b1]" />
              <input
                id="reg-confirm"
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#e5e7eb] bg-white pl-10 pr-3.5 text-sm text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:ring-2 focus:ring-[#008b8b]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-lg bg-[#0b1721] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#172d3f] active:scale-[0.99] disabled:opacity-70 mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="mt-6 text-center text-xs text-[#5a6f82]">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#0b1721] underline hover:text-[#008b8b]"
          >
            Log in
          </Link>
        </div>
      </motion.div>
    );
}
