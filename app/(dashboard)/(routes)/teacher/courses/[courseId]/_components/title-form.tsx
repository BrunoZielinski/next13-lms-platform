'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormItem,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

interface TitleFormProps {
  courseId: string
  initialData: {
    title: string
  }
}

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
})

export const TitleForm = ({ courseId, initialData }: TitleFormProps) => {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(prev => !prev)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success('Course updated')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <span>Course title</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit title
            </>
          )}
        </Button>
      </div>

      {!isEditing && <p className="mt-2 text-sm">{initialData.title}</p>}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='e.g. "Advanced web development"'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
