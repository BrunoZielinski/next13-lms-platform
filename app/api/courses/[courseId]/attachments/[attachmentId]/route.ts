import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } },
) {
  try {
    const { userId } = auth()
    const { courseId, attachmentId } = params

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
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

    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    })

    return NextResponse.json(attachment)
  } catch (error) {
    console.error('[ATTACHMENT_ID]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
