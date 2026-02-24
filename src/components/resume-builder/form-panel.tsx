'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  ChevronsUpDown,
  ChevronsDownUp,
  Pencil,
  Check,
  X,
  Lightbulb,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ResumeDataV2, SectionId } from './types/resume'
import { computeInitialPreferences } from './config/compute-preferences'
import { BasicsForm } from './forms/basics-form'
import { WorkForm } from './forms/work-form'
import { EducationForm } from './forms/education-form'
import { SkillsForm } from './forms/skills-form'
import { ProjectsForm } from './forms/projects-form'
import { LanguagesForm } from './forms/languages-form'
import {
  CertificatesForm,
  AwardsForm,
  VolunteerForm,
  PublicationsForm,
  InterestsForm,
  ReferencesForm,
} from './forms/simple-section-forms'

/* ── Section labels ── */
const SECTION_LABELS: Record<string, string> = {
  work: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  languages: 'Languages',
  volunteer: 'Volunteer',
  awards: 'Awards',
  certificates: 'Certificates',
  publications: 'Publications',
  interests: 'Interests',
  references: 'References',
}

/* ── Section component map ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SectionFormComponent = React.ComponentType<{ data: any; onChange: (data: any) => void }>

const SECTION_FORMS: Record<string, SectionFormComponent> = {
  work: WorkForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  languages: LanguagesForm,
  volunteer: VolunteerForm,
  awards: AwardsForm,
  certificates: CertificatesForm,
  publications: PublicationsForm,
  interests: InterestsForm,
  references: ReferencesForm,
}

/* ── Sortable Section Block ── */
function SortableSectionBlock({
  sectionId,
  label,
  isVisible,
  isCollapsed,
  onToggleCollapse,
  onToggleVisibility,
  onRenameLabel,
  children,
}: {
  sectionId: string
  label: string
  isVisible: boolean
  isCollapsed: boolean
  onToggleCollapse: (id: string) => void
  onToggleVisibility: (id: string, visible: boolean) => void
  onRenameLabel: (id: string, label: string) => void
  children: React.ReactNode
}) {
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(label)
  const renameInputRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  useEffect(() => {
    if (renaming) {
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    }
  }, [renaming])

  const commitRename = () => {
    const trimmed = renameValue.trim()
    if (trimmed && trimmed !== label) {
      onRenameLabel(sectionId, trimmed)
    } else {
      setRenameValue(label)
    }
    setRenaming(false)
  }

  const cancelRename = () => {
    setRenameValue(label)
    setRenaming(false)
  }

  return (
    <div ref={setNodeRef} style={style} className="border-b border-border bg-background">
      {/* Section header */}
      <div className="flex items-center gap-1 px-3 py-2.5 hover:bg-accent/30 transition-colors">
        <button
          type="button"
          className="shrink-0 cursor-grab active:cursor-grabbing touch-none text-muted-foreground/50 hover:text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </button>

        {renaming ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') cancelRename()
              }}
              onBlur={commitRename}
              className="flex-1 min-w-0 text-sm font-medium bg-accent/50 rounded px-1.5 py-0.5 border border-border outline-none focus:border-ring"
            />
            <button
              type="button"
              onClick={commitRename}
              className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground"
            >
              <Check className="size-3" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); cancelRename() }}
              className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onToggleCollapse(sectionId)}
              className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
            >
              <ChevronDown
                className={`size-3.5 text-muted-foreground shrink-0 transition-transform duration-150 ${
                  isCollapsed ? '-rotate-90' : ''
                }`}
              />
              <span className="text-sm font-medium truncate">{label}</span>
            </button>
            <button
              type="button"
              onClick={() => { setRenameValue(label); setRenaming(true) }}
              className="shrink-0 p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent transition-colors opacity-0 group-hover/section:opacity-100"
              title="Rename section"
            >
              <Pencil className="size-3" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onToggleVisibility(sectionId, !isVisible)}
          className={`shrink-0 p-1 rounded-md transition-colors ${
            isVisible
              ? 'text-muted-foreground hover:text-foreground hover:bg-accent'
              : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent'
          }`}
          title={isVisible ? 'Hide section' : 'Show section'}
        >
          {isVisible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </button>
      </div>

      {/* Collapsible content */}
      {!isCollapsed && (
        <div className={`px-3 pb-4 ${!isVisible ? 'opacity-50' : ''}`}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ── FormPanel (main export) ── */
export type FormPanelProps = {
  data: ResumeDataV2
  onChange: (data: ResumeDataV2) => void
  sectionOrder: SectionId[]
  onSectionOrderChange: (order: SectionId[]) => void
  sectionVisibility: Record<string, boolean>
  onSectionVisibilityChange: (sectionId: string, visible: boolean) => void
  sectionLabels: Record<string, string>
  onSectionLabelChange: (sectionId: string, label: string) => void
  countryCode: string
  jobCategory: string
  seniority: string
}

export function FormPanel({
  data,
  onChange,
  sectionOrder,
  onSectionOrderChange,
  sectionVisibility,
  onSectionVisibilityChange,
  sectionLabels,
  onSectionLabelChange,
  countryCode,
  jobCategory,
  seniority,
}: FormPanelProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [basicsCollapsed, setBasicsCollapsed] = useState(false)
  const [tipsExpanded, setTipsExpanded] = useState(false)
  const [tipsDismissed, setTipsDismissed] = useState(false)

  const tips = useMemo(
    () => computeInitialPreferences(countryCode || 'US', jobCategory || 'general', seniority || 'mid').tips,
    [countryCode, jobCategory, seniority],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const sections = sectionOrder.filter((id) => id !== 'basics')

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const expandAll = () => {
    setCollapsedSections(new Set())
    setBasicsCollapsed(false)
  }

  const collapseAll = () => {
    setCollapsedSections(new Set(sections))
    setBasicsCollapsed(true)
  }

  const allCollapsed = basicsCollapsed && sections.every((s) => collapsedSections.has(s))

  /* Create a section-specific onChange handler */
  const handleSectionChange = useCallback(
    <K extends keyof ResumeDataV2>(key: K) =>
      (value: ResumeDataV2[K]) => {
        onChange({ ...data, [key]: value })
      },
    [data, onChange],
  )

  /* Basics onChange handler */
  const handleBasicsChange = useCallback(
    (basics: ResumeDataV2['basics']) => {
      onChange({ ...data, basics })
    },
    [data, onChange],
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sectionOrder.indexOf(active.id as SectionId)
    const newIndex = sectionOrder.indexOf(over.id as SectionId)
    if (oldIndex === -1 || newIndex === -1) return

    onSectionOrderChange(arrayMove(sectionOrder, oldIndex, newIndex))
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Toolbar: expand/collapse all */}
      <div className="flex items-center justify-end px-3 py-1.5 border-b border-border shrink-0">
        <button
          type="button"
          onClick={allCollapsed ? expandAll : collapseAll}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded px-1.5 py-1 hover:bg-accent"
          title={allCollapsed ? 'Expand all sections' : 'Collapse all sections'}
        >
          {allCollapsed ? (
            <>
              <ChevronsUpDown className="size-3" />
              Expand All
            </>
          ) : (
            <>
              <ChevronsDownUp className="size-3" />
              Collapse All
            </>
          )}
        </button>
      </div>

      {/* Tips banner */}
      {tips.length > 0 && !tipsDismissed && (
        <div className="mx-3 mt-2 mb-1 rounded-lg border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 w-full px-3 py-2">
            <button
              type="button"
              onClick={() => setTipsExpanded((e) => !e)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              <Lightbulb className="size-3.5 text-amber-500 shrink-0" />
              <span className="text-xs font-medium text-amber-400 flex-1">Resume tips for your profile</span>
              <ChevronDown
                className={`size-3 text-amber-500/60 transition-transform ${tipsExpanded ? '' : '-rotate-90'}`}
              />
            </button>
            <button
              type="button"
              onClick={() => setTipsDismissed(true)}
              className="shrink-0 p-0.5 rounded text-amber-500/40 hover:text-amber-500 ml-1"
              title="Dismiss tips"
            >
              <X className="size-3" />
            </button>
          </div>
          {tipsExpanded && (
            <ul className="px-3 pb-2.5 space-y-1.5">
              {tips.map((tip, i) => (
                <li key={i} className="text-[11px] text-muted-foreground leading-relaxed pl-5 relative">
                  <span className="absolute left-1.5 top-0.5 text-amber-500/50">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Basics section - always at top, not reorderable */}
      <div className="border-b border-border">
        <div className="flex items-center gap-1 px-3 py-2.5 hover:bg-accent/30 transition-colors">
          <div className="w-3.5 shrink-0" /> {/* spacer to align with draggable sections */}
          <button
            type="button"
            onClick={() => setBasicsCollapsed((c) => !c)}
            className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
          >
            <ChevronDown
              className={`size-3.5 text-muted-foreground shrink-0 transition-transform duration-150 ${
                basicsCollapsed ? '-rotate-90' : ''
              }`}
            />
            <span className="text-sm font-medium truncate">Basics</span>
          </button>
        </div>
        {!basicsCollapsed && (
          <div className="px-3 pb-4">
            <BasicsForm
              data={data.basics}
              onChange={handleBasicsChange}
              countryCode={countryCode}
            />
          </div>
        )}
      </div>

      {/* Sortable sections */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          {sections.map((sectionId) => {
            const FormComponent = SECTION_FORMS[sectionId]
            if (!FormComponent) return null

            const label = sectionLabels[sectionId] || SECTION_LABELS[sectionId] || sectionId
            const isVisible = sectionVisibility[sectionId] !== false
            const isCollapsed = collapsedSections.has(sectionId)

            return (
              <div key={sectionId} className="group/section">
                <SortableSectionBlock
                  sectionId={sectionId}
                  label={label}
                  isVisible={isVisible}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={toggleCollapse}
                  onToggleVisibility={onSectionVisibilityChange}
                  onRenameLabel={onSectionLabelChange}
                >
                  <FormComponent
                    data={data[sectionId as keyof ResumeDataV2]}
                    onChange={handleSectionChange(sectionId as keyof ResumeDataV2)}
                  />
                </SortableSectionBlock>
              </div>
            )
          })}
        </SortableContext>
      </DndContext>
    </div>
  )
}
