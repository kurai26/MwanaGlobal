import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export const metadata: Metadata = {
  title: {
    default: 'Mwana Global - Discover Where Your Talent Can Take You',
    template: '%s | Mwana Global',
  },
  description:
    'Mwana Global matches African students with scholarships, universities, sports recruitment opportunities and global education pathways.',
  keywords: ['African students', 'scholarships', 'university', 'sports recruitment', 'fellowships', 'education', 'Zimbabwe', 'Africa'],
  authors: [{ name: 'Mwana Global' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mwanaglobal.com',
    siteName: 'Mwana Global',
    title: 'Mwana Global - Discover Where Your Talent Can Take You',
    description: 'Connecting African students with global opportunities.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mwana Global' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MwanaGlobal',
    creator: '@MwanaGlobal',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster richColors position="top-right" expand />
        </Providers>
      </body>
    </html>
  );
}
