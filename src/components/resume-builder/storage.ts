import type { ResumeData, ResumeDocument, UserPreferences, ResumeDataV2 } from './types'
import { DEFAULT_THEME, defaultResumeData } from './types'
import { emptyResumeDataV2, DEFAULT_SECTION_ORDER_V2, defaultSectionVisibility } from './types/resume'

const KEYS = {
  documents: 'resume-builder:documents',
  // Legacy keys (for migration)
  data: 'resume-builder:data',
  preferences: 'resume-builder:preferences',
} as const

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function defaultPreferences(templateId = 'classic'): UserPreferences {
  return {
    templateId,
    theme: DEFAULT_THEME,
    sectionOrder: [...DEFAULT_SECTION_ORDER_V2],
    hiddenSections: [],
    sectionVisibility: { ...defaultSectionVisibility },
  }
}

// ── Helpers for migrating highlights → HTML ──

function highlightsToHtml(highlights: string[], summary?: string): string {
  const parts: string[] = []
  if (summary) parts.push(`<p>${escHtml(summary)}</p>`)
  if (highlights.length > 0) {
    parts.push('<ul>' + highlights.map((h) => `<li>${escHtml(h)}</li>`).join('') + '</ul>')
  }
  return parts.join('')
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ── V1 → V2 Data Migration ──

export function migrateV1toV2(old: ResumeData): ResumeDataV2 {
  const profiles: ResumeDataV2['basics']['profiles'] = []
  if (old.linkedin) {
    const username = old.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')
    profiles.push({ network: 'LinkedIn', username, url: old.linkedin })
  }
  if (old.github) {
    const username = old.github.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')
    profiles.push({ network: 'GitHub', username, url: old.github })
  }

  return {
    schemaVersion: 2,
    basics: {
      name: old.name,
      label: old.title,
      email: old.email,
      phone: old.phone,
      url: '',
      summary: old.summary,
      location: {
        address: '',
        city: old.location,
        region: '',
        postalCode: '',
        countryCode: 'US',
      },
      profiles,
    },
    work: old.experience.map((exp) => ({
      name: exp.company,
      position: exp.role,
      url: '',
      startDate: exp.startDate,
      endDate: exp.endDate,
      summary: highlightsToHtml(exp.bullets),
      location: exp.location,
    })),
    education: old.education.map((edu) => ({
      institution: edu.school,
      area: edu.degree.includes(' ') ? edu.degree.split(' ').slice(1).join(' ') : '',
      studyType: edu.degree.includes(' ') ? edu.degree.split(' ')[0]! : edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      score: '',
      url: '',
      courses: [],
    })),
    skills: old.skills,
    languages: [],
    projects: old.projects.map((proj) => ({
      name: proj.name,
      description: proj.description,
      keywords: proj.techStack,
      startDate: '',
      endDate: '',
      url: proj.liveUrl ?? proj.sourceUrl ?? '',
      roles: [],
      entity: '',
      type: '',
    })),
    volunteer: [],
    awards: [],
    certificates: [],
    publications: [],
    interests: old.strengths.length > 0
      ? [{ name: 'Strengths', keywords: old.strengths }]
      : [],
    references: [],
    meta: {
      canonical: '',
      version: '1.0.0',
      lastModified: new Date().toISOString(),
      countryCode: 'US',
      jobCategory: 'general',
      seniority: 'mid',
    },
  }
}

// ── Old V2 → Current V2 Migration (grouped skills → flat, highlights → HTML) ──

type OldV2Work = { name: string; position: string; url: string; startDate: string; endDate: string; summary: string; highlights?: string[]; location: string }
type OldV2Volunteer = { organization: string; position: string; url: string; startDate: string; endDate: string; summary: string; highlights?: string[] }
type OldV2Project = { name: string; description: string; highlights?: string[]; keywords: string[]; startDate: string; endDate: string; url: string; roles: string[]; entity: string; type: string }
type OldV2Skill = { name: string; level: string; keywords: string[] }

function migrateOldV2(data: ResumeDataV2): ResumeDataV2 {
  let changed = false

  // Migrate grouped skills → flat strings
  let skills = data.skills
  if (skills.length > 0 && typeof skills[0] === 'object' && skills[0] !== null) {
    const grouped = skills as unknown as OldV2Skill[]
    skills = grouped.flatMap((g) => {
      // If the group has keywords, use them. If only name, use name.
      if (g.keywords && g.keywords.length > 0) return g.keywords
      if (g.name) return [g.name]
      return []
    })
    changed = true
  }

  // Migrate work highlights → HTML summary
  const work = (data.work as unknown as OldV2Work[]).map((w) => {
    if (w.highlights && w.highlights.length > 0) {
      changed = true
      return { ...w, summary: highlightsToHtml(w.highlights, w.summary), highlights: undefined } as unknown as ResumeDataV2['work'][0]
    }
    const { highlights: _, ...rest } = w as OldV2Work & { highlights?: string[] }
    return rest as unknown as ResumeDataV2['work'][0]
  })

  // Migrate volunteer highlights → HTML summary
  const volunteer = (data.volunteer as unknown as OldV2Volunteer[]).map((v) => {
    if (v.highlights && v.highlights.length > 0) {
      changed = true
      return { ...v, summary: highlightsToHtml(v.highlights, v.summary), highlights: undefined } as unknown as ResumeDataV2['volunteer'][0]
    }
    const { highlights: _, ...rest } = v as OldV2Volunteer & { highlights?: string[] }
    return rest as unknown as ResumeDataV2['volunteer'][0]
  })

  // Migrate project highlights → HTML description
  const projects = (data.projects as unknown as OldV2Project[]).map((p) => {
    if (p.highlights && p.highlights.length > 0) {
      changed = true
      return { ...p, description: highlightsToHtml(p.highlights, p.description), highlights: undefined } as unknown as ResumeDataV2['projects'][0]
    }
    const { highlights: _, ...rest } = p as OldV2Project & { highlights?: string[] }
    return rest as unknown as ResumeDataV2['projects'][0]
  })

  if (!changed) return data
  return { ...data, skills, work, volunteer, projects }
}

/** Check if data is V1 format (lacks schemaVersion) */
function isV1Data(data: unknown): data is ResumeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    !('schemaVersion' in data) &&
    'name' in data &&
    'skills' in data &&
    Array.isArray((data as ResumeData).skills) &&
    typeof (data as ResumeData).skills[0] === 'string'
  )
}

