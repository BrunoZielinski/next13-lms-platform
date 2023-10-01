import { Chapter, Course, UserProgress } from '@prisma/client'

import { NavbarRoutes } from '@/components/navbar-routes'
import { CourseMobileSidebar } from './course-mobile-sidebar'

interface CourseNavbarProps {
  progressCount: number
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="flex items-center h-full p-4 bg-white border-b shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  )
}
