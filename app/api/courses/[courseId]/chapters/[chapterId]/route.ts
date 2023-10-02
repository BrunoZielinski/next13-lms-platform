import Mux from '@mux/mux-node'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
)

export async function DELETE(
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

    if (!chapter) {
      return new NextResponse('Not found', { status: 404 })
    }

    if (chapter.videoUrl) {
      const existingMuxDate = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      })

      if (existingMuxDate) {
        const video = await Video.Assets.get(existingMuxDate.assetId)

        if (video) {
          await Video.Assets.del(existingMuxDate.assetId)
        }

        await db.muxData.delete({
          where: {
            id: existingMuxDate.id,
          },
        })
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        courseId,
        id: chapterId,
      },
    })

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    })

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      })
    }

    return NextResponse.json(deletedChapter)
  } catch (error) {
    console.error('[CHAPTER_ID_DELETE]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth()
    const { courseId, chapterId } = params
    const { isPublished, ...values } = await req.json()

    if (!userId) {
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

    const chapter = await db.chapter.update({
      where: {
        courseId,
        id: chapterId,
      },
      data: {
        ...values,
      },
    })

    if (values.videoUrl) {
      const existingMuxDate = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      })

      if (existingMuxDate) {
        await Video.Assets.del(existingMuxDate.assetId)
        await db.muxData.delete({
          where: {
            id: existingMuxDate.id,
          },
        })
      }

      const asset = await Video.Assets.create({
        test: false,
        input: values.videoUrl,
        playback_policy: 'public',
      })

      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('[COURSE_CHAPTER_ID]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
