import axios from 'axios'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'

const CoursesPage = async () => {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage
