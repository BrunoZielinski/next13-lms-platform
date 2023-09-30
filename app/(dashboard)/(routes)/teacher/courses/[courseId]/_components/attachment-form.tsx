'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { File, Loader2, PlusCircle, X } from 'lucide-react'
import { Attachment, Course } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'

interface AttachmentFormProps {
  courseId: string
  initialData: Course & { attachments: Attachment[] }
}

const formSchema = z.object({
  url: z.string().trim().min(1, 'Attachment is required'),
})

export const AttachmentForm = ({
  courseId,
  initialData,
}: AttachmentFormProps) => {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const toggleEdit = () => setIsEditing(prev => !prev)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success('Course updated')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)

      toast.success('Attachment deleted')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <span>Course attachment</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm italic text-slate-500">
              No attachments yet
            </p>
          )}

          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center w-full p-3 border rounded-md bg-sky-100 border-sky-200 text-sky-700"
                >
                  <File className="flex-shrink-0 w-4 h-4 mr-2" />

                  <p className="text-xs line-clamp-1">{attachment.name}</p>

                  {deletingId === attachment.id && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}

                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={url => {
              if (url) {
                onSubmit({ url })
              }
            }}
          />

          <div className="mt-4 text-xs text-muted-foreground">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  )
}
