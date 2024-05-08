'use client';

import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from 'convex/react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';

export default function LandingPage() {
  const { isLoaded, organization } = useOrganization();
  const user = useUser();
  const orgId = organization?.id ?? user.user?.id;
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip');

  const handleClick = async () => {
    await createFile({
      name: 'hello world',
      orgId: orgId ?? '',
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button disabled={!isLoaded} onClick={handleClick}>
        click me
      </Button>
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
    </main>
  );
}
