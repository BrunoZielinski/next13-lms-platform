import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'
import { CourseNavbar } from './_components/course-navbar'
import { CourseSidebar } from './_components/course-sidebar'

export default async function CourseLayout({
  params,
  children,
}: {
  children: React.ReactNode
  params: { courseId: string }
}) {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  if (!course) return redirect('/')

  const progressCount = await getProgress(userId, course.id)

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>

      <div className="fixed inset-y-0 z-50 flex-col hidden h-full md:flex w-80">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>

      <main className="h-full md:pl-80 pt-[80px]">{children}</main>
    </div>
  )
}
