import { Course, Category } from '@prisma/client'

import { CourseCard } from '@/components/course-card'

type CourseWithProgressWithCategory = Course & {
  progress: number | null
  category: Category | null
  chapters: { id: string }[]
}

interface CoursesListProps {
  items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map(item => (
          <CourseCard
            id={item.id}
            key={item.id}
            title={item.title}
            price={item.price!}
            imageUrl={item.imageUrl!}
            progress={item.progress}
            category={item?.category?.name!}
            chaptersLength={item.chapters.length}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-10 text-sm text-center text-muted-foreground">
          No courses found
        </div>
      )}
    </div>
  )
}
