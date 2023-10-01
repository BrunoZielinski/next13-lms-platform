import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import {
  File,
  ListChecks,
  LayoutDashboard,
  CircleDollarSign,
} from 'lucide-react'

import { db } from '@/lib/db'
import { Banner } from '@/components/banner'
import { Actions } from './_components/actions'
import { IconBadge } from '@/components/icon-badge'
import { TitleForm } from './_components/title-form'
import { ImageForm } from './_components/image-form'
import { PriceForm } from './_components/price-form'
import { CategoryForm } from './_components/category-form'
import { ChaptersForm } from './_components/chapters-form'
import { AttachmentForm } from './_components/attachment-form'
import { DescriptionForm } from './_components/description-form'

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string
  }
}) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      userId,
      id: params.courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  if (!course || course.userId !== userId) {
    return redirect('/')
  }

  const requiredFields = [
    course.title,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.description,
    course.chapters.some(chapter => chapter.isPublished),
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  const isCompleted = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is unpublished. It will not be visible in the students."
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>

            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>

          <Actions
            courseId={course.id}
            disabled={!isCompleted}
            isPublished={course.isPublished}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>

            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map(category => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />

                <h2 className="text-xl">Course chapters</h2>
              </div>

              <ChaptersForm initialData={course} courseId={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />

                <h2 className="text-xl">Sell your course</h2>
              </div>

              <PriceForm courseId={course.id} initialData={course} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />

                <h2 className="text-xl">Resources & Attachments</h2>
              </div>

              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage
