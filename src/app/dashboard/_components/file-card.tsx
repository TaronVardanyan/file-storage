import { ReactNode } from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import FileCardActions from './file-card-actions';
import { formatRelative } from 'date-fns';
import { useMutation, useQuery } from 'convex/react';
import Image from 'next/image';
import { api } from '../../../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  file: Doc<'files'> & { url: string | null };
  favorites: Doc<'favorites'>[];
}

const FileCard = ({ file, favorites }: Props) => {
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const favorite = useMutation(api.files.toggleFavorite);
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const isFavorited = favorites.some((favorite) => favorite.fileId === file._id);

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<'files'>['type'], ReactNode>;

  const handleDelete = async () => {
    await deleteFile({
      fileId: file._id,
    });

    toast({
      variant: 'default',
      title: 'File marked for deletion!',
      description: 'File will be deleted soon',
    });
  };

  const handleRestore = async () => {
    await restoreFile({
      fileId: file._id,
    });
    toast({
      variant: 'default',
      title: 'File was restored!',
    });
  };

  const handleFavorite = async () => {
    await favorite({
      fileId: file._id,
    });
  };

  const handleDownload = () => {
    window.open(file?.url ?? '', '_blank');
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="mb-6 flex gap-2 text-base font-normal">
          <div className="mr-1 flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute right-2 top-4">
          <FileCardActions
            isFavorited={isFavorited}
            handleFavorite={handleFavorite}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            shouldDelete={file.shouldDelete}
            handleDownload={handleDownload}
          />
        </div>
      </CardHeader>
      <CardContent className="flex h-[200px] items-center justify-center">
        {file.type === 'image' && (
          <Image src={file.url ?? ''} alt={file.name} width="200" height="100" />
        )}

        {file.type === 'csv' && <GanttChartIcon className="h-20 w-20" />}
        {file.type === 'pdf' && <FileTextIcon className="h-20 w-20" />}
      </CardContent>
      <CardFooter className="mt-6 flex justify-between gap-4">
        <div className="flex w-60 items-center justify-start gap-2 text-xs text-gray-700">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
