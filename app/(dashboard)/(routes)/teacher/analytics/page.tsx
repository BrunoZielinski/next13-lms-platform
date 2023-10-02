import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { Chart } from './_components/chart'
import { DataCard } from './_components/data-card'
import { getAnalytics } from '@/actions/get-analytics'

const AnalyticsPage = async () => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const { totalRevenue, data, totalSales } = await getAnalytics(userId)

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <DataCard shouldFormat value={totalRevenue} label="Total Sales" />
        <DataCard value={totalSales} label="Total Sales" />
      </div>

      <Chart data={data} />
    </div>
  )
}

export default AnalyticsPage
