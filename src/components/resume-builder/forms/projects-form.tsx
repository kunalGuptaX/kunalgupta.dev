'use client'

import { useCallback, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from './rich-text-editor'
import type { ResumeProject } from '../types/resume'

/* ── Tag Input ── */
function TagInput({
  tags,
  onTagsChange,
  placeholder = 'Type and press Enter...',
}: {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
}) {
  const [inputValue, setInputValue] = useState('')

  const addTag = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed])
    }
    setInputValue('')
  }

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 min-h-[32px] rounded-md border border-border bg-transparent px-2 py-1.5 text-sm focus-within:ring-1 focus-within:ring-ring">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="ml-0.5 hover:text-red-400 transition-colors"
          >
            <X className="size-2.5" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
      />
    </div>
  )
}

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
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumeProject>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyProject }])
  }, [data, onChange])

  const removeEntry = useCallback(
    (index: number) => {
      onChange(data.filter((_, i) => i !== index))
    },
    [data, onChange],
  )

  return (
    <div className="space-y-3">
      {data.map((entry, index) => (
        <div key={index} className="relative rounded-md border border-border p-3 space-y-2">
          <button
            type="button"
            onClick={() => removeEntry(index)}
            className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Remove project"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="text-[11px] font-medium text-muted-foreground mb-1">
            Project {index + 1}
          </div>

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
        Add Project
      </Button>
    </div>
  )
}
