# Resume Builder Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the resume builder from a form+preview tool into a template-first, inline-editing resume product with subscription monetization (localStorage-simulated for MVP).

**Architecture:** Hybrid template system — layout components define structure, CSS theme layer handles colors/fonts. Data stored in localStorage via StorageAdapter abstraction. Subscription state simulated in localStorage. Inline editing via contentEditable fields on the resume preview itself.

**Tech Stack:** Next.js 15, React 19, react-hook-form, @dnd-kit/core + @dnd-kit/sortable (drag reorder), lz-string (URL compression for sharing), Tailwind CSS v4, shadcn/ui components.

**Design Doc:** `docs/plans/2026-02-23-resume-builder-upgrade-design.md`

---

## Task 1: Install New Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install packages**

Run:
```bash
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lz-string
yarn add -D @types/lz-string
```

**Step 2: Verify installation**

Run: `yarn build --filter=none` or `yarn dev` — confirm no errors from new packages.

**Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: add dnd-kit and lz-string dependencies for resume builder upgrade"
```

---

## Task 2: Extended Types & Storage Abstraction

**Files:**
- Modify: `src/components/resume-builder/types.ts`
- Create: `src/components/resume-builder/storage.ts`

**Step 1: Extend types.ts**

Add these types after the existing `ResumeData` type (line 34):

```ts
export type ThemeConfig = {
  accentColor: string
  headingFont: string
  bodyFont: string
  fontSize: number   // offset from base (-3 to +4)
  spacing: number    // multiplier (0.6 to 1.6)
}

export type TemplateLayoutId = 'classic' | 'minimal' | 'executive' | 'creative'

export type TemplateConfig = {
  id: string
  name: string
  description: string
  thumbnail: string
  layout: TemplateLayoutId
  defaultTheme: ThemeConfig
  isPremium: boolean
  tags: string[]
}

export type SubscriptionTier = 'free' | 'premium'

export type SubscriptionState = {
  tier: SubscriptionTier
  expiresAt: string | null // ISO date string
}

export type UserPreferences = {
  templateId: string
  theme: ThemeConfig
  sectionOrder: string[]
}

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'strengths',
]

export const DEFAULT_THEME: ThemeConfig = {
  accentColor: '#1a1a1a',
  headingFont: 'Bitter',
  bodyFont: 'Inter',
  fontSize: 0,
  spacing: 1.0,
}
```

**Step 2: Create storage.ts**

```ts
import type { ResumeData, SubscriptionState, UserPreferences, ThemeConfig } from './types'
import { DEFAULT_THEME, DEFAULT_SECTION_ORDER, defaultResumeData } from './types'

const KEYS = {
  data: 'resume-builder:data',
  preferences: 'resume-builder:preferences',
  subscription: 'resume-builder:subscription',
} as const

// --- Storage Adapter Interface ---
// Today: LocalStorageAdapter
// Future: ApiStorageAdapter (swap implementation, same interface)

