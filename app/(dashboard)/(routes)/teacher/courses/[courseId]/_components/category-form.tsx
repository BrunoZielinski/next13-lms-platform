'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil } from 'lucide-react'
import { Course } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormItem,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { Combobox } from '@/components/ui/combobox'

interface CategoryFormProps {
  courseId: string
  initialData: Course
  options: {
    value: string
    label: string
  }[]
}

const formSchema = z.object({
  categoryId: z.string().trim().min(1, 'Category is required'),
})

export const CategoryForm = ({
  options,
  courseId,
  initialData,
}: CategoryFormProps) => {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(prev => !prev)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || '',
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

  const selectedOption = options.find(
    option => option.value === initialData.categoryId,
  )

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <span>Course category</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            'mt-2 text-sm',
            !initialData.categoryId && 'text-slate-500 italic',
          )}
        >
          {selectedOption?.label || 'No category'}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
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
