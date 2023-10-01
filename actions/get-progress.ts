import { db } from '@/lib/db'

export const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    })

    const publishedChapterIds = publishedChapters.map(({ id }) => id)

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        isCompleted: true,
        chapterId: {
          in: publishedChapterIds,
        },
      },
    })

    const progressPercentage =
      (validCompletedChapters / publishedChapters.length) * 100

    return progressPercentage
  } catch (error) {
    console.error('[GET_PROGRESS]', error)
    return 0
  }
}
