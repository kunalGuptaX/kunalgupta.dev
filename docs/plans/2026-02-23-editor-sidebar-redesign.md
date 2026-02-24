# Figma-style Editor Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the resume editor from a single-sidebar layout to a Figma-style 3-zone layout (left layers panel, center preview, right design panel) with a floating bottom toolbar for undo/redo and zoom.

**Architecture:** Left panel holds template mini-previews and section layers (grouped by column, reorderable + visibility toggles). Right panel holds appearance controls and actions. Center preview uses fit-to-width auto-scaling. Floating bottom toolbar provides undo/redo and zoom. Templates declare their column configuration so the layers panel knows how to group sections.

**Tech Stack:** React 19, Next.js 15, @dnd-kit/core + @dnd-kit/sortable, Tailwind CSS v4, lucide-react, shadcn/ui (Button, Slider)

---

## Task 1: Add column config to templates and `hiddenSections` to types

**Files:**

- Modify: `src/components/resume-builder/types.ts`
- Modify: `src/components/resume-builder/storage.ts`
- Modify: `src/components/resume-builder/templates/registry.ts`

**What to do:**

1. In `types.ts`, add `hiddenSections: string[]` to the `UserPreferences` type. Add a new type:

```ts
export type ColumnConfig = {
  id: string
  label: string
  sections: string[]
}
```

Add `columns: ColumnConfig[]` to the `TemplateConfig` type.

2. In `storage.ts`, update the two default `UserPreferences` return values (lines 60-64 and 72-76) to include `hiddenSections: []`.

3. In `registry.ts`, add `columns` to each template entry:

For `classic` layouts:

```ts
columns: [
  { id: 'left', label: 'Left Column', sections: ['summary', 'experience'] },
  { id: 'right', label: 'Right Column', sections: ['skills', 'education', 'projects', 'strengths'] },
],
```

For `minimal` layouts:

```ts
columns: [
  { id: 'main', label: 'Sections', sections: ['summary', 'experience', 'education', 'skills', 'projects', 'strengths'] },
],
```

---

## Task 2: Create undo/redo hook

**Files:**

- Create: `src/components/resume-builder/hooks/use-undo.ts`

**What to do:**

Create a generic `useUndo<T>` hook with:

- `value: T`, `set: (v: T | (prev: T) => T) => void` — drop-in replacement for useState
- `undo()`, `redo()`, `canUndo`, `canRedo`
- `reset(v: T)` — to reset history when loading from storage
- Debounced history push (500ms) so rapid typing creates one entry
- Max 30 snapshots stored in a `useRef` array (not state, to avoid re-renders)
- `isUndoRedoRef` flag to prevent undo/redo from pushing to history
- Keyboard shortcuts: `Cmd+Z` / `Cmd+Shift+Z` (Mac), `Ctrl+Z` / `Ctrl+Y` (Windows) via `useEffect` with `keydown` listener
- On undo: flush any pending debounced push first, then decrement pointer
- On redo: increment pointer

---

## Task 3: Create layers panel component

**Files:**

- Create: `src/components/resume-builder/layers-panel.tsx`

**What to do:**

Create a panel showing sections grouped by column with drag reorder + visibility toggles.

Props:

```ts
type LayersPanelProps = {
  columns: ColumnConfig[]
  sectionOrder: string[]
  hiddenSections: string[]
  onSectionOrderChange: (order: string[]) => void
  onHiddenSectionsChange: (hidden: string[]) => void
}
```

Section label map:

```ts
const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  strengths: 'Strengths',
}
```

For each column in `columns`:

- Render column label as a small muted header
- Filter `sectionOrder` to only sections in that column's `sections` array
- Render each section as a row: `GripVertical` (drag handle) | section label | `Eye`/`EyeOff` toggle
- Use `@dnd-kit/sortable` with `verticalListSortingStrategy` per column group
- Hidden sections: dimmed text + `line-through` class
- On drag end within a column: `arrayMove` the items within that column, reconstruct full `sectionOrder` by merging column orders back together (preserving cross-column relative positions)
- Eye toggle: add/remove section ID from `hiddenSections`

---

## Task 4: Create template picker component

**Files:**

- Create: `src/components/resume-builder/template-picker.tsx`

**What to do:**

A 2-column grid of mini template cards for the left panel.

Props:

```ts
type TemplatePickerProps = {
  currentTemplateId: string
  isPremium: boolean
  onSelect: (templateId: string) => void
}
```

