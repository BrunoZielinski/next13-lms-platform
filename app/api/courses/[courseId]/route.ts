import Mux from '@mux/mux-node'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID as string,
  process.env.MUX_TOKEN_SECRET as string,
)

export async function DELETE(
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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    })

    if (!course) {
      return new NextResponse('Not found', { status: 404 })
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId).catch(() => {})
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        userId,
        id: courseId,
      },
    })

    return NextResponse.json(deletedCourse)
  } catch (error) {
    console.error('[COURSE_ID_DELETE]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const values = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.update({
      where: {
        userId,
        id: courseId,
      },
      data: values,
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('[COURSE_ID]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
