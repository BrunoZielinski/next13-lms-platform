import { Course } from '@prisma/client'

interface CourseSidebarProps {
  course: Course
  progressCount: number
}

export const CourseSidebar = ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  return <div></div>
}
