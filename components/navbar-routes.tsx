'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

import { SearchInput } from './search-input'
import { Button } from '@/components/ui/button'

export const NavbarRoutes = () => {
  const pathname = usePathname()

  const isSearchPage = pathname === '/search'
  const isPlayerPage = pathname?.includes('/chapter')
  const isTeacherPage = pathname?.startsWith('/teacher')

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex ml-auto gap-x-2">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Exit</span>
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        )}

        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  )
}