export const storage = {
  // --- Resume Data ---
  loadResume(): ResumeData {
    if (typeof window === 'undefined') return defaultResumeData
    try {
      const raw = localStorage.getItem(KEYS.data)
      if (raw) return JSON.parse(raw) as ResumeData
    } catch { /* ignore corrupt data */ }
    return defaultResumeData
  },

  saveResume(data: ResumeData): void {
    try {
      const hasContent = data.name || data.title || data.email || data.phone
        || data.location || data.linkedin || data.github || data.summary
        || data.skills.length > 0 || data.experience.length > 0
        || data.education.length > 0 || data.projects.length > 0
        || data.strengths.length > 0
      if (!hasContent) {
        localStorage.removeItem(KEYS.data)
        return
      }
      localStorage.setItem(KEYS.data, JSON.stringify(data))
    } catch { /* storage full or unavailable */ }
  },

  exportResume(data: ResumeData): string {
    return JSON.stringify(data, null, 2)
  },

  importResume(json: string): ResumeData {
    return JSON.parse(json) as ResumeData
  },

  // --- Preferences ---
  loadPreferences(): UserPreferences {
    if (typeof window === 'undefined') {
      return { templateId: 'classic', theme: DEFAULT_THEME, sectionOrder: DEFAULT_SECTION_ORDER }
    }
    try {
      const raw = localStorage.getItem(KEYS.preferences)
      if (raw) return JSON.parse(raw) as UserPreferences
    } catch { /* ignore */ }
    return { templateId: 'classic', theme: DEFAULT_THEME, sectionOrder: DEFAULT_SECTION_ORDER }
  },

  savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences()
      const merged = { ...current, ...prefs }
      localStorage.setItem(KEYS.preferences, JSON.stringify(merged))
    } catch { /* ignore */ }
  },

  // --- Subscription (simulated) ---
  getSubscription(): SubscriptionState {
    if (typeof window === 'undefined') return { tier: 'free', expiresAt: null }
    try {
      const raw = localStorage.getItem(KEYS.subscription)
      if (raw) {
        const sub = JSON.parse(raw) as SubscriptionState
        // Check expiry
        if (sub.expiresAt && new Date(sub.expiresAt) < new Date()) {
          localStorage.removeItem(KEYS.subscription)
          return { tier: 'free', expiresAt: null }
        }
        return sub
      }
    } catch { /* ignore */ }
    return { tier: 'free', expiresAt: null }
  },

  setSubscription(tier: 'free' | 'premium', days: number): void {
    try {
      if (tier === 'free') {
        localStorage.removeItem(KEYS.subscription)
        return
      }
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem(KEYS.subscription, JSON.stringify({ tier, expiresAt }))
    } catch { /* ignore */ }
  },
}
```

**Step 3: Verify build**

Run: `yarn dev` — no type errors.

**Step 4: Commit**

```bash
git add src/components/resume-builder/types.ts src/components/resume-builder/storage.ts
git commit -m "feat: add template/theme/subscription types and localStorage storage adapter"
```

---

## Task 3: Subscription Hook & Dev Panel

**Files:**
- Create: `src/components/resume-builder/hooks/use-subscription.ts`
- Create: `src/components/resume-builder/dev-panel.tsx`

**Step 1: Create use-subscription hook**

```ts
// src/components/resume-builder/hooks/use-subscription.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SubscriptionState } from '../types'
import { storage } from '../storage'

export function useSubscription() {
  const [sub, setSub] = useState<SubscriptionState>({ tier: 'free', expiresAt: null })

  useEffect(() => {
    setSub(storage.getSubscription())
  }, [])

  const isPremium = sub.tier === 'premium'

  const activate = useCallback((days: number) => {
    storage.setSubscription('premium', days)
    setSub(storage.getSubscription())
  }, [])

  const deactivate = useCallback(() => {
    storage.setSubscription('free', 0)
    setSub({ tier: 'free', expiresAt: null })
  }, [])

  return { ...sub, isPremium, activate, deactivate }
}
```

**Step 2: Create dev-panel.tsx**

A floating dev panel (bottom-right corner, only in `process.env.NODE_ENV === 'development'`) with buttons to toggle premium, set expiry to 1/7/30 days, and reset to free. Uses `useSubscription` hook internally. Collapsible with a small gear icon toggle.

```tsx
// src/components/resume-builder/dev-panel.tsx
'use client'

import { useState } from 'react'
import { Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSubscription } from './hooks/use-subscription'

export function DevPanel() {
  const [open, setOpen] = useState(false)
  const { tier, expiresAt, isPremium, activate, deactivate } = useSubscription()

  if (process.env.NODE_ENV !== 'development') return null

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-zinc-800 p-2 text-zinc-400 shadow-lg hover:text-white"
      >
        <Settings className="size-4" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-64 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase">Dev Panel</span>
        <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white">
          <X className="size-3.5" />
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Tier:</span>
          <span className={isPremium ? 'text-green-400' : 'text-zinc-500'}>{tier}</span>
        </div>
        {expiresAt && (
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Expires:</span>
            <span className="text-zinc-500 text-xs">{new Date(expiresAt).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex gap-1.5 pt-1">
          <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => activate(1)}>1 Day</Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => activate(7)}>7 Day</Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => activate(30)}>30 Day</Button>
        </div>
        <Button size="sm" variant="ghost" className="w-full text-xs h-7 text-zinc-500" onClick={deactivate}>
          Reset to Free
        </Button>
      </div>
    </div>
  )
}
```

**Step 3: Verify build**

Run: `yarn dev` — visit `/resume-builder`, confirm dev panel appears in bottom-right (dev mode only).

**Step 4: Commit**

```bash
git add src/components/resume-builder/hooks/use-subscription.ts src/components/resume-builder/dev-panel.tsx
git commit -m "feat: add subscription hook and dev panel for testing paywall"
```

---

## Task 4: Template Registry & Theme Definitions

**Files:**
- Create: `src/components/resume-builder/templates/registry.ts`
- Create: `src/components/resume-builder/templates/themes.ts`

**Step 1: Create themes.ts**

Define 4 theme presets:

```ts
// src/components/resume-builder/templates/themes.ts
import type { ThemeConfig } from '../types'

