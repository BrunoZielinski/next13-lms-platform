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
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormDescription,
} from '@/components/ui/form'

interface ChapterAccessFormProps {
  courseId: string
  chapterId: string
  initialData: Chapter
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
})

export const ChapterAccessForm = ({
  courseId,
  chapterId,
  initialData,
}: ChapterAccessFormProps) => {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(prev => !prev)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData?.isFree,
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
        <span>Chapter access</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit access
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            'mt-2 text-sm',
            !initialData.isFree && 'text-slate-500 italic',
          )}
        >
          {initialData.isFree ? (
            <>This chapter is free for preview</>
          ) : (
            <>This chapter is not free</>
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
              name="isFree"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox
                      ref={field.ref}
                      name={field.name}
                      checked={field.value}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this if you want to make this chapter free for
                      preview
                    </FormDescription>
                  </div>
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
