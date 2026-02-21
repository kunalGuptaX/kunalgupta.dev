'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { useState, type ReactNode } from 'react'
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Star,
  Plus,
  Trash2,
  ChevronRight,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { ResumeData } from './types'

// ─── Shared helpers ──────────────────────────────────────────

function Field({
  label,
  name,
  placeholder,
  textarea,
}: {
  label: string
  name: string
  placeholder?: string
  textarea?: boolean
}) {
  const { register } = useFormContext<ResumeData>()
  const Comp = textarea ? Textarea : Input
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Comp id={name} placeholder={placeholder} {...(register as any)(name)} />
    </div>
  )
}

// ─── Accordion section wrapper ───────────────────────────────

function Section({
  id,
  icon,
  title,
  count,
  countLabel,
  isOpen,
  onToggle,
  children,
}: {
  id: string
  icon: ReactNode
  title: string
  count?: number
  countLabel?: string
  isOpen: boolean
  onToggle: (id: string) => void
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50"
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium flex-1">{title}</span>
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="text-[11px] px-2 py-0">
            {count} {countLabel ?? (count === 1 ? 'item' : 'items')}
          </Badge>
        )}
        <ChevronRight
          className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-4 py-4 space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashed add button ───────────────────────────────────────

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-accent/30"
    >
      <Plus className="size-4" />
      {label}
    </button>
  )
}

// ─── Tag list (skills / strengths) ───────────────────────────

