'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import UploadButton from './upload-button';
import FileCard from './file-card';
import SearchBar from './search-bar';
import { GridIcon, TableIcon } from 'lucide-react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { api } from '../../../../convex/_generated/api';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { DataTable } from './file-table';
import { columns } from './columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Doc } from '../../../../convex/_generated/dataModel';

interface Props {
  title: string;
  isFavorites?: boolean;
  deleteOnly?: boolean;
}

export default function FilesBrowser({ title, isFavorites = false, deleteOnly = false }: Props) {
  const { organization } = useOrganization();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all');

  const user = useUser();
  const orgId = organization?.id ?? user.user?.id;
  const favorites = useQuery(api.files.getAllFavorites, orgId ? { orgId } : 'skip');
  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === 'all' ? undefined : type,
          query,
          favorites: isFavorites,
          deleteOnly,
        }
      : 'skip',
  );

  const filesData = files?.map((file) => ({
    name: file.name,
    type: file.type,
    userId: file.userId,
    _creationTime: file._creationTime,
    shouldDelete: file.shouldDelete,
    isFavorited: favorites?.some((favorite) => favorite.fileId === file._id),
    _id: file._id,
    url: file.url,
  }));

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar setQuery={setQuery} query={query} />
        <UploadButton />
      </div>
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between">
          <TabsList className="mb-8">
            <TabsTrigger className="flex items-center gap-2" value="grid">
              <GridIcon /> Grid
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="table">
              <TableIcon /> Table
            </TabsTrigger>
          </TabsList>
          <div>
            <Select value={type} onValueChange={(newType) => setType(newType as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="grid">
          <>
            {files === undefined && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-20 w-20 animate-spin text-gray-500" />
              </div>
            )}
            {files?.length === 0 && !query ? (
              <div className="flex flex-col items-center justify-center gap-8">
                <Image src="/empty.svg" alt="Empty" width={200} height={200} />
                <div className="text-center text-2xl">You have no files, upload one.</div>
                <UploadButton />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {files?.map((file) => (
                  <FileCard key={file._id} file={file} favorites={favorites ?? []} />
                ))}
              </div>
            )}
          </>
        </TabsContent>
        <TabsContent value="table">
          {filesData && <DataTable columns={columns} data={filesData} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
