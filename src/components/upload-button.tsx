'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Doc } from '../../convex/_generated/dataModel';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, 'Required'),
});

const UploadButton = () => {
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [isFileDialogOpen, setFileDialogOpen] = useState(false);
  const { isLoaded, organization } = useOrganization();
  const user = useUser();
  const orgId = organization?.id ?? user.user?.id;
  const createFile = useMutation(api.files.createFile);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      file: undefined,
    },
  });

  const fileRef = form.register('file');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!orgId) return;

    const postUrl = await generateUploadUrl();

    const fileType = values.file[0].type;

    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': fileType },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    const types = {
      'image/png': 'image',
      'application/pdf': 'pdf',
      'text/csv': 'csv',
    } as Record<string, Doc<'files'>['type']>;

    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId: orgId ?? '',
        type: types[fileType],
      });

      setFileDialogOpen(false);

      toast({
        variant: 'success',
        title: 'File Uploaded: Catch Up',
        description: 'Now everyone can view Your file',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Your file could not be uploaded',
      });
    }

    form.reset();
  };

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setFileDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={!isLoaded}>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Upload Your file here</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex items-center justify-between gap-2"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
