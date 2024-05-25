import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileIcon, StarIcon } from 'lucide-react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-12">
      <div className="flex gap-8">
        <div className="flex w-40 flex-col gap-4">
          <Link href="/dashboard/files">
            <Button variant="link">
              <FileIcon className="mr-1" /> All Files
            </Button>
          </Link>

          <Link href="/dashboard/favorites">
            <Button variant="link">
              <StarIcon className="mr-1" /> Favorites
            </Button>
          </Link>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
