'use client'

import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

interface SidebarItemProps {
  href: string
  label: string
  icon: LucideIcon
}

export const SidebarItem = ({ icon: Icon, href, label }: SidebarItemProps) => {
  const path = usePathname()
  const router = useRouter()

  const isActive =
    (path === '/' && href === '/') ||
    path === href ||
    path?.startsWith(`${href}/`)

  const onClick = () => {
    router.push(href)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive &&
          'text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700',
      )}
    >
      <div className="flex items-center py-4 gap-x-2">
        <Icon
          size={20}
          className={cn('text-slate-500', isActive && 'text-sky-700')}
        />

        <span>{label}</span>
      </div>

      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-sky-700 h-full transition-all',
          isActive && 'opacity-100',
        )}
      />
    </button>
  )
}
