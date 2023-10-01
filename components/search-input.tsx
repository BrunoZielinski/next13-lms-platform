'use client'

import qs from 'query-string'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

export const SearchInput = () => {
  const [value, setValue] = useState('')
  const [firstRender, setFirstRender] = useState(true)

  const debounceValue = useDebounce(value, 500)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get('categoryId')

  useEffect(() => {
    if (firstRender) {
      const title = searchParams.get('title')

      setValue(title || '')
      setFirstRender(false)
    }
  }, [firstRender, searchParams])

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debounceValue,
          categoryId: currentCategoryId,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    )

    router.push(url)
  }, [currentCategoryId, debounceValue, pathname, router])

  return (
    <div className="relative">
      <Search className="absolute w-4 h-4 top-3 left-3 text-slate-600" />

      <Input
        value={value}
        type="search"
        placeholder="Search for a course"
        onChange={e => setValue(e.target.value)}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
      />
    </div>
  )
}
