import { Category, Course } from '@prisma/client'

import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'

type CourseWithProgressWithCategory = Course & {
  progress: number | null
  category: Category | null
  chapters: {
    id: string
  }[]
}

type GetCourses = {
  userId: string
  title?: string
  categoryId?: string
}

export const getCourses = async ({
  title,
  userId,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: 'insensitive',
        },
        category: {
          id: categoryId,
        },
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async course => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            }
          }

          const progressPercentage = await getProgress(userId, course.id)

          return {
            ...course,
            progress: progressPercentage,
          }
        }),
      )

    return coursesWithProgress
  } catch (error) {
    console.error('[GET_COURSES]', error)
    return []
  }
}
