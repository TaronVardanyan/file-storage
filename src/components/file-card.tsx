import { ReactNode } from 'react';
import { Doc } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import FileCardActions from '@/components/file-card-actions';
import { useMutation } from 'convex/react';
import Image from 'next/image';
import { api } from '../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react';

interface Props {
  file: Doc<'files'> & { url: string | null };
}

const FileCard = ({ file }: Props) => {
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);

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
      title: 'File was deleted',
      description: 'File was successfuly removed from the system',
    });
  };

  const handleDownload = () => {
    window.open(file?.url ?? '', '_blank');
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="mr-1 flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute right-2 top-4">
          <FileCardActions handleDelete={handleDelete} />
        </div>
      </CardHeader>
      <CardContent className="flex h-[200px] items-center justify-center">
        {file.type === 'image' && (
          <Image src={file.url ?? ''} alt={file.name} width="200" height="100" />
        )}

        {file.type === 'csv' && <GanttChartIcon className="h-20 w-20" />}
        {file.type === 'pdf' && <FileTextIcon className="h-20 w-20" />}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleDownload}>Download</Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
