'use client'

import 'react-quill/dist/quill.snow.css'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export const Editor = ({ value, onChange }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    [],
  )

  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  )
}
