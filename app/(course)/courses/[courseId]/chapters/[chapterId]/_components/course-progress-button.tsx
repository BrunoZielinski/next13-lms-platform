'use client'

import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/use-confetti-store'

interface CourseProgressButtonProps {
  courseId: string
  chapterId: string
  isCompleted?: boolean
  nextChapterId?: string
}

export const CourseProgressButton = ({
  courseId,
  chapterId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter()
  const { onOpen } = useConfettiStore()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      toast.loading('Updating progress...', {
        id: 'progress-toast',
      })

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        },
      )

      if (!isCompleted && !nextChapterId) {
        toast.success('Course completed!')
        onOpen()
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success('Progress updated')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
      toast.dismiss('progress-toast')
    }
  }

  const Icon = isCompleted ? XCircle : CheckCircle

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto"
      variant={isCompleted ? 'outline' : 'success'}
    >
      {isCompleted ? 'Not completed' : 'Mark as complete'}
      <Icon className="w-4 h-4 ml-2" />
    </Button>
  )
}
