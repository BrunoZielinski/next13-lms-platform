import { Menu } from 'lucide-react'
import { Chapter, Course, UserProgress } from '@prisma/client'

import { CourseSidebar } from './course-sidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface CourseMobileSidebarProps {
  progressCount: number
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
}

export const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition md:hidden hover:opacity-75">
        <Menu className="w-6 h-6" />
      </SheetTrigger>

      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  )
}
