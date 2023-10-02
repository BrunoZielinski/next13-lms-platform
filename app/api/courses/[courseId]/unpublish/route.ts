import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth()
    const { courseId } = params

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        userId,
        id: courseId,
      },
    })

    if (!course) {
      return new NextResponse('Not found', { status: 404 })
    }

    const unpublishedCourse = await db.course.update({
      where: {
        userId,
        id: courseId,
      },
      data: {
        isPublished: false,
      },
    })

    return NextResponse.json(unpublishedCourse)
  } catch (error) {
    console.error('[COURSE_ID_UNPUBLISH]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
