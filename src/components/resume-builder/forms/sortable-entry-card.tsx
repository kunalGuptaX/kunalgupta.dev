'use client'

import { useState } from 'react'
import { ChevronDown, GripVertical, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export type SortableEntryCardProps = {
  /** Unique id within the sortable context (use String(index)) */
  id: string
  /** Text shown in the collapsed header — the entry's primary field value */
  label: string
  /** Fallback label when label is empty, e.g. "Entry 1" */
  fallback: string
  onRemove: () => void
  children: React.ReactNode
  /** New entries start expanded; existing entries start collapsed to reduce noise */
  defaultCollapsed?: boolean
}

export function SortableEntryCard({
  id,
  label,
  fallback,
  onRemove,
  children,
  defaultCollapsed = false,
}: SortableEntryCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  const displayLabel = label.trim() || fallback

  return (
    <div ref={setNodeRef} style={style} className="rounded-md border border-border bg-background">
      {/* Card header — always visible */}
      <div className="flex items-center gap-1 px-2 py-1.5">
        {/* Drag handle */}
        <button
          type="button"
          className="shrink-0 cursor-grab active:cursor-grabbing touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          {...attributes}
          {...listeners}
          tabIndex={-1}
        >
          <GripVertical className="size-3.5" />
        </button>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left py-0.5"
        >
          <ChevronDown
            className={`size-3.5 text-muted-foreground shrink-0 transition-transform duration-150 ${
              collapsed ? '-rotate-90' : ''
            }`}
          />
          <span className="text-[11px] font-medium text-muted-foreground truncate">
            {displayLabel}
          </span>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 p-1 rounded-md text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          title="Remove entry"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {/* Collapsible body */}
      {!collapsed && <div className="px-3 pb-3 pt-1 space-y-2 border-t border-border/50">{children}</div>}
    </div>
  )
}
