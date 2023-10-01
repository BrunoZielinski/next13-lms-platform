import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Chapter, Course, UserProgress } from '@prisma/client'

import { db } from '@/lib/db'
import { CourseSidebarItem } from './course-sidebar-item'
import { CourseProgress } from '@/components/course-progress'

interface CourseSidebarProps {
  progressCount: number
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  })

  return (
    <div className="flex flex-col h-full overflow-y-auto border-r shadow-sm select-none">
      <div className="flex flex-col p-8 border-b">
        <h1 className="font-semibold">{course.title}</h1>

        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full">
        {course.chapters.map(chapter => (
          <CourseSidebarItem
            id={chapter.id}
            key={chapter.id}
            courseId={course.id}
            label={chapter.title}
            isLocked={!chapter.isFree && !purchase}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
          />
        ))}
      </div>
    </div>
  )
}
