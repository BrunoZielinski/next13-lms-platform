import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const { url } = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!url) {
      return new NextResponse('File URL is required', { status: 400 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        userId,
        id: courseId,
      },
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        courseId,
        name: url.split('/').pop(),
      },
    })

    return NextResponse.json(attachment)
  } catch (error) {
    console.error('[COURSE_ID_ATTACHMENTS]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