- Import `templateRegistry` from `./templates/registry`
- Each card: `<img>` with SVG thumbnail (aspect-ratio 8.5/11), template name below in `text-[10px]`
- Selected card: `ring-2 ring-primary`
- Premium + not subscribed: lock overlay with `Lock` icon, PRO badge, click does nothing
- Premium + subscribed: normal behavior, PRO badge stays
- Grid: `grid grid-cols-2 gap-2`

---

## Task 5: Create design panel component (right side)

**Files:**

- Create: `src/components/resume-builder/design-panel.tsx`

**What to do:**

Right panel with inline appearance controls and actions. No popover — everything rendered directly.

Props:

```ts
type DesignPanelProps = {
  theme: ThemeConfig
  onThemeChange: (theme: ThemeConfig) => void
  isPremium: boolean
  shareCopied: boolean
  onReset: () => void
  onImport: () => void
  onExport: () => void
  onShare: () => void
  onPrint: () => void
}
```

Layout (scrollable area + pinned bottom):

**Appearance section:**

- Label: "APPEARANCE" (11px uppercase muted)
- Accent Color: 6 preset swatches (`#1a1a1a`, `#1e6091`, `#c2410c`, `#15803d`, `#7c3aed`, `#be185d`) as 24px circles + `<input type="color">` for custom. Selected = ring-2. All inline, no popover.
- Heading Font: `<select>` (`Bitter`, `Georgia`, `Playfair Display`, `Merriweather`, `Times New Roman`)
- Body Font: `<select>` (`Inter`, `Arial`, `Roboto`, `Source Sans Pro`, `Helvetica Neue`)
- Font Size: `<Slider>` min=-3 max=4 step=0.5. Label with current value.
- Spacing: `<Slider>` min=0.6 max=1.6 step=0.1. Label with current value (e.g., "1.0x").

**Divider**

**Actions section:**

- Label: "ACTIONS" (11px uppercase muted)
- Full-width outlined buttons with left-aligned icons: Reset (`RotateCcw`), Import JSON (`Upload`), Export JSON (`FileJson`), Share Link (`Share2`, disabled if !isPremium)

**Pinned bottom** (outside scrollable area, border-t):

- "Download PDF" primary button, full-width

---

## Task 6: Create floating toolbar component

**Files:**

- Create: `src/components/resume-builder/floating-toolbar.tsx`

**What to do:**

Centered pill-shaped toolbar floating at the bottom of the preview area.

Props:

```ts
type FloatingToolbarProps = {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  zoom: number
  onZoomChange: (zoom: number) => void
}
```

- Position: `absolute bottom-4 left-1/2 -translate-x-1/2` inside the preview container (which needs `relative`)
- Style: `rounded-full bg-zinc-800/90 border border-zinc-700 backdrop-blur-sm shadow-lg px-3 py-1.5`
- Layout row: `Undo2` button | `Redo2` button | 1px vertical divider | `ZoomOut` icon | `<Slider>` (w-20, min=0.5, max=1.0, step=0.05) | percentage text (e.g., "75%") | `ZoomIn` icon
- Undo/Redo: `size-4` icons, `opacity-30 cursor-not-allowed` when disabled, `hover:bg-zinc-700 rounded-md p-1` when enabled
- The `print:hidden` class on the parent ensures this doesn't print

---

## Task 7: Refactor builder.tsx to 3-zone layout

**Files:**

- Modify: `src/components/resume-builder/builder.tsx` (major rewrite)
- Delete: `src/components/resume-builder/theme-controls.tsx`

**What to do:**

1. Replace `useState<ResumeData>` with `useUndo<ResumeData>` hook:

```ts
const { value: data, set: setData, undo, redo, canUndo, canRedo, reset: resetHistory } = useUndo(defaultResumeData)
```

2. Add state: `const [hiddenSections, setHiddenSections] = useState<string[]>([])`

3. Add state: `const [zoom, setZoom] = useState(0.75)`

4. Load `hiddenSections` from `storage.loadPreferences()` in mount effect. Call `resetHistory(savedData)` instead of `setData(savedData)`.

5. Save `hiddenSections` in auto-save preferences effect.

6. Get current template's column config:

```ts
const currentTemplate = getTemplate(templateId)
const columns = currentTemplate?.columns ?? [{ id: 'main', label: 'Sections', sections: DEFAULT_SECTION_ORDER }]
```

