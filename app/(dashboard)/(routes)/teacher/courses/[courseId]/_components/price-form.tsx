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
import { formatPrice } from '@/lib/format'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormItem,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

interface PriceFormProps {
  courseId: string
  initialData: Course
}

const formSchema = z.object({
  price: z.coerce.number(),
})

export const PriceForm = ({ courseId, initialData }: PriceFormProps) => {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  })

  const { isSubmitting, isValid } = form.formState

  const toggleEdit = () => {
    setIsEditing(prev => !prev)
  }

  const updateCourse = async (values: z.infer<typeof formSchema>) => {
    await axios.patch(`/api/courses/${courseId}`, values)
    toggleEdit()
    router.refresh()
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(updateCourse(values), {
      loading: 'Updating course...',
      success: 'Course updated',
      error: 'Something went wrong',
    })
  }

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <span>Course price</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            'mt-2 text-sm',
            !initialData.price && 'text-slate-500 italic',
          )}
        >
          {initialData.price ? formatPrice(initialData.price) : 'No price'}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      step={0.01}
                      type="number"
                      disabled={isSubmitting}
                      placeholder='e.g. "Set a price for your course"'
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
