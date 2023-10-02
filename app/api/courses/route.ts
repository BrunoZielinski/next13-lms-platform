import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { title } = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!title) {
      return new NextResponse('Title is required', { status: 400 })
    }

    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('[COURSES]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
