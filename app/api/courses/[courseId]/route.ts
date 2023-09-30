import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const values = await req.json()

    if (!userId) {
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
