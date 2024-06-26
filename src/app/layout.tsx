import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import ConvexClientProvider from '@/providers/ConvexClientProvider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import './globals.css';

const font = Poppins({
  subsets: ['latin'],
  weight: ['500'],
});

export const metadata: Metadata = {
  title: 'File Storage',
  description: 'File Storage for personal purposes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ConvexClientProvider>
          <Header />
          {children}
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
