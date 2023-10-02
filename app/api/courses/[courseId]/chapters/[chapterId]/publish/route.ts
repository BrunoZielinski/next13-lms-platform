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

    const chapter = await db.chapter.findUnique({
      where: {
        courseId,
        id: chapterId,
      },
    })

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId,
      },
    })

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.videoUrl ||
      !chapter.description
    ) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const publishedChapter = await db.chapter.update({
      where: {
        courseId,
        id: chapterId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(publishedChapter)
  } catch (error) {
    console.error('[CHAPTER_PUBLISH]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
