'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Chapter } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Loader2, Pencil } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { Editor } from '@/components/editor'
import { Preview } from '@/components/preview'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormItem,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

interface ChapterDescriptionFormProps {
  courseId: string
  chapterId: string
  initialData: Chapter
}

const formSchema = z.object({
  description: z.string().trim().min(1, 'Description is required'),
})

export const ChapterDescriptionForm = ({
  courseId,
  chapterId,
  initialData,
}: ChapterDescriptionFormProps) => {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(prev => !prev)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values,
      )
      toast.success('Chapter updated')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="relative p-4 mt-6 border rounded-md bg-slate-100">
      {form.formState.isSubmitting && (
        <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full rounded-md bg-slate-500/20">
          <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium">
        <span>Chapter description</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            'mt-2 text-sm',
            !initialData.description && 'text-slate-500 italic',
          )}
        >
          {initialData.description ? (
            <Preview value={initialData.description} />
          ) : (
            'No description'
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="description"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormControl>
                    <Editor value={value} onChange={onChange} />
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