/** Ensure data is V2, migrating from V1 if needed + normalizing old V2 */
export function ensureV2(data: unknown): ResumeDataV2 {
  if (isV1Data(data)) {
    return migrateV1toV2(data)
  }
  const v2 = data as ResumeDataV2
  // Backfill seniority for existing V2 documents that lack it
  if (v2.meta && !v2.meta.seniority) {
    v2.meta.seniority = 'mid'
  }
  // Migrate old V2 format (grouped skills, highlights arrays)
  return migrateOldV2(v2)
}

export const storage = {
  // ─── Multi-resume document store ───

  listDocuments(): ResumeDocument[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(KEYS.documents)
      if (raw) {
        const docs = JSON.parse(raw) as ResumeDocument[]
        // Auto-migrate any V1 documents
        const migrated = docs.map((doc) => {
          if (isV1Data(doc.data)) {
            return { ...doc, data: migrateV1toV2(doc.data as unknown as ResumeData) }
          }
          return { ...doc, data: ensureV2(doc.data) }
        })
        // Sort by updatedAt descending (most recent first)
        return migrated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      }
    } catch {
      /* ignore */
    }
    return []
  },

  /** Fetch a single document by ID without sorting/migrating the entire list. */
  getDocument(id: string): ResumeDocument | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(KEYS.documents)
      if (!raw) return null
      const docs = JSON.parse(raw) as ResumeDocument[]
      const doc = docs.find((d) => d.id === id)
      if (!doc) return null
      if (isV1Data(doc.data)) {
        return { ...doc, data: migrateV1toV2(doc.data as unknown as ResumeData) }
      }
      return { ...doc, data: ensureV2(doc.data) }
    } catch {
      return null
    }
  },

  /** Save a document. `updatedAt` is always overwritten with the current timestamp. */
  saveDocument(doc: ResumeDocument): void {
    try {
      const docs = this.listDocuments()
      const idx = docs.findIndex((d) => d.id === doc.id)
      // Strip any leftover canvasTree from old storage
      const { canvasTree: _, ...cleanDoc } = doc as ResumeDocument & { canvasTree?: unknown }
      const updated = { ...cleanDoc, updatedAt: new Date().toISOString() }
      if (idx >= 0) {
        docs[idx] = updated
      } else {
        docs.push(updated)
      }
      localStorage.setItem(KEYS.documents, JSON.stringify(docs))
    } catch {
      /* storage full */
    }
  },

  deleteDocument(id: string): void {
    try {
      const docs = this.listDocuments().filter((d) => d.id !== id)
      localStorage.setItem(KEYS.documents, JSON.stringify(docs))
    } catch {
      /* ignore */
    }
  },

  renameDocument(id: string, title: string): void {
    const doc = this.getDocument(id)
    if (doc) {
      this.saveDocument({ ...doc, title })
    }
  },

  duplicateDocument(id: string): ResumeDocument | null {
    const doc = this.getDocument(id)
    if (!doc) return null
    const now = new Date().toISOString()
    const newDoc: ResumeDocument = {
      ...doc,
      id: generateId(),
      title: `${doc.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    }
    this.saveDocument(newDoc)
    return newDoc
  },

  createDocument(
    templateId: string,
    title = 'Untitled',
    data?: ResumeDataV2,
    preferencesOverride?: Partial<UserPreferences>,
  ): ResumeDocument {
    const now = new Date().toISOString()
    const doc: ResumeDocument = {
      id: generateId(),
      title,
      templateId,
      data: data ?? { ...emptyResumeDataV2, meta: { ...emptyResumeDataV2.meta, lastModified: now } },
      preferences: { ...defaultPreferences(templateId), ...preferencesOverride },
      createdAt: now,
      updatedAt: now,
    }
    this.saveDocument(doc)
    return doc
  },

  // ─── Legacy single-resume API (for backward compat) ───

  loadResume(): ResumeData {
    if (typeof window === 'undefined') return defaultResumeData
    try {
      const raw = localStorage.getItem(KEYS.data)
      if (raw) return JSON.parse(raw) as ResumeData
    } catch {
      /* ignore corrupt data */
    }
    return defaultResumeData
  },

  saveResume(data: ResumeData): void {
    try {
      const hasContent =
        data.name || data.title || data.email || data.phone ||
        data.location || data.linkedin || data.github || data.summary ||
        data.skills.length > 0 || data.experience.length > 0 ||
        data.education.length > 0 || data.projects.length > 0 ||
        data.strengths.length > 0
      if (!hasContent) {
        localStorage.removeItem(KEYS.data)
        return
      }
      localStorage.setItem(KEYS.data, JSON.stringify(data))
    } catch {
      /* storage full or unavailable */
    }
  },

  exportResume(data: ResumeDataV2): string {
    return JSON.stringify(data, null, 2)
  },

  importResume(json: string): ResumeDataV2 {
    const parsed = JSON.parse(json)
    return ensureV2(parsed)
  },

  loadPreferences(): UserPreferences {
    if (typeof window === 'undefined') {
      return defaultPreferences()
    }
    try {
      const raw = localStorage.getItem(KEYS.preferences)
      if (raw) return JSON.parse(raw) as UserPreferences
    } catch {
      /* ignore */
    }
    return defaultPreferences()
  },

  savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences()
      const merged = { ...current, ...prefs }
      localStorage.setItem(KEYS.preferences, JSON.stringify(merged))
    } catch {
      /* ignore */
    }
  },

  // ─── Migration ───

  migrateOldStorage(): void {
    try {
      // Step 1: migrate very old key
      const OLD_KEY = 'resume-builder-data'
      const old = localStorage.getItem(OLD_KEY)
      if (old && !localStorage.getItem(KEYS.data)) {
        localStorage.setItem(KEYS.data, old)
        localStorage.removeItem(OLD_KEY)
      }

      // Step 2: migrate single-resume data+prefs into documents store
      const existingDocs = localStorage.getItem(KEYS.documents)
      if (!existingDocs) {
        const savedData = localStorage.getItem(KEYS.data)
        const savedPrefs = localStorage.getItem(KEYS.preferences)
        if (savedData || savedPrefs) {
          const rawData = savedData ? JSON.parse(savedData) : defaultResumeData
          const prefs = savedPrefs ? (JSON.parse(savedPrefs) as UserPreferences) : defaultPreferences()

          // Convert V1 data to V2 if needed
          const data = ensureV2(rawData)

          // Only migrate if there's real content
          const hasContent = data.basics.name && data.basics.name !== ''
          if (hasContent) {
            const now = new Date().toISOString()
            const doc: ResumeDocument = {
              id: generateId(),
              title: prefs.resumeTitle ?? (data.basics.name ? `${data.basics.name}'s Resume` : 'Untitled'),
              templateId: prefs.templateId ?? 'classic',
              data,
              preferences: prefs,
              createdAt: now,
              updatedAt: now,
            }
            localStorage.setItem(KEYS.documents, JSON.stringify([doc]))
          }
        }
      } else {
        // Step 3: migrate existing documents from V1 to V2 data shape
        const docs = JSON.parse(existingDocs) as ResumeDocument[]
        let needsSave = false
        const migrated = docs.map((doc) => {
          if (isV1Data(doc.data)) {
            needsSave = true
            return { ...doc, data: migrateV1toV2(doc.data as unknown as ResumeData) }
          }
          // Strip canvasTree if present
          if ('canvasTree' in doc) {
            needsSave = true
            const { canvasTree: _, ...clean } = doc as ResumeDocument & { canvasTree?: unknown }
            return { ...clean, data: ensureV2(clean.data) }
          }
          return doc
        })
        if (needsSave) {
          localStorage.setItem(KEYS.documents, JSON.stringify(migrated))
        }
      }
    } catch {
      /* ignore */
    }
  },
}
