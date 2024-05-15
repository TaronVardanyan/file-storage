'use client';

import { useQuery } from 'convex/react';
import UploadButton from '@/components/upload-button';
import FileCard from '@/components/file-card';
import { useOrganization, useUser } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function LandingPage() {
  const { organization } = useOrganization();
  const user = useUser();
  const orgId = organization?.id ?? user.user?.id;
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip');

  return (
    <main className="container mx-auto pt-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Your files</h1>
        <UploadButton />
      </div>
      {files === undefined && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-20 w-20 animate-spin text-gray-500" />
        </div>
      )}
      {files?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-8">
          <Image src="./empty.svg" alt="Empty" width={200} height={200} />
          <div className="text-center text-2xl">You have no files, upload one.</div>
          <UploadButton />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {files?.map((file) => <FileCard key={file._id} file={file} />)}
        </div>
      )}
    </main>
  );
}
