'use client'

import { Plus } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from './rich-text-editor'
import { SortableEntryCard } from './sortable-entry-card'
import type { ResumeWork } from '../types/resume'
import { useListField } from '../hooks/use-list-field'

/* ── WorkForm ── */
export type WorkFormProps = {
  data: ResumeWork[]
  onChange: (data: ResumeWork[]) => void
}

const emptyWork: ResumeWork = {
  name: '',
  position: '',
  url: '',
  startDate: '',
  endDate: '',
  summary: '',
  location: '',
}

export function WorkForm({ data, onChange }: WorkFormProps) {
  const { updateEntry, addEntry, removeEntry, reorderEntry, entryIds } = useListField(data, onChange, emptyWork)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = entryIds.indexOf(String(active.id))
    const to = entryIds.indexOf(String(over.id))
    if (from === -1 || to === -1) return
    reorderEntry(from, to)
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={entryIds} strategy={verticalListSortingStrategy}>
          {data.map((entry, index) => (
            <SortableEntryCard
              key={entryIds[index]}
              id={entryIds[index]}
              label={[entry.position, entry.name].filter(Boolean).join(' @ ')}
              fallback={`Work Entry ${index + 1}`}
              onRemove={() => removeEntry(index)}
            >
              {/* Company + Position */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Company</Label>
                  <Input
                    value={entry.name}
                    onChange={(e) => updateEntry(index, { name: e.target.value })}
                    placeholder="Company Inc."
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Position</Label>
                  <Input
                    value={entry.position}
                    onChange={(e) => updateEntry(index, { position: e.target.value })}
                    placeholder="Software Engineer"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Location + URL */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <Input
                    value={entry.location}
                    onChange={(e) => updateEntry(index, { location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <Input
                    type="url"
                    value={entry.url}
                    onChange={(e) => updateEntry(index, { url: e.target.value })}
                    placeholder="https://company.com"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Start + End Date */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input
                    value={entry.startDate}
                    onChange={(e) => updateEntry(index, { startDate: e.target.value })}
                    placeholder="2022-01"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input
                    value={entry.endDate}
                    onChange={(e) => updateEntry(index, { endDate: e.target.value })}
                    placeholder="Present"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Description (WYSIWYG) */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <RichTextEditor
                  value={entry.summary}
                  onChange={(html) => updateEntry(index, { summary: html })}
                  placeholder="Describe your role, achievements, and impact..."
                />
              </div>
            </SortableEntryCard>
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addEntry}
        className="w-full h-8 text-xs"
      >
        <Plus className="size-3.5 mr-1" />
        Add Work Experience
      </Button>
    </div>
  )
}
