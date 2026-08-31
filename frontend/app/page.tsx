'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from './(auth)/login/page';
import AuthLayout from './(auth)/layout';

export default function RootPage() {
  return (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  );
}
