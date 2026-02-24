'use client'

import { useCallback, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { ResumeEducation } from '../types/resume'

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
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumeEducation>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyEducation }])
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
            title="Remove entry"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="text-[11px] font-medium text-muted-foreground mb-1">
            Entry {index + 1}
          </div>

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
        Add Education
      </Button>
    </div>
  )
}