7. Replace all sidebar JSX with 3-zone layout:

```tsx
<div className="print:hidden flex h-screen">
  {/* Left Panel */}
  <aside className="w-52 shrink-0 border-r border-border bg-background flex flex-col">
    {/* Header */}
    <div className="flex items-center gap-2 px-3 py-3 border-b border-border">
      <Link href="/resume-builder">
        <ArrowLeft className="size-4" />
      </Link>
      <h1 className="text-sm font-semibold">Resume Builder</h1>
    </div>

    {/* Scrollable content with accordions */}
    <div className="flex-1 overflow-y-auto">
      {/* Template accordion */}
      <details className="border-b border-border">
        <summary className="px-3 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none flex items-center justify-between">
          Template
          <ChevronDown className="size-3" />
        </summary>
        <div className="px-3 pb-3">
          <TemplatePicker
            currentTemplateId={templateId}
            isPremium={isPremium}
            onSelect={handleTemplateChange}
          />
        </div>
      </details>

      {/* Layers accordion (default open) */}
      <details open className="border-b border-border">
        <summary>Layers</summary>
        <div className="px-3 pb-3">
          <LayersPanel
            columns={columns}
            sectionOrder={sectionOrder}
            hiddenSections={hiddenSections}
            onSectionOrderChange={setSectionOrder}
            onHiddenSectionsChange={setHiddenSections}
          />
        </div>
      </details>
    </div>
  </aside>

  {/* Center Preview */}
  <div ref={previewContainerRef} className="flex-1 relative overflow-y-auto bg-zinc-900">
    <div className="flex justify-center py-6 px-6">
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        <PaginatedPreview className={fontClassName}>
          <LayoutComponent
            data={data}
            theme={theme}
            isEditing={true}
            sectionOrder={sectionOrder}
            hiddenSections={hiddenSections}
            onDataChange={setData}
            onSectionOrderChange={setSectionOrder}
          />
        </PaginatedPreview>
      </div>
    </div>
    <FloatingToolbar
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={undo}
      onRedo={redo}
      zoom={zoom}
      onZoomChange={setZoom}
    />
  </div>

  {/* Right Panel */}
  <DesignPanel
    theme={theme}
    onThemeChange={setTheme}
    isPremium={isPremium}
    shareCopied={shareCopied}
    onReset={handleReset}
    onImport={() => fileInputRef.current?.click()}
    onExport={handleExportJson}
    onShare={handleShare}
    onPrint={handlePrint}
  />
</div>
```

8. Keep `fileInputRef` + hidden `<input type="file">` in builder.tsx (rendered outside the panels).

9. Remove imports: `ThemeControls`, `ZoomIn`, `Type`, `Space`, `Slider`. Add imports: `LayersPanel`, `TemplatePicker`, `DesignPanel`, `FloatingToolbar`, `ChevronDown`, `useUndo`.

10. Delete `src/components/resume-builder/theme-controls.tsx`.

---

## Task 8: Add `hiddenSections` support to layout components

**Files:**

- Modify: `src/components/resume-builder/templates/layouts/classic.tsx`
- Modify: `src/components/resume-builder/templates/layouts/minimal.tsx`
- Modify: `src/app/(frontend)/resume/view/client.tsx`

**What to do:**

1. Add `hiddenSections?: string[]` to both `ClassicLayoutProps` and `MinimalLayoutProps`. Default to `[]`.

2. In each layout, where `sectionOrder` is used to render sections, filter out hidden ones:

```ts
const visibleSections = sectionOrder.filter(s => !hiddenSections.includes(s))
```

In classic layout, this applies when partitioning into left/right:

```ts
const leftSections = visibleSections.filter(s => LEFT_SECTIONS.includes(s))
const rightSections = visibleSections.filter(s => RIGHT_SECTIONS.includes(s))
```

In minimal layout, just use `visibleSections` instead of `sectionOrder` in the section rendering map.

3. In `src/app/(frontend)/resume/view/client.tsx`, pass `hiddenSections={[]}` to the layout component.

---

## Task 9: Build verification and cleanup

**Files:** All

**What to do:**

1. Run `npx tsc --noEmit` — expect no errors
2. Run `yarn build` — expect clean build
3. Run `grep -r "theme-controls" src/` — expect no results (deleted file, no stale imports)
4. Verify all routes render:
   - `/resume-builder` (gallery)
   - `/resume-builder/edit` (3-zone editor)
   - `/resume/view` (shared view)
