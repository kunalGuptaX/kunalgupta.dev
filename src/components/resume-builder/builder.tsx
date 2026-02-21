'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Download, Upload, FileJson, RotateCcw, Type, Space } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ResumeForm } from './form'
import { ResumePreview } from './preview'
import { ResumePreviewMinimal } from './preview-minimal'
import { defaultResumeData, emptyResumeData, type ResumeData } from './types'

const STORAGE_KEY = 'resume-builder-data'

function loadSavedData(): ResumeData {
  if (typeof window === 'undefined') return defaultResumeData
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ResumeData
  } catch {
    // ignore corrupt data
  }
  return defaultResumeData
}

function saveData(data: ResumeData) {
  try {
    // Don't persist empty data — lets defaultResumeData show on next load
    const hasContent = data.name || data.title || data.email || data.phone
      || data.location || data.linkedin || data.github || data.summary
      || data.skills.length > 0 || data.experience.length > 0
      || data.education.length > 0 || data.projects.length > 0
      || data.strengths.length > 0
    if (!hasContent) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage full or unavailable
  }
}

const A4_HEIGHT = 1123
const A4_WIDTH = 794
const PAGE_GAP = 24
const PAGE_PADDING_Y = 40
const PAGE_PADDING_X = 44
const CONTENT_HEIGHT = A4_HEIGHT - 2 * PAGE_PADDING_Y // usable content height per page

function PaginatedPreview({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(1)

  const measure = useCallback(() => {
    if (!contentRef.current) return

    // Reset break margins from previous pass
    const breakEls = contentRef.current.querySelectorAll<HTMLElement>('[data-break-avoid]')
    breakEls.forEach((el) => {
      el.style.marginTop = ''
    })

    // Iteratively fix elements that straddle page boundaries
    for (let iter = 0; iter < 15; iter++) {
      let adjusted = false
      const elements = contentRef.current.querySelectorAll<HTMLElement>('[data-break-avoid]')
      const containerTop = contentRef.current.getBoundingClientRect().top

      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        const elTop = rect.top - containerTop
        const elBottom = rect.bottom - containerTop
        const elHeight = rect.height

        // Skip elements taller than a page or empty/hidden elements
        if (elHeight > CONTENT_HEIGHT || elHeight === 0) continue

        const startPage = Math.floor(elTop / CONTENT_HEIGHT)
        const endPage = Math.floor(Math.max(0, elBottom - 1) / CONTENT_HEIGHT)

        if (startPage !== endPage && elTop > 0) {
          const nextPageStart = (startPage + 1) * CONTENT_HEIGHT
          const pushDown = nextPageStart - elTop
          el.style.marginTop = `${pushDown}px`
          adjusted = true
          break // restart since positions changed
        }
      }

      if (!adjusted) break
    }

    // Update page count
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

  // Also re-measure on every render (form changes)
  useEffect(() => {
    const id = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(id)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${PAGE_GAP}px` }}>
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

type Template = 'classic' | 'minimal'

const templates: { id: Template; label: string; description: string }[] = [
  { id: 'classic', label: 'Classic', description: 'Two-column layout with sidebar' },
  { id: 'minimal', label: 'Minimal', description: 'Clean single-column layout' },
]

type ResumeBuilderProps = {
  prefillData?: ResumeData
  autoDownload?: boolean
  fontClassName?: string
}

export function ResumeBuilder({ prefillData, autoDownload, fontClassName = '' }: ResumeBuilderProps) {
  const [initialData, setInitialData] = useState<ResumeData | null>(null)

  useEffect(() => {
    if (prefillData) {
      setInitialData(prefillData)
    } else {
      setInitialData(loadSavedData())
    }
  }, [prefillData])

  if (!initialData) return null

  return <ResumeBuilderInner initialData={initialData} autoDownload={autoDownload} fontClassName={fontClassName} />
}

function ResumeBuilderInner({ initialData, autoDownload, fontClassName = '' }: { initialData: ResumeData; autoDownload?: boolean; fontClassName?: string }) {
  const form = useForm<ResumeData>({ defaultValues: initialData })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [template, setTemplate] = useState<Template>('classic')
  const [fontSizeOffset, setFontSizeOffset] = useState(0)
  const [spacingScale, setSpacingScale] = useState(1.0)

  // Auto-save to localStorage on form changes
  useEffect(() => {
    const sub = form.watch((values) => {
      saveData(values as ResumeData)
    })
    return () => sub.unsubscribe()
  }, [form])

  // Auto-download PDF when requested via query param
  useEffect(() => {
    if (autoDownload) {
      // Wait for fonts to finish loading before triggering print
      document.fonts.ready.then(() => {
        setTimeout(() => window.print(), 300)
      })
    }
  }, [autoDownload])

  const handlePrint = () => {
    window.print()
  }

  const handleExportJson = () => {
    const data = form.getValues()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.name.toLowerCase().replace(/\s+/g, '_')}_resume.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ResumeData
        form.reset(data)
        saveData(data)
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    form.reset(emptyResumeData)
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const PreviewComponent = template === 'minimal' ? ResumePreviewMinimal : ResumePreview

  return (
    <FormProvider {...form}>
      <div className="print:hidden flex items-center justify-between border-b border-border px-6 py-3">
        <h1 className="text-lg font-semibold">Resume Builder</h1>
        <div className="flex items-center gap-2">
          {/* Template switcher */}
          <div className="flex items-center rounded-md border border-border">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  template === t.id
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                } ${t.id === 'classic' ? 'rounded-l-md' : 'rounded-r-md'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Font size slider */}
          <div className="flex items-center gap-2">
            <Type className="size-3.5 text-muted-foreground shrink-0" />
            <Slider
              min={-3}
              max={4}
              step={0.5}
              value={[fontSizeOffset]}
              onValueChange={([v]) => setFontSizeOffset(v)}
              className="w-20"
            />
          </div>

          {/* Spacing slider */}
          <div className="flex items-center gap-2">
            <Space className="size-3.5 text-muted-foreground shrink-0" />
            <Slider
              min={0.6}
              max={1.6}
              step={0.1}
              value={[spacingScale]}
              onValueChange={([v]) => setSpacingScale(+(v.toFixed(1)))}
              className="w-20"
            />
          </div>

          <div className="mx-1 h-6 w-px bg-border" />

          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload />
            Import JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportJson}
          />
          <Button variant="outline" size="sm" onClick={handleExportJson}>
            <FileJson />
            Export JSON
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Download />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="print:hidden flex flex-1 overflow-hidden">
        <div className="w-1/2 overflow-y-auto border-r border-border p-6">
          <ResumeForm />
        </div>
        <div className="w-1/2 overflow-y-auto bg-zinc-900 p-8 flex justify-center">
          <div
            style={{
              transform: 'scale(var(--preview-scale, 0.55))',
              transformOrigin: 'top center',
            }}
          >
            <PaginatedPreview className={fontClassName}>
              <PreviewComponent fontSizeOffset={fontSizeOffset} spacingScale={spacingScale} />
            </PaginatedPreview>
          </div>
        </div>
      </div>

      {/* Print-only: full-size preview */}
      <div style={{ display: 'none' }} className="print-resume-only">
        <div className={`resume-preview ${fontClassName}`} style={{ width: '794px' }}>
          <PreviewComponent fontSizeOffset={fontSizeOffset} spacingScale={spacingScale} />
        </div>
      </div>
    </FormProvider>
  )
}
