'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader, Loader2, PlusCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Chapter, Course } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { ChaptersList } from './chapters-list'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormItem,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

interface ChaptersFormProps {
  courseId: string
  initialData: Course & { chapters: Chapter[] }
}

const formSchema = z.object({
  title: z.string().trim().min(1, 'Chapters is required'),
})

export const ChaptersForm = ({ courseId, initialData }: ChaptersFormProps) => {
  const router = useRouter()

  const [isUpdating, setIsUpdating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const toggleCreating = () => {
    setIsCreating(prev => !prev)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success('Chapter created')
      toggleCreating()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      })

      toast.success('Chapters reordered')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className="relative p-4 mt-6 border rounded-md bg-slate-100">
      {isUpdating && (
        <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full rounded-md bg-slate-500/20">
          <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium">
        <span>Course chapters</span>

        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
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
                      placeholder='e.g. "Introduction to the course"'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isSubmitting || !isValid} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.chapters.length && 'text-slate-500 italic',
          )}
        >
          {!initialData.chapters.length && 'No chapters'}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}

      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  )
}
