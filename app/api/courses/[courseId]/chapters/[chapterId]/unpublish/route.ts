import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth()
    const { courseId, chapterId } = params

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        userId,
        id: courseId,
        chapters: {
          some: {
            id: chapterId,
          },
        },
      },
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const unpublishedChapter = await db.chapter.update({
      where: {
        courseId,
        id: chapterId,
      },
      data: {
        isPublished: false,
      },
    })

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    })

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      })
    }

    return NextResponse.json(unpublishedChapter)
  } catch (error) {
    console.error('[CHAPTER_UNPUBLISH]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