export const themes: Record<string, ThemeConfig> = {
  default: {
    accentColor: '#1a1a1a',
    headingFont: 'Bitter',
    bodyFont: 'Inter',
    fontSize: 0,
    spacing: 1.0,
  },
  ocean: {
    accentColor: '#1e6091',
    headingFont: 'Bitter',
    bodyFont: 'Inter',
    fontSize: 0,
    spacing: 1.0,
  },
  ember: {
    accentColor: '#c2410c',
    headingFont: 'Bitter',
    bodyFont: 'Inter',
    fontSize: 0,
    spacing: 1.0,
  },
  forest: {
    accentColor: '#15803d',
    headingFont: 'Bitter',
    bodyFont: 'Inter',
    fontSize: 0,
    spacing: 1.0,
  },
}
```

**Step 2: Create registry.ts**

```ts
// src/components/resume-builder/templates/registry.ts
import type { TemplateConfig } from '../types'
import { themes } from './themes'

export const templateRegistry: TemplateConfig[] = [
  {
    id: 'classic-default',
    name: 'Classic',
    description: 'Professional two-column layout with sidebar',
    thumbnail: '/templates/classic-default.png',
    layout: 'classic',
    defaultTheme: themes.default,
    isPremium: false,
    tags: ['professional', 'traditional'],
  },
  {
    id: 'minimal-default',
    name: 'Minimal',
    description: 'Clean single-column layout',
    thumbnail: '/templates/minimal-default.png',
    layout: 'minimal',
    defaultTheme: themes.default,
    isPremium: false,
    tags: ['clean', 'modern'],
  },
  {
    id: 'classic-ocean',
    name: 'Classic Ocean',
    description: 'Two-column layout with blue accent',
    thumbnail: '/templates/classic-ocean.png',
    layout: 'classic',
    defaultTheme: themes.ocean,
    isPremium: true,
    tags: ['professional', 'blue'],
  },
  {
    id: 'classic-ember',
    name: 'Classic Ember',
    description: 'Two-column layout with warm accent',
    thumbnail: '/templates/classic-ember.png',
    layout: 'classic',
    defaultTheme: themes.ember,
    isPremium: true,
    tags: ['bold', 'warm'],
  },
  {
    id: 'minimal-forest',
    name: 'Minimal Forest',
    description: 'Single-column layout with green accent',
    thumbnail: '/templates/minimal-forest.png',
    layout: 'minimal',
    defaultTheme: themes.forest,
    isPremium: true,
    tags: ['clean', 'nature'],
  },
]

export function getTemplate(id: string): TemplateConfig | undefined {
  return templateRegistry.find((t) => t.id === id)
}

export function getFreeTemplates(): TemplateConfig[] {
  return templateRegistry.filter((t) => !t.isPremium)
}

export function getPremiumTemplates(): TemplateConfig[] {
  return templateRegistry.filter((t) => t.isPremium)
}
```

**Step 3: Commit**

```bash
git add src/components/resume-builder/templates/
git commit -m "feat: add template registry with 5 templates and 4 theme presets"
```

---

## Task 5: Editable Field Base Components

**Files:**
- Create: `src/components/resume-builder/templates/base/EditableField.tsx`
- Create: `src/components/resume-builder/templates/base/EditableList.tsx`
- Create: `src/components/resume-builder/templates/base/EditableTagList.tsx`

**Step 1: Create EditableField.tsx**

The core inline editing primitive. Wraps `contentEditable`. On click: enters edit mode (blue border). On blur/Enter: saves via callback. Supports single-line (Enter saves) and multi-line (Shift+Enter newline, blur saves). Shows placeholder when empty.

```tsx
// src/components/resume-builder/templates/base/EditableField.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

type EditableFieldProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  style?: React.CSSProperties
  className?: string
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
}

