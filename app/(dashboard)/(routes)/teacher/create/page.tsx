'use client'

import * as z from 'zod'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
})

const CreatePage = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/courses', values)
      router.push(`/teacher/courses/${response.data.id}`)
      toast.success('Course created')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="flex h-full max-w-5xl p-6 mx-auto md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl">Name your course</h1>

        <p className="text-sm text-slate-600">
          What would you like to call your course? Don&rsquo;t worry, you can
          change this later.
        </p>

        <Form {...form}>
          <form
            className="mt-8 space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>

                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    What will teach in this course?
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>

              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePage
