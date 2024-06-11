'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileIcon, StarIcon, TrashIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export function SideNav() {
  const pathname = usePathname();
  return (
    <div className="flex w-40 flex-col gap-4">
      <Link href="/dashboard/files">
        <Button
          variant="link"
          className={clsx('flex gap-2', {
            'text-blue-500': pathname.includes('/dashboard/files'),
          })}
        >
          <FileIcon className="mr-1" /> All Files
        </Button>
      </Link>

      <Link href="/dashboard/favorites">
        <Button
          variant="link"
          className={clsx('flex gap-2', {
            'text-blue-500': pathname.includes('/dashboard/favorites'),
          })}
        >
          <StarIcon className="mr-1" /> Favorites
        </Button>
      </Link>

      <Link href="/dashboard/trash">
        <Button
          variant="link"
          className={clsx('flex gap-2', {
            'text-blue-500': pathname.includes('/dashboard/trash'),
          })}
        >
          <TrashIcon className="mr-1" /> Trash
        </Button>
      </Link>
    </div>
  );
}