export function EditableField({
  value,
  onChange,
  placeholder = 'Click to edit...',
  multiline = false,
  style,
  className = '',
  as: Tag = 'span',
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const handleBlur = useCallback(() => {
    setEditing(false)
    if (ref.current) {
      const text = ref.current.innerText.trim()
      if (text !== value) onChange(text)
    }
  }, [value, onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!multiline && e.key === 'Enter') {
        e.preventDefault()
        ref.current?.blur()
      }
      if (e.key === 'Escape') {
        // Revert to original value
        if (ref.current) ref.current.innerText = value
        ref.current?.blur()
      }
    },
    [multiline, value],
  )

  const handleClick = useCallback(() => {
    setEditing(true)
  }, [])

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      // Place cursor at end
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(ref.current)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [editing])

  // Sync value from outside (e.g. template switch)
  useEffect(() => {
    if (!editing && ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value
    }
  }, [value, editing])

  const isEmpty = !value

  return (
    <Tag
      ref={ref as React.Ref<any>}
      contentEditable={editing}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none transition-all ${
        editing
          ? 'ring-2 ring-blue-400 rounded-sm shadow-sm'
          : 'hover:ring-1 hover:ring-blue-300 hover:ring-dashed hover:rounded-sm cursor-text'
      } ${isEmpty && !editing ? 'italic opacity-40' : ''} ${className}`}
      style={{
        ...style,
        minWidth: '20px',
        display: Tag === 'span' ? 'inline-block' : undefined,
      }}
    >
      {isEmpty && !editing ? placeholder : value}
    </Tag>
  )
}
```

**Step 2: Create EditableList.tsx**

For bullet lists (experience bullets). Shows existing bullets with inline editing. "+" button to add a bullet. "x" button per bullet to remove. Each bullet is an EditableField.

```tsx
// src/components/resume-builder/templates/base/EditableList.tsx
'use client'

import { Plus, X } from 'lucide-react'
import { EditableField } from './EditableField'

type EditableListProps = {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  bulletStyle?: React.CSSProperties
  itemStyle?: React.CSSProperties
}

export function EditableList({
  items,
  onChange,
  placeholder = 'Click to add...',
  bulletStyle,
  itemStyle,
}: EditableListProps) {
  const updateItem = (index: number, value: string) => {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  const addItem = () => {
    onChange([...items, ''])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div>
      <ul style={bulletStyle}>
        {items.map((item, i) => (
          <li key={i} className="group flex items-start gap-1" style={itemStyle}>
            <EditableField
              value={item}
              onChange={(v) => updateItem(i, v)}
              placeholder={placeholder}
              multiline
              className="flex-1"
            />
            <button
              onClick={() => removeItem(i)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 shrink-0 mt-0.5 print:hidden"
            >
              <X style={{ width: 12, height: 12 }} />
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={addItem}
        className="flex items-center gap-1 text-blue-400 hover:text-blue-600 mt-1 print:hidden"
        style={{ fontSize: '11px' }}
      >
        <Plus style={{ width: 12, height: 12 }} />
        Add item
      </button>
    </div>
  )
}
```

**Step 3: Create EditableTagList.tsx**

For skills/strengths/techStack. Shows tags as badges. Click "+" to type a new tag. Click "x" on tag to remove.

```tsx
// src/components/resume-builder/templates/base/EditableTagList.tsx
'use client'

import { useState, useRef } from 'react'
import { Plus, X } from 'lucide-react'

type EditableTagListProps = {
  tags: string[]
  onChange: (tags: string[]) => void
  tagStyle?: React.CSSProperties
  containerStyle?: React.CSSProperties
}

export function EditableTagList({
  tags,
  onChange,
  tagStyle,
  containerStyle,
}: EditableTagListProps) {
  const [adding, setAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (value: string) => {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
  }

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(e.currentTarget.value)
      e.currentTarget.value = ''
    }
    if (e.key === 'Escape') {
      setAdding(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', ...containerStyle }}>
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="group inline-flex items-center"
          style={tagStyle}
        >
          {tag}
          <button
            onClick={() => removeTag(i)}
            className="ml-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 print:hidden"
          >
            <X style={{ width: 10, height: 10 }} />
          </button>
        </span>
      ))}
      {adding ? (
        <input
          ref={inputRef}
          autoFocus
          onKeyDown={handleKeyDown}
          onBlur={() => setAdding(false)}
          placeholder="Type + Enter"
          className="bg-transparent border border-blue-400 rounded px-1.5 text-xs outline-none"
          style={{ width: '80px', fontSize: 'inherit', ...tagStyle, border: '1px solid #60a5fa' }}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center text-blue-400 hover:text-blue-600 print:hidden"
          style={{ fontSize: 'inherit' }}
        >
          <Plus style={{ width: 12, height: 12 }} />
        </button>
      )}
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add src/components/resume-builder/templates/base/
git commit -m "feat: add EditableField, EditableList, EditableTagList base components"
```

---

## Task 6: SectionWrapper with Drag-and-Drop Reordering

**Files:**
- Create: `src/components/resume-builder/templates/base/SectionWrapper.tsx`

**Step 1: Create SectionWrapper.tsx**

Wraps each resume section. Shows drag handle on hover. Uses `@dnd-kit/sortable` for reordering. Also shows "add item" button for array sections (experience, education, projects).

```tsx
// src/components/resume-builder/templates/base/SectionWrapper.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

type SectionWrapperProps = {
  id: string
  children: React.ReactNode
  isEditing: boolean
  style?: React.CSSProperties
}

export function SectionWrapper({ id, children, isEditing, style }: SectionWrapperProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const sortableStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    ...style,
  }

  if (!isEditing) {
    return <div style={style} data-break-avoid>{children}</div>
  }

  return (
    <div ref={setNodeRef} style={sortableStyle} data-break-avoid className="group/section">
      <button
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-0 opacity-0 group-hover/section:opacity-100 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 print:hidden"
        style={{ touchAction: 'none' }}
      >
        <GripVertical style={{ width: 16, height: 16 }} />
      </button>
      {children}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/resume-builder/templates/base/SectionWrapper.tsx
git commit -m "feat: add SectionWrapper with dnd-kit sortable drag reordering"
```

---

## Task 7: Refactor Classic Layout to Use Editable Components + Theme

**Files:**
- Create: `src/components/resume-builder/templates/layouts/classic.tsx` (new file based on existing `preview.tsx`)
- Keep: `src/components/resume-builder/preview.tsx` (will be removed in Task 12 after migration is complete)

**Step 1: Create classic.tsx**

Refactor the existing `preview.tsx` (468 lines) into a new layout component that:
- Accepts `data: ResumeData`, `theme: ThemeConfig`, `isEditing: boolean`, `sectionOrder: string[]`, `onDataChange: (data: ResumeData) => void`
- Replaces hardcoded color constants with `theme.accentColor`, etc.
- Replaces static text renders with `<EditableField>` when `isEditing=true`
- Replaces static bullet lists with `<EditableList>` when `isEditing=true`
- Replaces static tag lists with `<EditableTagList>` when `isEditing=true`
- Wraps each section in `<SectionWrapper>` and renders sections in `sectionOrder` order
- Uses `@dnd-kit/core` `DndContext` + `SortableContext` around section list
- When `isEditing=false`, renders exactly as the current `preview.tsx` (for print/share view)
- Uses `fs()` and `sp()` helpers reading from `theme.fontSize` and `theme.spacing`

This is the largest single task. The key pattern for each field:

```tsx
// Instead of:
<span style={{ fontSize: fs(30) }}>{data.name}</span>

// Editing mode:
{isEditing ? (
  <EditableField
    value={data.name}
    onChange={(v) => onDataChange({ ...data, name: v })}
    placeholder="Your Name"
    style={{ fontSize: fs(30) }}
    as="span"
  />
) : (
  <span style={{ fontSize: fs(30) }}>{data.name}</span>
)}
```

Wrap sections with DndContext for reordering:

```tsx
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

// In the component:
const handleDragEnd = (event) => {
  const { active, over } = event
  if (active.id !== over?.id) {
    const oldIndex = sectionOrder.indexOf(active.id as string)
    const newIndex = sectionOrder.indexOf(over!.id as string)
    onSectionOrderChange(arrayMove(sectionOrder, oldIndex, newIndex))
  }
}

// Render sections in order:
<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
    {sectionOrder.map((sectionId) => renderSection(sectionId))}
  </SortableContext>
</DndContext>
```

The `renderSection(id)` function maps section IDs to their JSX (summary, experience, education, skills, projects, strengths). Each wrapped in `<SectionWrapper id={sectionId} isEditing={isEditing}>`.

Note: The header (name, title, contact info) stays at the top always — it's not part of the reorderable sections.

**Step 2: Verify classic layout renders identically to current preview.tsx in non-editing mode**

Temporarily import both and compare visually at `/resume-builder`.

**Step 3: Commit**

```bash
git add src/components/resume-builder/templates/layouts/classic.tsx
git commit -m "feat: create classic layout with inline editing, themes, and section reordering"
```

---

## Task 8: Refactor Minimal Layout to Use Editable Components + Theme

**Files:**
- Create: `src/components/resume-builder/templates/layouts/minimal.tsx` (based on `preview-minimal.tsx`)

Same pattern as Task 7 but for the minimal (single-column) layout. Accept same props. Use same editable base components. Wrap sections in SectionWrapper. Apply theme colors.

**Step 1: Create minimal.tsx**

Follow the same refactoring pattern as Task 7 for the minimal layout.

**Step 2: Commit**

```bash
git add src/components/resume-builder/templates/layouts/minimal.tsx
git commit -m "feat: create minimal layout with inline editing, themes, and section reordering"
```

---

## Task 9: Template Gallery Page

**Files:**
- Create: `src/app/(frontend)/resume-builder/page.tsx` (replace existing)
- Create: `src/components/resume-builder/template-card.tsx`

**Step 1: Create template-card.tsx**

A card component showing template thumbnail, name, description, tags, and free/premium badge. Premium templates show a lock icon overlay if user is on free tier. Click handler navigates to editor.

```tsx
// src/components/resume-builder/template-card.tsx
'use client'

import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { TemplateConfig } from './types'

type TemplateCardProps = {
  template: TemplateConfig
  isPremium: boolean  // user's subscription status
}

export function TemplateCard({ template, isPremium: userIsPremium }: TemplateCardProps) {
  const router = useRouter()
  const locked = template.isPremium && !userIsPremium

  const handleClick = () => {
    if (locked) {
      // TODO: show upgrade modal in future
      return
    }
    router.push(`/resume-builder/edit?template=${template.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={`group relative text-left rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden transition-all hover:border-zinc-600 hover:shadow-lg ${locked ? 'opacity-75' : ''}`}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[8.5/11] bg-zinc-800 flex items-center justify-center">
        {/* Placeholder — replace with actual screenshots later */}
        <span className="text-zinc-600 text-sm">{template.name}</span>
        {locked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Lock className="size-6 text-zinc-400" />
          </div>
        )}
        {template.isPremium && (
          <span className="absolute top-2 right-2 bg-amber-500/90 text-black text-[10px] font-semibold px-1.5 py-0.5 rounded">
            PRO
          </span>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-white">{template.name}</h3>
        <p className="text-xs text-zinc-500 mt-0.5">{template.description}</p>
        <div className="flex gap-1 mt-2">
          {template.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
```

**Step 2: Replace page.tsx to serve as gallery**

The new `/resume-builder` page becomes the gallery landing. It imports the template registry and renders a grid of `TemplateCard` components. Also shows a "Continue editing" banner if localStorage has saved data.

```tsx
// src/app/(frontend)/resume-builder/page.tsx
import type { Metadata } from 'next'
import { TemplateGallery } from '@/components/resume-builder/template-gallery'

export const metadata: Metadata = {
  title: 'Resume Builder | Pick a Template',
  description: 'Choose a professional resume template and build your resume with inline editing.',
}

export default function ResumeBuilderPage() {
  return <TemplateGallery />
}
```

Create `src/components/resume-builder/template-gallery.tsx` as a client component that:
- Imports `templateRegistry` and `useSubscription`
- Shows hero text: "Build your resume in minutes"
- Shows "Continue editing" banner with link to `/resume-builder/edit` if `storage.loadResume()` returns non-default data
- Renders template cards in a responsive grid (2-col mobile, 3-col tablet, 4-col desktop)

**Step 3: Commit**

```bash
git add src/app/\(frontend\)/resume-builder/page.tsx src/components/resume-builder/template-card.tsx src/components/resume-builder/template-gallery.tsx
git commit -m "feat: add template gallery landing page with template cards"
```

---

## Task 10: Editor Page with Inline Editing

**Files:**
- Create: `src/app/(frontend)/resume-builder/edit/page.tsx`
- Modify: `src/components/resume-builder/builder.tsx` (major refactor)

**Step 1: Create editor page route**

```tsx
// src/app/(frontend)/resume-builder/edit/page.tsx
import type { Metadata } from 'next'
import { Inter, Bitter } from 'next/font/google'
import { Monitor } from 'lucide-react'
import { ResumeEditor } from '@/components/resume-builder/builder'
import { getSiteConfig } from '@/utilities/getSiteConfig'
import { getResume } from '@/utilities/getResume'
import { siteToResumeData } from '@/utilities/siteToResumeData'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })
const bitter = Bitter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-bitter' })

const fontClassName = `${inter.className} ${bitter.variable}`

export const metadata: Metadata = {
  title: 'Resume Builder | Edit',
  description: 'Edit your resume with inline editing and live preview.',
}

export default async function ResumeEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; source?: string; download?: string }>
}) {
  const params = await searchParams
  let prefillData = undefined

  if (params.source === 'portfolio') {
    const [config, resume] = await Promise.all([getSiteConfig(), getResume()])
    prefillData = siteToResumeData(config, resume)
  }

  return (
    <div className={fontClassName}>
      <div className="flex lg:hidden print:hidden flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <Monitor className="size-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Desktop Only</h2>
        <p className="text-muted-foreground max-w-sm">
          The Resume Builder requires a larger screen.
        </p>
      </div>
      <div className="hidden lg:contents print:contents">
        <ResumeEditor
          initialTemplateId={params.template}
          prefillData={prefillData}
          autoDownload={params.download === 'true'}
          fontClassName={fontClassName}
        />
      </div>
    </div>
  )
}
```

**Step 2: Refactor builder.tsx**

Major refactor of `builder.tsx` to:
- Remove the left form panel entirely
- Use the new layout components from `templates/layouts/`
- Pass `isEditing={true}` to layout components
- Manage template selection from URL param or preferences
- Manage theme state (color, fonts) with live customization UI
- Manage section order via drag-and-drop (state + persistence)
- Keep the top toolbar but update it: template switcher (dropdown showing all templates), color picker, font selector, font-size slider, spacing slider, export/import/download/share buttons
- Gate premium templates and share button behind `useSubscription()`
- Include `DevPanel` component
- Use `storage` module instead of raw localStorage calls
- Pass `onDataChange` callback to layout components for inline editing

The toolbar should include:
- Template selector (dropdown, replaces the classic/minimal toggle)
- Color picker for accent color (small color input)
- Font size + spacing sliders (keep existing)
- Export JSON, Import JSON, Download PDF, Share Link buttons
- Share Link button shows lock icon if not premium

The main content area: full-width centered resume preview using `PaginatedPreview`, with the layout component rendering in editing mode. No form panel.

**Step 3: Verify**

Run: `yarn dev` — navigate to `/resume-builder`, pick a template, verify it loads the editor with inline editing working.

**Step 4: Commit**

```bash
git add src/app/\(frontend\)/resume-builder/edit/ src/components/resume-builder/builder.tsx
git commit -m "feat: refactor builder to full-screen inline editor with template/theme support"
```

---

## Task 11: Theme Customization UI

**Files:**
- Create: `src/components/resume-builder/theme-controls.tsx`
- Modify: `src/components/resume-builder/builder.tsx` (integrate controls into toolbar)

**Step 1: Create theme-controls.tsx**

A compact popover/dropdown in the toolbar that shows:
- **Accent color**: A row of preset color swatches (default, ocean, ember, forest, + a custom color input)
- **Heading font**: Dropdown select (Bitter, Georgia, Playfair Display, Merriweather)
- **Body font**: Dropdown select (Inter, Arial, Roboto, Source Sans Pro)

On any change, updates the `theme` state in the builder, which flows down to the layout component.

**Step 2: Integrate into builder toolbar**

Add the theme controls popover trigger button in the toolbar next to the sliders.

**Step 3: Commit**

```bash
git add src/components/resume-builder/theme-controls.tsx src/components/resume-builder/builder.tsx
git commit -m "feat: add theme customization UI with color picker and font selectors"
```

---

## Task 12: Share as Compressed URL

**Files:**
- Create: `src/app/(frontend)/resume/view/page.tsx`
- Modify: `src/components/resume-builder/builder.tsx` (add share button logic)

**Step 1: Create share view page**

```tsx
// src/app/(frontend)/resume/view/page.tsx
```

This is a client component page that:
- Reads the URL hash on mount (client-side only since hash fragments aren't sent to server)
- Decompresses the hash using `lz-string`'s `decompressFromEncodedURIComponent`
- Parses the JSON into `ResumeData` + template ID + theme
- Renders the appropriate layout component with `isEditing={false}`
- Shows a small footer: "Built with [brand] | Create yours free"
- If hash is invalid/missing, shows error message

**Step 2: Add share button logic to builder**

In the builder toolbar, the "Share" button:
- Compresses current data + template + theme using `lz-string`
- Generates URL: `/resume/view#${compressed}`
- Copies to clipboard with toast notification
- Button shows lock icon if user is not premium (gated via `useSubscription`)

