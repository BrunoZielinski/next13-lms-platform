import { LucideIcon } from 'lucide-react'

import { IconBadge } from '@/components/icon-badge'

interface InfoCardProps {
  label: string
  icon: LucideIcon
  numberOfItems: number
  variant?: 'default' | 'success'
}

export const InfoCard = ({
  label,
  variant,
  icon: Icon,
  numberOfItems,
}: InfoCardProps) => {
  return (
    <div className="flex items-center p-3 border rounded-md gap-x-2">
      <IconBadge icon={Icon} variant={variant} />

      <div>
        <p className="font-medium">{label}</p>

        <p className="text-sm text-gray-500">
          {numberOfItems} {numberOfItems === 1 ? 'Course' : 'Courses'}
        </p>
      </div>
    </div>
  )
}
