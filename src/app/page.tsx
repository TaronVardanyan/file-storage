'use client';

import { useQuery } from 'convex/react';
import UploadButton from '@/app/upload-button';
import FileCard from '@/app/file-card';
import { useOrganization, useUser } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';

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
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => <FileCard key={file._id} file={file} />)}
      </div>
    </main>
  );
}