**Step 3: Commit**

```bash
git add src/app/\(frontend\)/resume/view/ src/components/resume-builder/builder.tsx
git commit -m "feat: add share-as-link with lz-string URL compression"
```

---

## Task 13: Clean Up Old Files & Migration

**Files:**
- Delete: `src/components/resume-builder/form.tsx` (replaced by inline editing)
- Delete: `src/components/resume-builder/preview.tsx` (replaced by `templates/layouts/classic.tsx`)
- Delete: `src/components/resume-builder/preview-minimal.tsx` (replaced by `templates/layouts/minimal.tsx`)
- Modify: `src/components/resume-builder/builder.tsx` (remove old imports)

**Step 1: Handle localStorage data migration**

In `storage.ts`, add a migration function that runs on load:
- Check if old key `resume-builder-data` exists
- If so, move it to new key `resume-builder:data`
- Remove old key
- This ensures existing users don't lose data

```ts
export function migrateOldStorage(): void {
  try {
    const OLD_KEY = 'resume-builder-data'
    const old = localStorage.getItem(OLD_KEY)
    if (old && !localStorage.getItem(KEYS.data)) {
      localStorage.setItem(KEYS.data, old)
      localStorage.removeItem(OLD_KEY)
    }
  } catch { /* ignore */ }
}
```

