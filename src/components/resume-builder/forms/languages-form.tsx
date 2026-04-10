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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SortableEntryCard } from './sortable-entry-card'
import type { ResumeLanguage } from '../types/resume'
import { useListField } from '../hooks/use-list-field'

const FLUENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Beginner']

/* ── LanguagesForm ── */
export type LanguagesFormProps = {
  data: ResumeLanguage[]
  onChange: (data: ResumeLanguage[]) => void
}

const emptyLanguage: ResumeLanguage = {
  language: '',
  fluency: '',
}

export function LanguagesForm({ data, onChange }: LanguagesFormProps) {
  const { updateEntry, addEntry, removeEntry, reorderEntry, entryIds } = useListField(data, onChange, emptyLanguage)

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
              label={[entry.language, entry.fluency].filter(Boolean).join(' · ')}
              fallback={`Language ${index + 1}`}
              onRemove={() => removeEntry(index)}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Language</Label>
                  <Input
                    value={entry.language}
                    onChange={(e) => updateEntry(index, { language: e.target.value })}
                    placeholder="English, Spanish..."
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Fluency</Label>
                  <Select
                    value={entry.fluency}
                    onValueChange={(fluency) => updateEntry(index, { fluency })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {FLUENCY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
        Add Language
      </Button>
    </div>
  )
}
