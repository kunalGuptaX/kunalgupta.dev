'use client'

import { useState, useRef, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import {
  Type,
  Space,
  Paintbrush,
  ChevronDown,
  ChevronRight,
  Search,
  Layout,
} from 'lucide-react'
import type { ThemeConfig } from './types'
import { templateRegistry } from './templates/registry'
import { TemplateThumbnail } from './template-thumbnail'

const PRESET_COLORS = [
  { name: 'Default', value: '#1a1a1a' },
  { name: 'Ocean', value: '#1e6091' },
  { name: 'Ember', value: '#c2410c' },
  { name: 'Forest', value: '#15803d' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Pink', value: '#be185d' },
]

const HEADING_FONTS = ['Bitter', 'Georgia', 'Playfair Display', 'Merriweather', 'Times New Roman', 'Lora', 'Crimson Text', 'Libre Baskerville']
const BODY_FONTS = ['Inter', 'Arial', 'Roboto', 'Source Sans Pro', 'Helvetica Neue', 'Open Sans', 'Lato', 'Nunito', 'Work Sans', 'DM Sans']

/* System fonts that don't need loading from Google Fonts */
const SYSTEM_FONTS = new Set(['Georgia', 'Arial', 'Times New Roman', 'Helvetica Neue'])

/* Fonts already loaded -- avoid duplicate <link> tags */
const loadedFonts = new Set<string>()

function loadGoogleFont(fontName: string) {
  if (SYSTEM_FONTS.has(fontName) || loadedFonts.has(fontName)) return
  loadedFonts.add(fontName)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
}

/** Preload all picker fonts so they render in the dropdown */
function preloadAllFonts() {
  ;[...HEADING_FONTS, ...BODY_FONTS].forEach(loadGoogleFont)
}

/* ---- FontPicker ---- */
function FontPicker({
  value,
  fonts,
  onChange,
}: {
  value: string
  fonts: string[]
  onChange: (font: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = search
    ? fonts.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : fonts

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search when opened
  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-9 rounded-md border border-border bg-background px-2.5 text-sm flex items-center justify-between hover:bg-accent/50 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <span className="truncate" style={{ fontFamily: value }}>{value}</span>
        <ChevronDown className={`size-3.5 text-muted-foreground shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border border-border bg-popover shadow-lg overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-border">
            <Search className="size-3.5 text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {/* List */}
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-2.5 py-2 text-xs text-muted-foreground">No fonts found</div>
            ) : (
              filtered.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    onChange(font)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={`w-full text-left px-2.5 py-2 text-sm hover:bg-accent transition-colors flex items-center justify-between ${
                    value === font ? 'bg-accent/50 text-foreground' : 'text-foreground'
                  }`}
                >
                  <span style={{ fontFamily: font }}>{font}</span>
                  {value === font && (
                    <span className="text-xs text-muted-foreground">Selected</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---- Collapsible Section ---- */
function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string
  icon: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:bg-accent/30 transition-colors"
      >
        {icon}
        <span className="flex-1 text-left">{title}</span>
        <ChevronRight
          className={`size-3.5 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  )
}

/* ---- Props ---- */
type DesignPanelProps = {
  theme: ThemeConfig
  onThemeChange: (theme: ThemeConfig) => void
  embedded?: boolean
  // Template switcher
  templateId?: string
  onTemplateChange?: (templateId: string) => void
}

export function DesignPanel({
  theme,
  onThemeChange,
  embedded = false,
  templateId,
  onTemplateChange,
}: DesignPanelProps) {
  /* Load all Google Fonts on mount so picker previews work */
  useEffect(() => {
    preloadAllFonts()
  }, [])

  /* Ensure selected fonts are loaded (covers initial load from storage) */
  useEffect(() => {
    loadGoogleFont(theme.headingFont)
    loadGoogleFont(theme.bodyFont)
  }, [theme.headingFont, theme.bodyFont])

  const updateTheme = (partial: Partial<ThemeConfig>) => {
    onThemeChange({ ...theme, ...partial })
  }

  const content = (
    <div className={embedded ? '' : 'flex-1 overflow-y-auto'}>
      {/* ---- Appearance Section ---- */}
      <CollapsibleSection
        title="Appearance"
        icon={<Paintbrush className="size-3.5" />}
        defaultOpen={true}
      >
        {/* Accent Color */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Color</label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                title={preset.name}
                onClick={() => updateTheme({ accentColor: preset.value })}
                className={`h-6 w-6 rounded-full ring-offset-background transition-all ${
                  theme.accentColor === preset.value
                    ? 'ring-2 ring-foreground ring-offset-2'
                    : 'hover:ring-2 hover:ring-muted-foreground hover:ring-offset-1'
                }`}
                style={{ backgroundColor: preset.value }}
              />
            ))}
            <input
              type="color"
              value={theme.accentColor}
              onChange={(e) => updateTheme({ accentColor: e.target.value })}
              title="Custom color"
              className="h-6 w-6 rounded-full cursor-pointer border-0 bg-transparent p-0"
            />
          </div>
        </div>

        {/* Heading Font */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Heading Font</label>
          <FontPicker
            value={theme.headingFont}
            fonts={HEADING_FONTS}
            onChange={(font) => updateTheme({ headingFont: font })}
          />
        </div>

        {/* Body Font */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Body Font</label>
          <FontPicker
            value={theme.bodyFont}
            fonts={BODY_FONTS}
            onChange={(font) => updateTheme({ bodyFont: font })}
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Font Size</label>
          <div className="flex items-center gap-2.5">
            <Type className="size-4 text-muted-foreground shrink-0" />
            <Slider
              min={-3}
              max={4}
              step={0.5}
              value={[theme.fontSize]}
              onValueChange={([val]) => updateTheme({ fontSize: val })}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground tabular-nums w-6 text-right">
              {theme.fontSize > 0 ? `+${theme.fontSize}` : theme.fontSize}
            </span>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Spacing</label>
          <div className="flex items-center gap-2.5">
            <Space className="size-4 text-muted-foreground shrink-0" />
            <Slider
              min={0.6}
              max={1.6}
              step={0.1}
              value={[theme.spacing]}
              onValueChange={([val]) => updateTheme({ spacing: Math.round(val * 10) / 10 })}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground tabular-nums w-6 text-right">
              {theme.spacing.toFixed(1)}x
            </span>
          </div>
        </div>
      </CollapsibleSection>

      {/* ---- Template Section ---- */}
      {onTemplateChange && (
        <CollapsibleSection
          title="Template"
          icon={<Layout className="size-3.5" />}
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-2">
            {templateRegistry.map((tmpl) => {
              const isSelected = templateId === tmpl.id
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => onTemplateChange?.(tmpl.id)}
                  className={`group relative rounded-md border overflow-hidden transition-all text-left ${
                    isSelected
                      ? 'border-foreground ring-1 ring-foreground'
                      : 'border-border hover:border-muted-foreground cursor-pointer'
                  }`}
                >
                  <div className="aspect-[8.5/11] bg-muted overflow-hidden relative">
                    <TemplateThumbnail template={tmpl} />
                  </div>
                  <div className="px-2 py-1.5">
                    <div className="text-[11px] font-medium text-foreground truncate">
                      {tmpl.name}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CollapsibleSection>
      )}

    </div>
  )

  if (embedded) return content

  return (
    <aside className="w-72 shrink-0 border-l border-border bg-background flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-11 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold">Design</h2>
      </div>
      {content}
    </aside>
  )
}