Call `migrateOldStorage()` at the top of `loadResume()`.

**Step 2: Remove old files**

Delete `form.tsx`, `preview.tsx`, `preview-minimal.tsx`. Update all imports in `builder.tsx`.

**Step 3: Verify everything still works**

Run: `yarn dev` — test full flow: gallery → template selection → editing → save → template switch → PDF download → JSON export/import → share link.

Run: `yarn build` — ensure no broken imports or type errors.

**Step 4: Commit**

```bash
git rm src/components/resume-builder/form.tsx src/components/resume-builder/preview.tsx src/components/resume-builder/preview-minimal.tsx
git add src/components/resume-builder/
git commit -m "refactor: remove old form/preview files, add localStorage data migration"
```

---

## Task 14: Template Thumbnail Screenshots

**Files:**
- Create: `public/templates/classic-default.png`
- Create: `public/templates/minimal-default.png`
- Create: `public/templates/classic-ocean.png`
- Create: `public/templates/classic-ember.png`
- Create: `public/templates/minimal-forest.png`

**Step 1: Generate template thumbnails**

For each template in the registry:
1. Load the editor with that template + default data
2. Take a screenshot of the A4 preview area
3. Resize to ~400x520px (A4 aspect ratio)
4. Save to `public/templates/{template-id}.png`

