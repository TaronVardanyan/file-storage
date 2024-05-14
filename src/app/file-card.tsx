import { Doc } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  file: Doc<'files'>;
}

const FileCard = ({ file }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{file.name}</CardTitle>
        {/*<CardDescription>Card Description</CardDescription>*/}
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
