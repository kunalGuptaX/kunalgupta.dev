'use client'

import { Plus, Trash2 } from 'lucide-react'
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
import { TagInput } from './tag-input'
import { useListField } from '../hooks/use-list-field'

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
  const { updateEntry, addEntry, removeEntry } = useListField(data, onChange, emptyCertificate)

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
  const { updateEntry, addEntry, removeEntry } = useListField(data, onChange, emptyAward)

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
  const { updateEntry, addEntry, removeEntry } = useListField(data, onChange, emptyVolunteer)

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
  const { updateEntry, addEntry, removeEntry } = useListField(data, onChange, emptyPublication)

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
  const { updateEntry, addEntry, removeEntry } = useListField(data, onChange, emptyInterest)

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
  const { updateEntry, addEntry, removeEntry } = useListField(data, onChange, emptyReference)

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
