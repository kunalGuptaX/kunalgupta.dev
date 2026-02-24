'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FileText, MoreHorizontal, Pencil, Trash2, Copy, Clock } from 'lucide-react'
import { storage } from './storage'
import { defaultResumeDataV2 } from './types/resume'
import { computeInitialPreferences } from './config/compute-preferences'
import type { ResumeDocument } from './types'
import type { ResumeDataV2 } from './types/resume'
import { OnboardingWizard } from './onboarding-wizard'
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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ---- Resume Card ---- */
function ResumeCard({
  doc,
  selected,
  onOpen,
  onClick,
  onContextMenu,
  onRename,
  onDuplicate,
  onDelete,
}: {
  doc: ResumeDocument
  selected: boolean
  onOpen: () => void
  onClick: (e: React.MouseEvent) => void
  onContextMenu: (e: React.MouseEvent) => void
  onRename: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const data = doc.data as ResumeDataV2
  const displayName = data.basics?.name ?? ''
  const displayLabel = data.basics?.label ?? ''
  const displaySummary = data.basics?.summary ?? ''
  const workEntries = data.work ?? []

  const initial = displayName
    ? displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : doc.title.slice(0, 2).toUpperCase()

  return (
    <div className="group relative">
      <button
        onClick={onClick}
        onDoubleClick={onOpen}
        onContextMenu={onContextMenu}
        className={`w-full text-left rounded-lg border overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500 ${
          selected
            ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20'
            : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:shadow-lg'
        }`}
      >
        {/* Preview area */}
        <div className="aspect-[8.5/11] bg-zinc-800/80 flex items-center justify-center relative">
          {selected && (
            <div className="absolute top-2 left-2 z-10 size-5 rounded bg-blue-500 flex items-center justify-center">
              <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {displayName ? (
            <div className="w-[85%] p-3 text-left">
              <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider truncate">
                {displayName}
              </div>
              {displayLabel && (
                <div className="text-[8px] text-zinc-500 mt-0.5 truncate">{displayLabel}</div>
              )}
              <div className="mt-2 h-px bg-zinc-700" />
              {displaySummary && (
                <div className="text-[6px] text-zinc-600 mt-1.5 line-clamp-3 leading-relaxed">
                  {displaySummary}
                </div>
              )}
              {workEntries.length > 0 && (
                <div className="mt-1.5">
                  <div className="text-[7px] font-semibold text-zinc-500 uppercase tracking-wide">
                    Experience
                  </div>
                  {workEntries.slice(0, 2).map((entry, i) => (
                    <div key={i} className="text-[6px] text-zinc-600 mt-0.5 truncate">
                      {entry.position} - {entry.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="size-14 rounded-full bg-zinc-700/50 flex items-center justify-center text-lg font-bold text-zinc-500">
              {initial}
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="p-3">
          <h3 className="font-medium text-sm text-white truncate">{doc.title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="size-3 text-zinc-600" />
            <span className="text-[11px] text-zinc-500">{timeAgo(doc.updatedAt)}</span>
          </div>
        </div>
      </button>

      {/* Context menu trigger */}
      <div ref={menuRef} className="absolute top-2 right-2 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o) }}
          className="p-1.5 rounded-md bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="size-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-zinc-700 bg-zinc-800 shadow-lg overflow-hidden">
            <button
              onClick={(e) => { e.stopPropagation(); onRename(); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              <Pencil className="size-3.5" /> Rename
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              <Copy className="size-3.5" /> Duplicate
            </button>
            <div className="h-px bg-zinc-700 mx-2" />
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
            >
              <Trash2 className="size-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---- Main Dashboard ---- */
export function TemplateGallery() {
  const router = useRouter()
  const [documents, setDocuments] = useState<ResumeDocument[]>([])
  const [ready, setReady] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [renamingDoc, setRenamingDoc] = useState<ResumeDocument | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deletingDoc, setDeletingDoc] = useState<ResumeDocument | null>(null)

  // Multi-select
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [idsToDelete, setIdsToDelete] = useState<Set<string>>(new Set())

  // Right-click context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    storage.migrateOldStorage()
    setDocuments(storage.listDocuments())
    setReady(true)
  }, [])

  const refresh = () => {
    setDocuments(storage.listDocuments())
    setSelectedIds(new Set())
  }

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return
    const handler = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [contextMenu])

  // Close context menu on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null)
        setSelectedIds(new Set())
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleCardClick = useCallback((doc: ResumeDocument, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      // Toggle selection
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(doc.id)) {
          next.delete(doc.id)
        } else {
          next.add(doc.id)
        }
        return next
      })
    } else {
      // Single click without modifier — clear selection and select only this
      setSelectedIds(new Set([doc.id]))
    }
  }, [])

  const handleCardContextMenu = useCallback((doc: ResumeDocument, e: React.MouseEvent) => {
    e.preventDefault()
    // If right-clicking a non-selected card, select only that card
    if (!selectedIds.has(doc.id)) {
      setSelectedIds(new Set([doc.id]))
    }
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [selectedIds])

  // Click on empty area clears selection
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    // Only clear if clicking the grid background, not a card
    if ((e.target as Element).closest('[data-resume-card]')) return
    setSelectedIds(new Set())
    setContextMenu(null)
  }, [])

  const handleCreateNew = ({
    countryCode,
    jobCategory,
    seniority,
    templateId,
    importedData,
  }: {
    countryCode: string
    jobCategory: string
    seniority: string
    templateId: string
    importedData?: ResumeDataV2
  }) => {
    const data = importedData ?? {
      ...defaultResumeDataV2,
      meta: {
        ...defaultResumeDataV2.meta,
        countryCode,
        jobCategory,
        seniority,
      },
    }

    // Compute initial preferences from country + job category + seniority
    const computed = computeInitialPreferences(countryCode || 'US', jobCategory || 'general', seniority || 'mid')
    const doc = storage.createDocument(templateId, 'Untitled', data, {
      sectionOrder: computed.sectionOrder,
      sectionVisibility: computed.sectionVisibility,
      sectionLabels: computed.sectionLabels,
    })
    setWizardOpen(false)
    router.push(`/resume-builder/edit?id=${doc.id}`)
  }

  const handleOpen = (doc: ResumeDocument) => {
    router.push(`/resume-builder/edit?id=${doc.id}`)
  }

  const handleRename = (doc: ResumeDocument) => {
    setRenamingDoc(doc)
    setRenameValue(doc.title)
    setContextMenu(null)
  }

  const confirmRename = () => {
    if (renamingDoc && renameValue.trim()) {
      storage.renameDocument(renamingDoc.id, renameValue.trim())
      refresh()
    }
    setRenamingDoc(null)
  }

  const handleDuplicate = (doc: ResumeDocument) => {
    storage.duplicateDocument(doc.id)
    refresh()
    setContextMenu(null)
  }

  const handleDelete = (doc: ResumeDocument) => {
    setDeletingDoc(doc)
    setContextMenu(null)
  }

  const confirmDelete = () => {
    if (deletingDoc) {
      storage.deleteDocument(deletingDoc.id)
      refresh()
    }
    setDeletingDoc(null)
  }

  const handleDeleteSelected = () => {
    setIdsToDelete(new Set(selectedIds))
    setContextMenu(null)
  }

  const confirmDeleteMultiple = () => {
    idsToDelete.forEach((id) => storage.deleteDocument(id))
    setIdsToDelete(new Set())
    refresh()
  }

  if (!ready) return null

  const selectedCount = selectedIds.size

  return (
    <div className="min-h-screen bg-background text-foreground" onClick={handleBackgroundClick}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Resume Builder
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {selectedCount > 0
                ? `${selectedCount} resume${selectedCount > 1 ? 's' : ''} selected`
                : 'Create, edit, and manage your resumes'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedCount > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="size-4" />
                Delete ({selectedCount})
              </button>
            )}
            <button
              onClick={() => setWizardOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <Plus className="size-4" />
              New Resume
            </button>
          </div>
        </div>

        {/* Resume grid */}
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-5">
              <FileText className="size-7 text-zinc-500" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">No resumes yet</h2>
            <p className="text-sm text-zinc-400 max-w-sm mb-6">
              Create your first resume by choosing a template to get started.
            </p>
            <button
              onClick={() => setWizardOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <Plus className="size-4" />
              Create Resume
            </button>
          </div>
        ) : (
          <>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-4">
              Recent ({documents.length})
              {documents.length > 0 && (
                <span className="ml-3 normal-case tracking-normal text-zinc-600">
                  Ctrl+click to select multiple &middot; Right-click for options
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {/* New resume card */}
              <button
                onClick={() => setWizardOpen(true)}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900/30 aspect-[8.5/14] transition-all hover:border-zinc-500 hover:bg-zinc-800/30 group"
              >
                <div className="size-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-zinc-700 transition-colors">
                  <Plus className="size-5 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 font-medium transition-colors">
                  New resume
                </span>
              </button>

              {/* Existing resume cards */}
              {documents.map((doc) => (
                <div key={doc.id} data-resume-card>
                  <ResumeCard
                    doc={doc}
                    selected={selectedIds.has(doc.id)}
                    onOpen={() => handleOpen(doc)}
                    onClick={(e) => handleCardClick(doc, e)}
                    onContextMenu={(e) => handleCardContextMenu(doc, e)}
                    onRename={() => handleRename(doc)}
                    onDuplicate={() => handleDuplicate(doc)}
                    onDelete={() => handleDelete(doc)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right-click context menu */}
      {contextMenu && selectedCount > 0 && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 w-48 rounded-md border border-zinc-700 bg-zinc-800 shadow-xl overflow-hidden"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {selectedCount === 1 && (
            <>
              {(() => {
                const doc = documents.find((d) => selectedIds.has(d.id))
                if (!doc) return null
                return (
                  <>
                    <button
                      onClick={() => handleOpen(doc)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      <FileText className="size-3.5" /> Open
                    </button>
                    <button
                      onClick={() => handleRename(doc)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      <Pencil className="size-3.5" /> Rename
                    </button>
                    <button
                      onClick={() => { handleDuplicate(doc); setContextMenu(null) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      <Copy className="size-3.5" /> Duplicate
                    </button>
                    <div className="h-px bg-zinc-700 mx-2" />
                  </>
                )
              })()}
            </>
          )}
          <button
            onClick={handleDeleteSelected}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
          >
            <Trash2 className="size-3.5" />
            Delete{selectedCount > 1 ? ` (${selectedCount})` : ''}
          </button>
        </div>
      )}

      {/* Onboarding wizard (replaces old template picker modal) */}
      <OnboardingWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleCreateNew}
      />

      {/* Rename dialog */}
      <AlertDialog open={!!renamingDoc} onOpenChange={(open) => { if (!open) setRenamingDoc(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename resume</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for this resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') confirmRename() }}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRename}>Rename</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Single delete confirmation */}
      <AlertDialog open={!!deletingDoc} onOpenChange={(open) => { if (!open) setDeletingDoc(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deletingDoc?.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this resume. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Multi-delete confirmation */}
      <AlertDialog open={idsToDelete.size > 0} onOpenChange={(open) => { if (!open) setIdsToDelete(new Set()) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {idsToDelete.size} resume{idsToDelete.size > 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {idsToDelete.size} resume{idsToDelete.size > 1 ? 's' : ''}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMultiple}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete {idsToDelete.size} resume{idsToDelete.size > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
