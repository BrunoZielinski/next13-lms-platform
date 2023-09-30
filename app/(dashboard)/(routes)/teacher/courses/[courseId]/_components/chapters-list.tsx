'use client'

import { Grip, Pencil } from 'lucide-react'
import { Chapter } from '@prisma/client'
import { useEffect, useState } from 'react'
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from '@hello-pangea/dnd'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface ChaptersListProps {
  items: Chapter[]
  onEdit: (id: string) => void
  onReorder: (updateData: { id: string; position: number }[]) => void
}

export const ChaptersList = ({
  items,
  onEdit,
  onReorder,
}: ChaptersListProps) => {
  const [chapters, setChapters] = useState(items)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setChapters(items)
  }, [items])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)

    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1)

    setChapters(items)

    const bulkUpdateData = updatedChapters.map(chapter => ({
      id: chapter.id,
      position: items.findIndex(item => item.id === chapter.id),
    }))

    onReorder(bulkUpdateData)
  }

  if (!isMounted) {
    return null
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                index={index}
                key={chapter.id}
                draggableId={chapter.id}
              >
                {provided => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                      chapter.isPublished &&
                        'bg-sky-100 border-sky-200 text-sky-700',
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-slate-200 hover:bg-slate-300 rounded-l-md transition',
                        chapter.isPublished &&
                          'border-r-sky-200 hover:bg-sky-200',
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="w-5 h-5" />
                    </div>

                    <span>{chapter.title}</span>

                    <div className="flex items-center pr-2 ml-auto gap-x-2">
                      {chapter.isFree && <Badge>Free</Badge>}

                      <Badge
                        className={cn(
                          'bg-slate-500',
                          chapter.isPublished && 'bg-sky-700',
                        )}
                      >
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>

                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className="w-4 h-4 transition cursor-pointer hover:opacity-75"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
