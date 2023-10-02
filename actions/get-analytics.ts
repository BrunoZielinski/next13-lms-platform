import { Course, Purchase } from '@prisma/client'

import { db } from '@/lib/db'

type PurchaseWithCourse = Purchase & {
  course: Course
}

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: {
    [courseTitle: string]: number
  } = {}

  purchases.forEach(purchase => {
    const courseTitle = purchase.course.title

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0
    }

    grouped[courseTitle] += purchase.course.price!
  })

  return grouped
}

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    })

    const groupedEarnings = groupByCourse(purchases)
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        total,
        name: courseTitle,
      }),
    )

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0)
    const totalSales = purchases.length

    return {
      data,
      totalSales,
      totalRevenue,
    }
  } catch (error) {
    console.error('[GET_ANALYTICS]', error)
    return {
      data: [],
      totalSales: 0,
      totalRevenue: 0,
    }
  }
}
