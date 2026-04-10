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
import type { ResumeProject } from '../types/resume'
import { TagInput } from './tag-input'
import { useListField } from '../hooks/use-list-field'

/* ── ProjectsForm ── */
export type ProjectsFormProps = {
  data: ResumeProject[]
  onChange: (data: ResumeProject[]) => void
}

const emptyProject: ResumeProject = {
  name: '',
  description: '',
  keywords: [],
  startDate: '',
  endDate: '',
  url: '',
  roles: [],
  entity: '',
  type: '',
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const { updateEntry, addEntry, removeEntry, reorderEntry, entryIds } = useListField(data, onChange, emptyProject)

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
              label={entry.name}
              fallback={`Project ${index + 1}`}
              onRemove={() => removeEntry(index)}
            >
              {/* Name + URL */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    value={entry.name}
                    onChange={(e) => updateEntry(index, { name: e.target.value })}
                    placeholder="Project Name"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <Input
                    type="url"
                    value={entry.url}
                    onChange={(e) => updateEntry(index, { url: e.target.value })}
                    placeholder="https://project.com"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Description (WYSIWYG) */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <RichTextEditor
                  value={entry.description}
                  onChange={(html) => updateEntry(index, { description: html })}
                  placeholder="What does the project do?"
                />
              </div>

              {/* Start + End Date */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input
                    value={entry.startDate}
                    onChange={(e) => updateEntry(index, { startDate: e.target.value })}
                    placeholder="2023-01"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input
                    value={entry.endDate}
                    onChange={(e) => updateEntry(index, { endDate: e.target.value })}
                    placeholder="2023-06"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Keywords / Tech Stack</Label>
                <TagInput
                  tags={entry.keywords}
                  onTagsChange={(keywords) => updateEntry(index, { keywords })}
                  placeholder="React, Node.js, PostgreSQL..."
                />
              </div>

              {/* Roles */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Roles</Label>
                <TagInput
                  tags={entry.roles}
                  onTagsChange={(roles) => updateEntry(index, { roles })}
                  placeholder="Lead Developer, Designer..."
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
        Add Project
      </Button>
    </div>
  )
}
