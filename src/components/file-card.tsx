import { Doc } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import FileCardActions from '@/components/file-card-actions';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  file: Doc<'files'>;
}

const FileCard = ({ file }: Props) => {
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);

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

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>{file.name} </CardTitle>
        <div className="absolute right-2 top-4">
          <FileCardActions handleDelete={handleDelete} />
        </div>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
