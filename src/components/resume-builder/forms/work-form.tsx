'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from './rich-text-editor'
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
  const { updateEntry, addEntry, removeEntry } = useListField(data, onChange, emptyWork)

  return (
    <div className="space-y-3">
      {data.map((entry, index) => (
        <div key={index} className="relative rounded-md border border-border p-3 space-y-2">
          {/* Remove button */}
          <button
            type="button"
            onClick={() => removeEntry(index)}
            className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Remove entry"
          >
            <Trash2 className="size-3.5" />
          </button>

          {/* Entry number badge */}
          <div className="text-[11px] font-medium text-muted-foreground mb-1">
            Entry {index + 1}
          </div>

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
        </div>
      ))}

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
