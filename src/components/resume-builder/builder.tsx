'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Undo2, Redo2, PanelLeft, Menu, Upload } from 'lucide-react'
import { storage, ensureV2 } from './storage'
import { importJsonResume } from './import/json-resume-import'
import {
  type ResumeDataV2,
  type ThemeConfig,
  DEFAULT_THEME,
  emptyResumeDataV2,
  defaultResumeDataV2,
} from './types'
import { DEFAULT_SECTION_ORDER_V2, defaultSectionVisibility } from './types/resume'
import type { SectionId } from './types/resume'
import { getTemplate } from './templates/registry'
import { ClassicLayout } from './templates/layouts/classic'
import { MinimalLayout } from './templates/layouts/minimal'
import { ProfessionalLayout } from './templates/layouts/professional'
import { ModernLayout } from './templates/layouts/modern'
import { ExecutiveLayout } from './templates/layouts/executive'
import { CompactLayout } from './templates/layouts/compact'
import { BoldLayout } from './templates/layouts/bold'
import { TimelineLayout } from './templates/layouts/timeline'
import { useUndo } from './hooks/use-undo'
import { DesignPanel } from './design-panel'
import { FormPanel } from './form-panel'
import { ExportMenu } from './export/export-menu'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/* ── A4 page constants ── */
const A4_HEIGHT = 1123
const A4_WIDTH = 794
const PAGE_GAP = 24
const PAGE_PADDING_Y = 40
const PAGE_PADDING_X = 44
const CONTENT_HEIGHT = A4_HEIGHT - 2 * PAGE_PADDING_Y

