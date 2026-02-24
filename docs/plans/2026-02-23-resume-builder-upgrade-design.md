# Resume Builder Upgrade Design

**Date**: 2026-02-23
**Status**: Approved

## Goals

Transform the existing resume builder into a monetizable product with:
- Template-first flow with inline editing (no separate form panel)
- Template marketplace architecture (free + premium templates)
- Subscription-based monetization (1-day, 7-day, 30-day passes)
- Data persistence across template switches
- Future-ready for OAuth + DB migration

## Architecture: Hybrid Template System

Templates combine **layout components** (for structural variety) with a **CSS theme layer** (for color/font customization). This enables both simple CSS themes and complex layout templates.

### Template Structure

```
src/components/resume-builder/templates/
  registry.ts           — template metadata + registration
  types.ts              — TemplateConfig, ThemeConfig types
  base/
    EditableField.tsx    — click-to-edit wrapper component
    EditableList.tsx     — editable bullet lists with add/remove
    EditableTagList.tsx  — editable skill/tag chips
    SectionWrapper.tsx   — draggable section container
  layouts/
    classic.tsx          — 2-column layout (free)
    minimal.tsx          — single-column layout (free)
    executive.tsx        — premium layout
    creative.tsx         — premium layout
  themes/
    default.ts           — base theme
    ocean.ts             — blue accent theme
    ember.ts             — warm/orange theme
    forest.ts            — green theme
```

### Template Config

```ts
interface TemplateConfig {
  id: string
  name: string
  description: string
  thumbnail: string
  layout: 'classic' | 'minimal' | 'executive' | 'creative'
  defaultTheme: ThemeConfig
  isPremium: boolean
  tags: string[]
}

interface ThemeConfig {
  accentColor: string
  headingFont: string
  bodyFont: string
  fontSize: number
  spacing: number
}
```

Layout components receive `{ data: ResumeData, theme: ThemeConfig, isEditing: boolean, sectionOrder: string[] }`.

## Inline Editing System

### EditableField Component

Click any text on the resume preview to edit inline:
- **Single-line fields** (name, title, company): `contentEditable` div, saves on blur or Enter
- **Multi-line fields** (summary, bullets): `contentEditable`, Shift+Enter for newlines
- **Tag fields** (skills, tech stack): Click shows popover with tag input
- **Date fields**: Click shows compact date picker popover

### Visual Affordances

- **Hover**: Light blue dashed outline around editable field
- **Active/Editing**: Solid blue border, slight elevation shadow
- **Empty placeholder**: Gray italic text ("Click to add summary...")
- **Section controls**: Drag handle + "+" button on section hover

### Section Reordering

- Each section wrapped in `SectionWrapper` with drag handle
- Uses `@dnd-kit/core` or HTML5 drag-and-drop
- Section order stored as `string[]` in resume data, persisted to localStorage

### Data Flow

```
User clicks field → EditableField enters edit mode
User types → local component state
User blurs/confirms → react-hook-form setValue()
Form onChange → preview re-render + localStorage auto-save
```

Data is decoupled from templates. Same `ResumeData` renders in any template.

## Page Structure

### `/resume-builder` — Gallery Page

- Hero: "Build your resume in minutes"
- Template gallery grid (free + premium with lock badge)
- Template cards: thumbnail, name, tags, free/premium badge
- Click template → `/resume-builder/edit?template=classic`
- "Continue editing" button if localStorage has saved data

### `/resume-builder/edit` — Editor Page

- Full-screen editor, slim toolbar at top
- Toolbar: template switcher, theme customization (color picker, font selector), spacing/font-size sliders, Export JSON, Import JSON, Download PDF, Share Link (gated)
- Resume preview IS the editor (full width, centered, A4 aspect)
- Click anywhere to edit inline
- Auto-saves to localStorage

### `/resume/view#[compressed-data]` — Public Shared Resume

- Read-only view, print-optimized
- No editing controls
- Small "Built with [brand]" footer
- Data encoded in URL hash via `lz-string` compression

### Template Switching

Same data, different layout component. Theme resets to template default. Data never lost.

## Monetization

### Tier Structure

| Feature | Free | Paid (1/7/30 day) |
|---------|------|--------------------|
| Basic templates (Classic, Minimal) | Yes | Yes |
| Inline editing | Yes | Yes |
| Section reordering | Yes | Yes |
| localStorage save | Yes | Yes |
| JSON export/import | Yes | Yes |
| PDF download | Yes | Yes |
| Color/font customization | Yes | Yes |
| Premium templates | No | Yes |
| Share as public link | No | Yes |

### Pricing (suggested)

- 1-day pass: $2-3
- 7-day pass: $5-7
- 30-day pass: $9-12

### MVP: localStorage-based Subscription Simulation

- Subscription status in localStorage: `{ tier, expiresAt }`
- Dev panel to toggle free/premium for testing
- No real payment processing

### Production (future)

- LemonSqueezy for payments
- OAuth (Google/GitHub) for accounts
- PostgreSQL for all user data
- Proper JWT/session-based access control

## Data Persistence

### Storage Abstraction

```ts
interface StorageAdapter {
  loadResume(): ResumeData | null
  saveResume(data: ResumeData): void
  exportResume(): string
  importResume(json: string): void
  getSubscription(): { tier: 'free' | 'premium', expiresAt: string | null }
  setSubscription(tier: string, days: number): void
  getPreferences(): { templateId: string, theme: ThemeConfig, sectionOrder: string[] }
  savePreferences(prefs: Partial<Preferences>): void
}
```

**Now**: `LocalStorageAdapter` — **Later**: `ApiStorageAdapter`

### localStorage Keys

```
resume-builder:data          → ResumeData JSON
resume-builder:preferences   → { templateId, theme, sectionOrder }
resume-builder:subscription  → { tier, expiresAt }
```

## Non-AI Features Summary

1. **Template gallery** with free/premium templates
2. **Inline click-to-edit** on resume preview
3. **Template-first flow** — pick template, then edit
4. **Section drag-and-drop reordering**
5. **Color/font customization** via theme layer
6. **Share as compressed URL** (premium)
7. **JSON export/import** for data backup
8. **PDF download** via `window.print()`
9. **Data persists across template switches**
10. **Subscription simulation** for testing paywall UX
