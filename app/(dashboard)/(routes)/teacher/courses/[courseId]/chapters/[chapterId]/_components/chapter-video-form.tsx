'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import MuxPlayer from '@mux/mux-player-react'
import { Chapter, MuxData } from '@prisma/client'
import { Pencil, PlusCircle, Video } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'

interface ChapterVideoFormProps {
  courseId: string
  chapterId: string
  initialData: Chapter & { muxData?: MuxData | null }
}

const formSchema = z.object({
  videoUrl: z.string().trim().min(1, 'Video is required'),
})

export const ChapterVideoForm = ({
  courseId,
  chapterId,
  initialData,
}: ChapterVideoFormProps) => {
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(prev => !prev)

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
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <span>Chapter video</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
            <Video className="w-10 h-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={url => {
              if (url) {
                onSubmit({ videoUrl: url })
              }
            }}
          />

          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  )
}