This can be done manually or with a simple script using Playwright.

**Step 2: Commit**

```bash
git add public/templates/
git commit -m "feat: add template thumbnail screenshots for gallery"
```

---

## Task 15: End-to-End Smoke Test

**Files:** None new — this is a manual/automated verification task.

**Step 1: Test the complete user flow**

1. Visit `/resume-builder` — gallery loads with 5 templates
2. Click "Classic" → navigates to `/resume-builder/edit?template=classic-default`
3. Click on name → inline edit works, saves on blur
4. Click on experience bullet → edit, add, remove bullets
5. Click on skills → add/remove tags
6. Drag a section to reorder → order persists
7. Change accent color → preview updates immediately
8. Change font → preview updates
9. Switch template via dropdown → data persists, layout changes
10. Click "Download PDF" → browser print dialog opens
11. Click "Export JSON" → downloads JSON file
12. Click "Import JSON" → loads data from file
13. Click "Share" (with premium active via dev panel) → URL copied
14. Open shared URL → read-only resume renders correctly
15. Toggle dev panel → switch between free/premium, verify gating
16. Refresh page → data persists from localStorage
17. Click "Reset" → data clears

**Step 2: Verify build**

Run: `yarn build` — ensure clean production build with no errors.

**Step 3: Commit any fixes found during testing**

```bash
git add -A
git commit -m "fix: address issues found during e2e smoke test"
```
