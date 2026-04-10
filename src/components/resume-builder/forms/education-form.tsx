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
import { SortableEntryCard } from './sortable-entry-card'
import type { ResumeEducation } from '../types/resume'
import { TagInput } from './tag-input'
import { useListField } from '../hooks/use-list-field'

/* ── EducationForm ── */
export type EducationFormProps = {
  data: ResumeEducation[]
  onChange: (data: ResumeEducation[]) => void
}

const emptyEducation: ResumeEducation = {
  institution: '',
  area: '',
  studyType: '',
  startDate: '',
  endDate: '',
  score: '',
  url: '',
  courses: [],
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const { updateEntry, addEntry, removeEntry, reorderEntry, entryIds } = useListField(data, onChange, emptyEducation)

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
              label={[entry.studyType, entry.area, entry.institution].filter(Boolean).join(' · ')}
              fallback={`Education Entry ${index + 1}`}
              onRemove={() => removeEntry(index)}
            >
              {/* Institution */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Institution</Label>
                <Input
                  value={entry.institution}
                  onChange={(e) => updateEntry(index, { institution: e.target.value })}
                  placeholder="University of California"
                  className="h-8 text-sm"
                />
              </div>

              {/* Area + Study Type */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Area / Field</Label>
                  <Input
                    value={entry.area}
                    onChange={(e) => updateEntry(index, { area: e.target.value })}
                    placeholder="Computer Science"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Degree Type</Label>
                  <Input
                    value={entry.studyType}
                    onChange={(e) => updateEntry(index, { studyType: e.target.value })}
                    placeholder="B.S., M.S., Ph.D."
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
                    placeholder="2015-08"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input
                    value={entry.endDate}
                    onChange={(e) => updateEntry(index, { endDate: e.target.value })}
                    placeholder="2019-05"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Score + URL */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Score / GPA</Label>
                  <Input
                    value={entry.score}
                    onChange={(e) => updateEntry(index, { score: e.target.value })}
                    placeholder="3.8 / 4.0"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <Input
                    type="url"
                    value={entry.url}
                    onChange={(e) => updateEntry(index, { url: e.target.value })}
                    placeholder="https://university.edu"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Courses */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Courses</Label>
                <TagInput
                  tags={entry.courses}
                  onTagsChange={(courses) => updateEntry(index, { courses })}
                  placeholder="Type course name and press Enter..."
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
        Add Education
      </Button>
    </div>
  )
}
