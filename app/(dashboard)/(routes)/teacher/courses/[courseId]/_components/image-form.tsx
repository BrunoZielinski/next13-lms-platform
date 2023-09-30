'use client'

import * as z from 'zod'
import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Course } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'

interface ImageFormProps {
  courseId: string
  initialData: Course
}

const formSchema = z.object({
  imageUrl: z.string().trim().min(1, 'Image is required'),
})

export const ImageForm = ({ courseId, initialData }: ImageFormProps) => {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(prev => !prev)

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
        <span>Course image</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add an image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
            <ImageIcon className="w-10 h-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              fill
              alt="Upload"
              src={initialData.imageUrl}
              className="object-cover rounded-md"
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={url => {
              if (url) {
                onSubmit({ imageUrl: url })
              }
            }}
          />

          <div className="mt-4 text-xs text-muted-foreground">
            13:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  )
}
