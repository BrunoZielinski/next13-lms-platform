import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface CourseProgressProps {
  value: number
  size?: 'default' | 'sm'
  variant?: 'default' | 'success'
}

const colorByVariant = {
  default: 'text-sky-700',
  success: 'text-emerald-500',
}

const sizeByVariant = {
  default: 'text-sm',
  sm: 'text-xs',
}

export const CourseProgress = async ({
  size,
  value,
  variant,
}: CourseProgressProps) => {
  return (
    <div>
      <Progress value={value} className="h-2" variant={variant} />

      <p
        className={cn(
          'font-medium mt-2 text-sky-700',
          colorByVariant[variant || 'default'],
          sizeByVariant[size || 'default'],
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  )
}