function TagList({
  fieldName,
  placeholder,
}: {
  fieldName: 'skills' | 'strengths'
  placeholder: string
}) {
  const { watch, setValue } = useFormContext<ResumeData>()
  const [input, setInput] = useState('')
  const items = watch(fieldName) || []

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setValue(fieldName, [...items, trimmed])
    setInput('')
  }

  const remove = (index: number) => {
    setValue(
      fieldName,
      items.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() => remove(index)}
              className="ml-1 text-muted-foreground hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Bullet list for experience ──────────────────────────────

function BulletList({ experienceIndex }: { experienceIndex: number }) {
  const { watch, setValue } = useFormContext<ResumeData>()
  const bullets = watch(`experience.${experienceIndex}.bullets`) || []

  const addBullet = () => {
    setValue(`experience.${experienceIndex}.bullets`, [...bullets, ''])
  }

  const removeBullet = (bulletIndex: number) => {
    setValue(
      `experience.${experienceIndex}.bullets`,
      bullets.filter((_, i) => i !== bulletIndex),
    )
  }

  const updateBullet = (bulletIndex: number, value: string) => {
    const updated = [...bullets]
    updated[bulletIndex] = value
    setValue(`experience.${experienceIndex}.bullets`, updated)
  }

  return (
    <div className="space-y-2">
      <Label>Bullet Points</Label>
      {bullets.map((bullet, bulletIndex) => (
        <div key={bulletIndex} className="flex gap-2">
          <Input
            value={bullet}
            onChange={(e) => updateBullet(bulletIndex, e.target.value)}
            placeholder="Describe an achievement or responsibility..."
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeBullet(bulletIndex)}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={addBullet}>
        <Plus className="size-4" />
        Add Bullet
      </Button>
    </div>
  )
}

// ─── Project tech stack ──────────────────────────────────────

function ProjectTechStack({ projectIndex }: { projectIndex: number }) {
  const { watch, setValue } = useFormContext<ResumeData>()
  const [input, setInput] = useState('')
  const techStack = watch(`projects.${projectIndex}.techStack`) || []

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setValue(`projects.${projectIndex}.techStack`, [...techStack, trimmed])
    setInput('')
  }

  const remove = (index: number) => {
    setValue(
      `projects.${projectIndex}.techStack`,
      techStack.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-2">
      <Label>Tech Stack</Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add technology..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {techStack.map((tech, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded border border-border bg-secondary px-2 py-0.5 text-xs"
          >
            {tech}
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Experience section content ──────────────────────────────

function ExperienceContent() {
  const { register, control, watch } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'experience' })
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const watchedExperience = watch('experience')

  return (
    <div className="space-y-3">
      {fields.map((field, index) => {
        const isExpanded = expandedItem === index
        const current = watchedExperience?.[index]
        const role = current?.role || ''
        const company = current?.company || ''
        const startDate = current?.startDate || ''
        const endDate = current?.endDate || ''
        return (
          <div key={field.id} className="rounded-lg border border-border overflow-hidden">
            <div
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => setExpandedItem(isExpanded ? null : index)}
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                  onClick={(e) => { e.stopPropagation(); move(index, index - 1); setExpandedItem(index - 1) }}
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                  onClick={(e) => { e.stopPropagation(); move(index, index + 1); setExpandedItem(index + 1) }}
                >
                  <ArrowDown className="size-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {role || company
                    ? `${role || 'Untitled Role'}${company ? ` at ${company}` : ''}`
                    : `Experience ${index + 1}`}
                </p>
                {(startDate || endDate) && (
                  <p className="text-xs text-muted-foreground truncate">
                    {startDate}{startDate && endDate ? ' – ' : ''}{endDate}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 size-7 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  remove(index)
                  if (expandedItem === index) setExpandedItem(null)
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
              <ChevronRight
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </div>

            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border px-3 py-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Role</Label>
                      <Input {...register(`experience.${index}.role`)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Company</Label>
                      <Input {...register(`experience.${index}.company`)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Start Date</Label>
                      <Input placeholder="Jan 2022" {...register(`experience.${index}.startDate`)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>End Date</Label>
                      <Input placeholder="Present" {...register(`experience.${index}.endDate`)} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label>Location</Label>
                      <Input {...register(`experience.${index}.location`)} />
                    </div>
                  </div>
                  <BulletList experienceIndex={index} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <AddButton
        label="Add Experience"
        onClick={() => {
          append({ role: '', company: '', startDate: '', endDate: '', location: '', bullets: [''] })
          setExpandedItem(fields.length)
        }}
      />
    </div>
  )
}

// ─── Education section content ───────────────────────────────

function EducationContent() {
  const { register, control, watch } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'education' })
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const watchedEducation = watch('education')

  return (
    <div className="space-y-3">
      {fields.map((field, index) => {
        const isExpanded = expandedItem === index
        const current = watchedEducation?.[index]
        const degree = current?.degree || ''
        const school = current?.school || ''
        return (
          <div key={field.id} className="rounded-lg border border-border overflow-hidden">
            <div
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => setExpandedItem(isExpanded ? null : index)}
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                  onClick={(e) => { e.stopPropagation(); move(index, index - 1); setExpandedItem(index - 1) }}
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                  onClick={(e) => { e.stopPropagation(); move(index, index + 1); setExpandedItem(index + 1) }}
                >
                  <ArrowDown className="size-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {degree || `Education ${index + 1}`}
                </p>
                {school && (
                  <p className="text-xs text-muted-foreground truncate">{school}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 size-7 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  remove(index)
                  if (expandedItem === index) setExpandedItem(null)
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
              <ChevronRight
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </div>

            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border px-3 py-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label>Degree</Label>
                      <Input {...register(`education.${index}.degree`)} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label>School</Label>
                      <Input {...register(`education.${index}.school`)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Start Date</Label>
                      <Input placeholder="Aug 2015" {...register(`education.${index}.startDate`)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>End Date</Label>
                      <Input placeholder="May 2019" {...register(`education.${index}.endDate`)} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label>Location</Label>
                      <Input {...register(`education.${index}.location`)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <AddButton
        label="Add Education"
        onClick={() => {
          append({ degree: '', school: '', startDate: '', endDate: '', location: '' })
          setExpandedItem(fields.length)
        }}
      />
    </div>
  )
}

// ─── Projects section content ────────────────────────────────

function ProjectsContent() {
  const { register, control, watch } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'projects' })
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const watchedProjects = watch('projects')

  return (
    <div className="space-y-3">
      {fields.map((field, index) => {
        const isExpanded = expandedItem === index
        const projectName = watchedProjects?.[index]?.name || ''
        return (
          <div key={field.id} className="rounded-lg border border-border overflow-hidden">
            <div
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => setExpandedItem(isExpanded ? null : index)}
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                  onClick={(e) => { e.stopPropagation(); move(index, index - 1); setExpandedItem(index - 1) }}
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                  onClick={(e) => { e.stopPropagation(); move(index, index + 1); setExpandedItem(index + 1) }}
                >
                  <ArrowDown className="size-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {projectName || `Project ${index + 1}`}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 size-7 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  remove(index)
                  if (expandedItem === index) setExpandedItem(null)
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
              <ChevronRight
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </div>

            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border px-3 py-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label>Name</Label>
                      <Input {...register(`projects.${index}.name`)} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label>Description</Label>
                      <Textarea {...register(`projects.${index}.description`)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Live URL</Label>
                      <Input placeholder="https://..." {...register(`projects.${index}.liveUrl`)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Source URL</Label>
                      <Input placeholder="https://..." {...register(`projects.${index}.sourceUrl`)} />
                    </div>
                  </div>
                  <ProjectTechStack projectIndex={index} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <AddButton
        label="Add Project"
        onClick={() => {
          append({ name: '', description: '', techStack: [], liveUrl: '', sourceUrl: '' })
          setExpandedItem(fields.length)
        }}
      />
    </div>
  )
}

// ─── Main form ───────────────────────────────────────────────

export function ResumeForm() {
  const [openSection, setOpenSection] = useState<string | null>('personal')
  const { watch } = useFormContext<ResumeData>()

  const toggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id))
  }

  const experience = watch('experience') || []
  const education = watch('education') || []
  const skills = watch('skills') || []
  const projects = watch('projects') || []
  const strengths = watch('strengths') || []

  return (
    <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
      {/* Personal Info (merged with socials) */}
      <Section
        id="personal"
        icon={<User className="size-4" />}
        title="Personal Info"
        isOpen={openSection === 'personal'}
        onToggle={toggle}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name" name="name" />
          <Field label="Title" name="title" />
          <Field label="Email" name="email" />
          <Field label="Phone" name="phone" placeholder="+1 (555) 000-0000" />
          <div className="col-span-2">
            <Field label="Location" name="location" placeholder="City, State" />
          </div>
          <Field label="LinkedIn" name="linkedin" placeholder="https://linkedin.com/in/..." />
          <Field label="GitHub" name="github" placeholder="https://github.com/..." />
        </div>
      </Section>

      {/* Summary */}
      <Section
        id="summary"
        icon={<FileText className="size-4" />}
        title="Summary"
        isOpen={openSection === 'summary'}
        onToggle={toggle}
      >
        <Field label="Professional Summary" name="summary" textarea />
      </Section>

      {/* Experience */}
      <Section
        id="experience"
        icon={<Briefcase className="size-4" />}
        title="Experience"
        count={experience.length}
        isOpen={openSection === 'experience'}
        onToggle={toggle}
      >
        <ExperienceContent />
      </Section>

      {/* Education */}
      <Section
        id="education"
        icon={<GraduationCap className="size-4" />}
        title="Education"
        count={education.length}
        isOpen={openSection === 'education'}
        onToggle={toggle}
      >
        <EducationContent />
      </Section>

      {/* Skills */}
      <Section
        id="skills"
        icon={<Code className="size-4" />}
        title="Skills"
        count={skills.length}
        countLabel={skills.length === 1 ? 'skill' : 'skills'}
        isOpen={openSection === 'skills'}
        onToggle={toggle}
      >
        <TagList fieldName="skills" placeholder="Add a skill..." />
      </Section>

      {/* Projects */}
      <Section
        id="projects"
        icon={<FolderOpen className="size-4" />}
        title="Projects"
        count={projects.length}
        isOpen={openSection === 'projects'}
        onToggle={toggle}
      >
        <ProjectsContent />
      </Section>

      {/* Strengths */}
      <Section
        id="strengths"
        icon={<Star className="size-4" />}
        title="Strengths"
        count={strengths.length}
        isOpen={openSection === 'strengths'}
        onToggle={toggle}
      >
        <TagList fieldName="strengths" placeholder="Add a strength..." />
      </Section>
    </form>
  )
}
