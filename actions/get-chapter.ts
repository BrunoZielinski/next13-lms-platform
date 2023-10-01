import { Attachment, Chapter } from '@prisma/client'

import { db } from '@/lib/db'

interface GetChapterProps {
  userId: string
  courseId: string
  chapterId: string
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true,
      },
    })

    const chapter = await db.chapter.findUnique({
      where: {
        courseId,
        id: chapterId,
        isPublished: true,
      },
    })

    if (!chapter || !course) {
      throw new Error('Chapter or course no found')
    }

    let muxData = null
    let attachments: Attachment[] = []
    let nextChapter: Chapter | null = null

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId,
        },
      })
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId,
        },
      })

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: 'asc',
        },
      })
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    })

    return {
      course,
      chapter,
      muxData,
      purchase,
      attachments,
      nextChapter,
      userProgress,
    }
  } catch (error) {
    console.log('[GET_CHAPTER]', error)
    return {
      course: null,
      chapter: null,
      muxData: null,
      attachments: [],
      purchased: false,
      nextChapter: null,
      userProgress: null,
    }
  }
}
