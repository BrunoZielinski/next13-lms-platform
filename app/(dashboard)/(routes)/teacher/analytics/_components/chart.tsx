'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { Card } from '@/components/ui/card'

interface ChartProps {
  data: {
    name: string
    total: number
  }[]
}

export const Chart = ({ data }: ChartProps) => {
  return (
    <Card>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            fontSize={12}
            dataKey="name"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            stroke="#888888"
            tickFormatter={value => `$${value}`}
          />

          <Bar fill="#0369a1" dataKey="total" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
