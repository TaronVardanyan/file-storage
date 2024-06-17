import { ColumnDef } from '@tanstack/react-table';
import { formatRelative } from 'date-fns';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FileCardActions from '@/app/dashboard/_components/file-card-actions';
import { useMutation, useQuery } from 'convex/react';
import { useToast } from '@/components/ui/use-toast';

export type File = {
  id: string;
  name: string;
  type: 'image' | 'csv' | 'pdf';
  _creationTime: string;
  userId: Id<'users'>;
  shouldDelete: boolean;
  isFavorited: boolean;
  _id: Id<'files'>;
  url: string;
};

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'uploadedOn',
    header: 'Uploaded On',
    cell: ({ row }) => {
      return (
        <div>
          {row?.original?._creationTime &&
            formatRelative(new Date(row?.original?._creationTime), new Date())}
        </div>
      );
    },
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const userProfile =
        row.original.userId &&
        useQuery(api.users.getUserProfile, {
          userId: row.original.userId,
        });
      return (
        <div className="flex w-60 items-center justify-start gap-2 text-xs text-gray-700">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'actions',
    cell: ({ row }) => {
      const { toast } = useToast();
      const deleteFile = useMutation(api.files.deleteFile);
      const restoreFile = useMutation(api.files.restoreFile);
      const favorite = useMutation(api.files.toggleFavorite);

      const handleDelete = async () => {
        await deleteFile({
          fileId: row.original._id,
        });
        toast({
          variant: 'default',
          title: 'File marked for deletion!',
          description: 'File will be deleted soon',
        });
      };

      const handleRestore = async () => {
        await restoreFile({
          fileId: row.original._id,
        });
        toast({
          variant: 'default',
          title: 'File was restored!',
        });
      };

      const handleFavorite = async () => {
        await favorite({
          fileId: row.original._id,
        });
      };

      const handleDownload = () => {
        window.open(file?.url ?? '', '_blank');
      };

      return (
        <div className="flex w-60 items-center justify-start gap-2 text-xs text-gray-700">
          <FileCardActions
            isFavorited={row.original.isFavorited}
            handleFavorite={handleFavorite}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            shouldDelete={row.original.shouldDelete}
            handleDownload={handleDownload}
          />
        </div>
      );
    },
  },
];
