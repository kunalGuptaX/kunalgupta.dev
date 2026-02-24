'use client'

import { useCallback, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from './rich-text-editor'
import type {
  ResumeCertificate,
  ResumeAward,
  ResumeVolunteer,
  ResumePublication,
  ResumeInterest,
  ResumeReference,
} from '../types/resume'

/* ── Shared Tag Input ── */
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

/* ═══════════════════════════════════════════════
   CertificatesForm
   ═══════════════════════════════════════════════ */

export type CertificatesFormProps = {
  data: ResumeCertificate[]
  onChange: (data: ResumeCertificate[]) => void
}

const emptyCertificate: ResumeCertificate = {
  name: '',
  date: '',
  issuer: '',
  url: '',
}

export function CertificatesForm({ data, onChange }: CertificatesFormProps) {
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumeCertificate>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyCertificate }])
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
            title="Remove certificate"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Certificate Name</Label>
            <Input
              value={entry.name}
              onChange={(e) => updateEntry(index, { name: e.target.value })}
              placeholder="AWS Solutions Architect"
              className="h-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                value={entry.date}
                onChange={(e) => updateEntry(index, { date: e.target.value })}
                placeholder="2023-06"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Issuer</Label>
              <Input
                value={entry.issuer}
                onChange={(e) => updateEntry(index, { issuer: e.target.value })}
                placeholder="Amazon Web Services"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">URL</Label>
            <Input
              type="url"
              value={entry.url}
              onChange={(e) => updateEntry(index, { url: e.target.value })}
              placeholder="https://credential.net/..."
              className="h-8 text-sm"
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
        Add Certificate
      </Button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   AwardsForm
   ═══════════════════════════════════════════════ */

export type AwardsFormProps = {
  data: ResumeAward[]
  onChange: (data: ResumeAward[]) => void
}

const emptyAward: ResumeAward = {
  title: '',
  date: '',
  awarder: '',
  summary: '',
}

export function AwardsForm({ data, onChange }: AwardsFormProps) {
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumeAward>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyAward }])
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
            title="Remove award"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={entry.title}
              onChange={(e) => updateEntry(index, { title: e.target.value })}
              placeholder="Best Paper Award"
              className="h-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                value={entry.date}
                onChange={(e) => updateEntry(index, { date: e.target.value })}
                placeholder="2023-09"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Awarder</Label>
              <Input
                value={entry.awarder}
                onChange={(e) => updateEntry(index, { awarder: e.target.value })}
                placeholder="IEEE, Google..."
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Summary</Label>
            <RichTextEditor
              value={entry.summary}
              onChange={(html) => updateEntry(index, { summary: html })}
              placeholder="Brief description..."
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
        Add Award
      </Button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   VolunteerForm
   ═══════════════════════════════════════════════ */

export type VolunteerFormProps = {
  data: ResumeVolunteer[]
  onChange: (data: ResumeVolunteer[]) => void
}

const emptyVolunteer: ResumeVolunteer = {
  organization: '',
  position: '',
  url: '',
  startDate: '',
  endDate: '',
  summary: '',
}

export function VolunteerForm({ data, onChange }: VolunteerFormProps) {
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumeVolunteer>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyVolunteer }])
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

          {/* Organization + Position */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Organization</Label>
              <Input
                value={entry.organization}
                onChange={(e) => updateEntry(index, { organization: e.target.value })}
                placeholder="Habitat for Humanity"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Position</Label>
              <Input
                value={entry.position}
                onChange={(e) => updateEntry(index, { position: e.target.value })}
                placeholder="Volunteer Coordinator"
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">URL</Label>
            <Input
              type="url"
              value={entry.url}
              onChange={(e) => updateEntry(index, { url: e.target.value })}
              placeholder="https://organization.org"
              className="h-8 text-sm"
            />
          </div>

          {/* Start + End Date */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Start Date</Label>
              <Input
                value={entry.startDate}
                onChange={(e) => updateEntry(index, { startDate: e.target.value })}
                placeholder="2020-01"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">End Date</Label>
              <Input
                value={entry.endDate}
                onChange={(e) => updateEntry(index, { endDate: e.target.value })}
                placeholder="2021-12"
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
              placeholder="Describe your volunteer work..."
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
        Add Volunteer Experience
      </Button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   PublicationsForm
   ═══════════════════════════════════════════════ */

export type PublicationsFormProps = {
  data: ResumePublication[]
  onChange: (data: ResumePublication[]) => void
}

const emptyPublication: ResumePublication = {
  name: '',
  publisher: '',
  releaseDate: '',
  url: '',
  summary: '',
}

export function PublicationsForm({ data, onChange }: PublicationsFormProps) {
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumePublication>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyPublication }])
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
            title="Remove publication"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Publication Name</Label>
            <Input
              value={entry.name}
              onChange={(e) => updateEntry(index, { name: e.target.value })}
              placeholder="Paper or article title"
              className="h-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Publisher</Label>
              <Input
                value={entry.publisher}
                onChange={(e) => updateEntry(index, { publisher: e.target.value })}
                placeholder="IEEE, ACM..."
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Release Date</Label>
              <Input
                value={entry.releaseDate}
                onChange={(e) => updateEntry(index, { releaseDate: e.target.value })}
                placeholder="2023-03"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">URL</Label>
            <Input
              type="url"
              value={entry.url}
              onChange={(e) => updateEntry(index, { url: e.target.value })}
              placeholder="https://doi.org/..."
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Summary</Label>
            <RichTextEditor
              value={entry.summary}
              onChange={(html) => updateEntry(index, { summary: html })}
              placeholder="Brief description of the publication..."
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
        Add Publication
      </Button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   InterestsForm
   ═══════════════════════════════════════════════ */

export type InterestsFormProps = {
  data: ResumeInterest[]
  onChange: (data: ResumeInterest[]) => void
}

const emptyInterest: ResumeInterest = {
  name: '',
  keywords: [],
}

export function InterestsForm({ data, onChange }: InterestsFormProps) {
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumeInterest>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyInterest }])
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
            title="Remove interest"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Interest Name</Label>
            <Input
              value={entry.name}
              onChange={(e) => updateEntry(index, { name: e.target.value })}
              placeholder="Open Source, Photography..."
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Keywords</Label>
            <TagInput
              tags={entry.keywords}
              onTagsChange={(keywords) => updateEntry(index, { keywords })}
              placeholder="Related topics..."
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
        Add Interest
      </Button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   ReferencesForm
   ═══════════════════════════════════════════════ */

export type ReferencesFormProps = {
  data: ResumeReference[]
  onChange: (data: ResumeReference[]) => void
}

const emptyReference: ResumeReference = {
  name: '',
  reference: '',
}

export function ReferencesForm({ data, onChange }: ReferencesFormProps) {
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumeReference>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyReference }])
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
            title="Remove reference"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={entry.name}
              onChange={(e) => updateEntry(index, { name: e.target.value })}
              placeholder="Jane Smith, CTO at TechCorp"
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Reference Text</Label>
            <RichTextEditor
              value={entry.reference}
              onChange={(html) => updateEntry(index, { reference: html })}
              placeholder="Reference or testimonial text..."
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
        Add Reference
      </Button>
    </div>
  )
}
