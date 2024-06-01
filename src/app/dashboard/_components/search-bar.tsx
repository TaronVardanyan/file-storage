import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  query: z.string().min(0).max(200),
});

interface Props {
  setQuery: (query: string) => void;
  query: string;
}

const SearchBar = ({ setQuery, query }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setQuery(values.query);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Your file names" />
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
            <SearchIcon />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchBar;