/* ── PaginatedPreview ── */
function PaginatedPreview({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(1)

  const measure = useCallback(() => {
    if (!contentRef.current || !wrapperRef.current) return

    // Reset break margins across ALL page copies (not just page 0)
    const allBreakEls = wrapperRef.current.querySelectorAll<HTMLElement>('[data-break-avoid]')
    allBreakEls.forEach((el) => {
      el.style.marginTop = ''
    })

    // Iteratively fix elements that straddle page boundaries (on page 0)
    for (let iter = 0; iter < 15; iter++) {
      let adjusted = false
      const elements = contentRef.current.querySelectorAll<HTMLElement>('[data-break-avoid]')
      const containerTop = contentRef.current.getBoundingClientRect().top

      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        const elTop = rect.top - containerTop
        const elBottom = rect.bottom - containerTop
        const elHeight = rect.height

        if (elHeight > CONTENT_HEIGHT || elHeight === 0) continue

        const startPage = Math.floor(elTop / CONTENT_HEIGHT)
        const endPage = Math.floor(Math.max(0, elBottom - 1) / CONTENT_HEIGHT)

        if (startPage !== endPage && elTop > 0) {
          const nextPageStart = (startPage + 1) * CONTENT_HEIGHT
          const pushDown = nextPageStart - elTop
          el.style.marginTop = `${pushDown}px`
          adjusted = true
          break
        }
      }

      if (!adjusted) break
    }

    // Sync break margins from page 0 to all other page copies
    const page0Els = contentRef.current.querySelectorAll<HTMLElement>('[data-break-avoid]')
    const margins = Array.from(page0Els).map((el) => el.style.marginTop)

    const pageContents = wrapperRef.current.querySelectorAll<HTMLElement>('[data-page-content]')
    pageContents.forEach((pageContent) => {
      if (pageContent === contentRef.current) return
      const els = pageContent.querySelectorAll<HTMLElement>('[data-break-avoid]')
      els.forEach((el, i) => {
        el.style.marginTop = margins[i] ?? ''
      })
    })

    const h = contentRef.current.scrollHeight
    setPageCount(Math.max(1, Math.ceil(h / CONTENT_HEIGHT)))
  }, [])

  useEffect(() => {
    measure()
    const observer = new MutationObserver(measure)
    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true, characterData: true })
    }
    return () => observer.disconnect()
  }, [measure])

  useEffect(() => {
    const id = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(id)
  })

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexDirection: 'column', gap: `${PAGE_GAP}px` }}>
      {Array.from({ length: pageCount }, (_, i) => (
        <div
          key={i}
          className="shadow-2xl"
          style={{
            width: `${A4_WIDTH}px`,
            height: `${A4_HEIGHT}px`,
            overflow: 'hidden',
            backgroundColor: '#fff',
            borderRadius: '2px',
            padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${CONTENT_HEIGHT}px`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              ref={i === 0 ? contentRef : undefined}
              data-page-content
              className={className}
              style={{
                position: 'absolute',
                top: `${-i * CONTENT_HEIGHT}px`,
                left: 0,
                width: '100%',
                minHeight: `${CONTENT_HEIGHT}px`,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Layout component map ── */
const layoutComponents = {
  classic: ClassicLayout,
  minimal: MinimalLayout,
  professional: ProfessionalLayout,
  modern: ModernLayout,
  executive: ExecutiveLayout,
  compact: CompactLayout,
  bold: BoldLayout,
  timeline: TimelineLayout,
} as const

/* ── ResumeEditor props ── */
type ResumeEditorProps = {
  resumeId: string
  initialTemplateId?: string
  prefillData?: ResumeDataV2
  autoDownload?: boolean
  fontClassName?: string
}

export function ResumeEditor({
  resumeId,
  initialTemplateId,
  prefillData,
  autoDownload,
  fontClassName = '',
}: ResumeEditorProps) {
  const [ready, setReady] = useState(false)
  const {
    value: data, set: setData,
    undo, redo, canUndo, canRedo,
    reset: resetHistory,
  } = useUndo<ResumeDataV2>(emptyResumeDataV2, { bindKeyboard: true })
  const [templateId, setTemplateId] = useState('classic')
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME)
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>([...DEFAULT_SECTION_ORDER_V2])
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({ ...defaultSectionVisibility })
  const [sectionLabels, setSectionLabels] = useState<Record<string, string>>({})
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1.2)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const fileMenuRef = useRef<HTMLDivElement>(null)
  const [pendingImport, setPendingImport] = useState<ResumeDataV2 | null>(null)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(520)
  const isResizing = useRef(false)
  const [resumeTitle, setResumeTitle] = useState('Untitled')
  const [editingTitle, setEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  /* ── On mount: load document from storage ── */
  useEffect(() => {
    storage.migrateOldStorage()

    const doc = storage.getDocument(resumeId)
    if (doc) {
      const savedData = prefillData ?? doc.data
      const prefs = doc.preferences

      const resolvedTemplateId = initialTemplateId && getTemplate(initialTemplateId)
        ? initialTemplateId
        : prefs.templateId

      const tmpl = getTemplate(resolvedTemplateId)

      resetHistory(savedData)
      setTemplateId(resolvedTemplateId)
      setTheme(tmpl?.defaultTheme ?? prefs.theme)
      setSectionOrder((prefs.sectionOrder ?? DEFAULT_SECTION_ORDER_V2) as SectionId[])
      setSectionVisibility(prefs.sectionVisibility ?? { ...defaultSectionVisibility })
      setSectionLabels(prefs.sectionLabels ?? {})
      setResumeTitle(doc.title)
    } else {
      // Document not found — create it in storage so auto-save works
      const savedData = prefillData ?? defaultResumeDataV2
      const resolvedTemplateId = initialTemplateId ?? 'classic'
      const tmpl = getTemplate(resolvedTemplateId)
      const now = new Date().toISOString()

      storage.saveDocument({
        id: resumeId,
        title: 'Untitled',
        templateId: resolvedTemplateId,
        data: savedData,
        preferences: {
          templateId: resolvedTemplateId,
          theme: tmpl?.defaultTheme ?? DEFAULT_THEME,
          sectionOrder: DEFAULT_SECTION_ORDER_V2 as SectionId[],
          hiddenSections: [],
          sectionVisibility: { ...defaultSectionVisibility },
          sectionLabels: {},
        },
        createdAt: now,
        updatedAt: now,
      })

      resetHistory(savedData)
      setTemplateId(resolvedTemplateId)
      if (tmpl) setTheme(tmpl.defaultTheme)
    }
    setReady(true)
  }, [resumeId, initialTemplateId, prefillData, resetHistory])

  /* ── Auto-save document to localStorage ── */
  useEffect(() => {
    if (!ready) return
    const doc = storage.getDocument(resumeId)
    if (!doc) return
    storage.saveDocument({
      ...doc,
      title: resumeTitle,
      templateId,
      data,
      preferences: {
        templateId,
        theme,
        sectionOrder,
        hiddenSections: [],
        sectionVisibility,
        sectionLabels,
        resumeTitle,
      },
    })
  }, [resumeId, data, templateId, theme, sectionOrder, sectionVisibility, sectionLabels, resumeTitle, ready])

  /* ── Fit-to-container zoom (max 1.2) ── */
  useEffect(() => {
    const el = previewContainerRef.current
    if (!el) return
    const padding = 48
    const update = () => {
      const available = el.clientWidth - padding
      setZoom(Math.min(1.2, Math.max(0.3, available / A4_WIDTH)))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ready])

  /* ── Auto-download PDF when requested via query param ── */
  useEffect(() => {
    if (autoDownload && ready) {
      document.fonts.ready.then(() => {
        setTimeout(() => window.print(), 300)
      })
    }
  }, [autoDownload, ready])

  /* ── Close dropdown menus on outside click ── */
  useEffect(() => {
    if (!fileMenuOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      const inDialog = (target as Element).closest?.('[role="alertdialog"], [data-radix-alert-dialog-overlay]')
      if (inDialog) return

      if (fileMenuOpen && fileMenuRef.current && !fileMenuRef.current.contains(target)) {
        setFileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [fileMenuOpen])

  /* ── Sidebar resize ── */
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    const startX = e.clientX
    const startWidth = sidebarWidth

    const onMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return
      const newWidth = Math.min(800, Math.max(360, startWidth + ev.clientX - startX))
      setSidebarWidth(newWidth)
    }
    const onMouseUp = () => {
      isResizing.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [sidebarWidth])

  /* ── Handlers ── */
  const handlePrint = () => {
    window.print()
  }

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        // Try the validated JSON Resume importer first (escapes HTML in all fields),
        // fall back to ensureV2 for our internal format (already sanitized at render)
        let imported: ResumeDataV2
        try {
          imported = importJsonResume(text)
        } catch {
          const parsed = JSON.parse(text)
          imported = ensureV2(parsed)
        }
        setPendingImport(imported)
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const confirmImport = () => {
    if (pendingImport) {
      setData(pendingImport)
      setPendingImport(null)
    }
  }

  const handleTemplateChange = (newTemplateId: string) => {
    const tmpl = getTemplate(newTemplateId)
    if (tmpl) {
      setTemplateId(newTemplateId)
      setTheme(tmpl.defaultTheme)
    }
  }

  const handleSectionVisibilityChange = (sectionId: string, visible: boolean) => {
    setSectionVisibility((prev) => ({ ...prev, [sectionId]: visible }))
  }

  const handleSectionLabelChange = (sectionId: string, label: string) => {
    setSectionLabels((prev) => ({ ...prev, [sectionId]: label }))
  }

  /* ── Resolve layout component ── */
  const currentTemplate = getTemplate(templateId)
  const layoutKey = currentTemplate?.layout ?? 'classic'
  const LayoutComponent = layoutComponents[layoutKey as keyof typeof layoutComponents] ?? ClassicLayout

  // Compute visible section order for the preview
  const visibleSections = sectionOrder.filter((s) => sectionVisibility[s] !== false)

  if (!ready) return null

  return (
    <TooltipProvider delayDuration={300}>
      <div className="print:hidden fixed inset-0 z-[60] flex bg-background">
        {/* ── Left Panel: Form ── */}
        <aside
          className="shrink-0 border-r border-border bg-background flex flex-col overflow-hidden"
          style={{ width: leftCollapsed ? '48px' : `${sidebarWidth}px`, transition: leftCollapsed ? 'width 200ms' : undefined }}
        >
          {/* Header */}
          <div className="flex items-center px-2 h-11 border-b border-border min-w-0 shrink-0">
            {leftCollapsed ? (
              <button
                onClick={() => setLeftCollapsed(false)}
                className="mx-auto flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Expand sidebar"
              >
                <PanelLeft className="size-4" />
              </button>
            ) : (
              <>
                <Link
                  href="/resume-builder/dashboard"
                  className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
                >
                  <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-sm font-semibold truncate ml-2">Resume Builder</h1>
                <button
                  onClick={() => setLeftCollapsed(true)}
                  className="ml-auto flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
                  title="Collapse sidebar"
                >
                  <PanelLeft className="size-4" />
                </button>
              </>
            )}
          </div>

          {leftCollapsed ? (
            <div className="flex flex-col items-center gap-1 pt-2">
              <button
                onClick={() => setLeftCollapsed(false)}
                className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Expand form"
              >
                <PanelLeft className="size-4" />
              </button>
            </div>
          ) : (
            <FormPanel
              data={data}
              onChange={setData}
              sectionOrder={sectionOrder}
              onSectionOrderChange={setSectionOrder}
              sectionVisibility={sectionVisibility}
              onSectionVisibilityChange={handleSectionVisibilityChange}
              sectionLabels={sectionLabels}
              onSectionLabelChange={handleSectionLabelChange}
              countryCode={data.meta.countryCode}
              jobCategory={data.meta.jobCategory}
              seniority={data.meta.seniority ?? 'mid'}
            />
          )}
        </aside>

        {/* ── Resize Handle ── */}
        {!leftCollapsed && (
          <div
            onMouseDown={handleResizeStart}
            className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-blue-500/40 active:bg-blue-500/60 transition-colors"
            title="Drag to resize sidebar"
          />
        )}

        {/* ── Center Preview ── */}
        <div className="flex-1 relative min-w-0 bg-zinc-900 flex flex-col">
          {/* Top bar */}
          <div className="relative flex items-center px-4 h-11 border-b border-zinc-700/50 bg-zinc-800/60 shrink-0">
            {/* Left: file menu + undo/redo */}
            <div className="flex items-center gap-1">
              {/* File menu */}
              <div ref={fileMenuRef} className="relative">
                <button
                  onClick={() => setFileMenuOpen((o) => !o)}
                  className="rounded-md p-2 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                  title="File"
                >
                  <Menu className="size-4" />
                </button>
                {fileMenuOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-52 rounded-md border border-border bg-popover shadow-lg overflow-hidden z-50">
                    <div className="py-1">
                      <button
                        onClick={() => { fileInputRef.current?.click(); setFileMenuOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent transition-colors"
                      >
                        <Upload className="size-4 text-muted-foreground" />
                        Import JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mx-0.5 h-4 w-px bg-zinc-700" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={undo}
                    disabled={!canUndo}
                    className={`rounded-md p-2 transition-colors ${
                      canUndo
                        ? 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                        : 'text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <Undo2 className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Undo (Cmd+Z)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={redo}
                    disabled={!canRedo}
                    className={`rounded-md p-2 transition-colors ${
                      canRedo
                        ? 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                        : 'text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <Redo2 className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Redo (Cmd+Shift+Z)</TooltipContent>
              </Tooltip>
            </div>

            {/* Center: editable resume title */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
              {editingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  onBlur={() => {
                    if (!resumeTitle.trim()) setResumeTitle('Untitled')
                    setEditingTitle(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (!resumeTitle.trim()) setResumeTitle('Untitled')
                      setEditingTitle(false)
                    }
                    if (e.key === 'Escape') setEditingTitle(false)
                  }}
                  className="bg-zinc-700 text-sm text-zinc-200 px-2 py-0.5 rounded border border-zinc-500 outline-none focus:border-zinc-400 w-40 text-center"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => {
                    setEditingTitle(true)
                    setTimeout(() => titleInputRef.current?.select(), 0)
                  }}
                  className="group flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded px-2 py-0.5 hover:bg-zinc-700/50"
                  title="Click to rename"
                >
                  <span className="truncate" style={{ maxWidth: `${sidebarWidth - 200}px` }}>{resumeTitle}</span>
                </button>
              )}
            </div>

            {/* Right: export menu */}
            <div className="ml-auto flex items-center gap-2">
              <ExportMenu data={data} onPrint={handlePrint} />
            </div>
          </div>

          {/* Scrollable preview content */}
          <div ref={previewContainerRef} className="flex-1 overflow-y-auto">
            <div className="flex justify-center py-6 px-6">
              <div style={{ zoom }}>
                <PaginatedPreview className={fontClassName}>
                  <LayoutComponent
                    data={data}
                    theme={theme}
                    isEditing={false}
                    sectionOrder={visibleSections}
                    hiddenSections={[]}
                    onDataChange={() => {}}
                    onSectionOrderChange={() => {}}
                    sectionLabels={sectionLabels}
                  />
                </PaginatedPreview>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Design ── */}
        <DesignPanel
          theme={theme}
          onThemeChange={setTheme}
          templateId={templateId}
          onTemplateChange={handleTemplateChange}
        />
      </div>

      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportJson}
      />

      {/* Import confirmation dialog */}
      <AlertDialog open={!!pendingImport} onOpenChange={(open) => { if (!open) setPendingImport(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import JSON?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all your current resume data with the imported file. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>
              Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Print-only: full-size preview ── */}
      <div style={{ display: 'none' }} className="print-resume-only">
        <div className={`resume-preview ${fontClassName}`} style={{ width: '794px' }}>
          <LayoutComponent
            data={data}
            theme={theme}
            isEditing={false}
            sectionOrder={visibleSections}
            hiddenSections={[]}
            onDataChange={() => {}}
            onSectionOrderChange={() => {}}
            sectionLabels={sectionLabels}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
