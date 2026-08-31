import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Polar Nexus | Integrated Science Portal',
  description:
    'Unified polar research portal for datasets, publications, expeditions, stations and environmental alerts. Smart India Hackathon 2026.',
  keywords: ['polar', 'antarctic', 'arctic', 'research', 'datasets', 'SIH 2026'],
};

export const viewport: Viewport = {
  themeColor: '#03060d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
