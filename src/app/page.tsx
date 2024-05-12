'use client';

import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from 'convex/react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, 'Required'),
});

export default function LandingPage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [isFileDialogOpen, setFileDialogOpen] = useState(false);
  const { isLoaded, organization } = useOrganization();
  const user = useUser();
  const orgId = organization?.id ?? user.user?.id;
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip');

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

    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': values.file[0]!.type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    await createFile({
      name: values.title,
      fileId: storageId,
      orgId: orgId ?? '',
    });

    form.reset();
    setFileDialogOpen(false);
  };

  return (
    <main className="container mx-auto pt-24">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Your files</h1>

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
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
    </main>
  );
}
