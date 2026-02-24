import type {
  ResumeDataV2,
  ResumeBasics,
  ResumeWork,
  ResumeEducation,
  ResumeLanguage,
  ResumeProject,
  ResumeVolunteer,
  ResumeAward,
  ResumeCertificate,
  ResumePublication,
  ResumeInterest,
  ResumeReference,
  ResumeLocation,
  ResumeProfile,
} from '../types/resume'

// ── Helper to safely extract a string ──

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : []
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Convert an optional summary + highlights array into a single HTML string */
function mergeToHtml(summary: string, highlights: string[]): string {
  const parts: string[] = []
  if (summary) parts.push(`<p>${escHtml(summary)}</p>`)
  if (highlights.length > 0) {
    parts.push('<ul>' + highlights.map((h) => `<li>${escHtml(h)}</li>`).join('') + '</ul>')
  }
  return parts.join('')
}

// ── Individual section parsers ──

function parseLocation(raw: unknown): ResumeLocation {
  if (typeof raw !== 'object' || raw === null) {
    return { address: '', city: '', region: '', postalCode: '', countryCode: 'US' }
  }
  const loc = raw as Record<string, unknown>
  return {
    address: str(loc.address),
    city: str(loc.city),
    region: str(loc.region),
    postalCode: str(loc.postalCode),
    countryCode: str(loc.countryCode, 'US'),
  }
}

function parseProfile(raw: unknown): ResumeProfile {
  if (typeof raw !== 'object' || raw === null) {
    return { network: '', username: '', url: '' }
  }
  const p = raw as Record<string, unknown>
  return {
    network: str(p.network),
    username: str(p.username),
    url: str(p.url),
  }
}

function parseBasics(raw: unknown): ResumeBasics {
  if (typeof raw !== 'object' || raw === null) {
    return {
      name: '',
      label: '',
      email: '',
      phone: '',
      url: '',
      summary: '',
      location: parseLocation(null),
      profiles: [],
    }
  }
  const b = raw as Record<string, unknown>
  return {
    name: str(b.name),
    label: str(b.label),
    email: str(b.email),
    phone: str(b.phone),
    url: str(b.url),
    summary: str(b.summary),
    location: parseLocation(b.location),
    profiles: arr(b.profiles).map(parseProfile),
    // Preserve country-specific extensions if present
    ...(b.photo !== undefined && { photo: str(b.photo) }),
    ...(b.dateOfBirth !== undefined && { dateOfBirth: str(b.dateOfBirth) }),
    ...(b.gender !== undefined && { gender: str(b.gender) }),
    ...(b.maritalStatus !== undefined && { maritalStatus: str(b.maritalStatus) }),
    ...(b.nationality !== undefined && { nationality: str(b.nationality) }),
    ...(b.fathersName !== undefined && { fathersName: str(b.fathersName) }),
    ...(b.nationalId !== undefined && { nationalId: str(b.nationalId) }),
    ...(b.visaStatus !== undefined && { visaStatus: str(b.visaStatus) }),
    ...(b.militaryService !== undefined && { militaryService: str(b.militaryService) }),
    ...(b.religion !== undefined && { religion: str(b.religion) }),
    ...(b.bloodType !== undefined && { bloodType: str(b.bloodType) }),
  }
}

function parseWork(raw: unknown): ResumeWork {
  if (typeof raw !== 'object' || raw === null) {
    return { name: '', position: '', url: '', startDate: '', endDate: '', summary: '', location: '' }
  }
  const w = raw as Record<string, unknown>
  const summary = str(w.summary)
  const highlights = arr<string>(w.highlights).map((h) => str(h))
  return {
    name: str(w.name) || str(w.company),
    position: str(w.position),
    url: str(w.url),
    startDate: str(w.startDate),
    endDate: str(w.endDate),
    summary: mergeToHtml(summary, highlights),
    location: str(w.location),
  }
}

function parseEducation(raw: unknown): ResumeEducation {
  if (typeof raw !== 'object' || raw === null) {
    return { institution: '', area: '', studyType: '', startDate: '', endDate: '', score: '', url: '', courses: [] }
  }
  const e = raw as Record<string, unknown>
  return {
    institution: str(e.institution),
    area: str(e.area),
    studyType: str(e.studyType),
    startDate: str(e.startDate),
    endDate: str(e.endDate),
    score: str(e.score) || str(e.gpa),
    url: str(e.url),
    courses: arr<string>(e.courses).map((c) => str(c)),
  }
}

/** Parse JSON Resume skills (grouped format) into flat string array */
function parseSkills(rawSkills: unknown[]): string[] {
  const skills: string[] = []
  for (const raw of rawSkills) {
    if (typeof raw === 'string') {
      if (raw) skills.push(raw)
      continue
    }
    if (typeof raw !== 'object' || raw === null) continue
    const s = raw as Record<string, unknown>
    // JSON Resume format: { name, level, keywords[] }
    const keywords = arr<string>(s.keywords).map((k) => str(k)).filter(Boolean)
    if (keywords.length > 0) {
      skills.push(...keywords)
    } else if (str(s.name)) {
      skills.push(str(s.name))
    }
  }
  return skills
}

function parseLanguage(raw: unknown): ResumeLanguage {
  if (typeof raw !== 'object' || raw === null) {
    return { language: '', fluency: '' }
  }
  const l = raw as Record<string, unknown>
  return {
    language: str(l.language),
    fluency: str(l.fluency),
  }
}

function parseProject(raw: unknown): ResumeProject {
  if (typeof raw !== 'object' || raw === null) {
    return {
      name: '', description: '', keywords: [],
      startDate: '', endDate: '', url: '', roles: [], entity: '', type: '',
    }
  }
  const p = raw as Record<string, unknown>
  const description = str(p.description)
  const highlights = arr<string>(p.highlights).map((h) => str(h))
  return {
    name: str(p.name),
    description: mergeToHtml(description, highlights),
    keywords: arr<string>(p.keywords).map((k) => str(k)),
    startDate: str(p.startDate),
    endDate: str(p.endDate),
    url: str(p.url),
    roles: arr<string>(p.roles).map((r) => str(r)),
    entity: str(p.entity),
    type: str(p.type),
  }
}

function parseVolunteer(raw: unknown): ResumeVolunteer {
  if (typeof raw !== 'object' || raw === null) {
    return { organization: '', position: '', url: '', startDate: '', endDate: '', summary: '' }
  }
  const v = raw as Record<string, unknown>
  const summary = str(v.summary)
  const highlights = arr<string>(v.highlights).map((h) => str(h))
  return {
    organization: str(v.organization),
    position: str(v.position),
    url: str(v.url),
    startDate: str(v.startDate),
    endDate: str(v.endDate),
    summary: mergeToHtml(summary, highlights),
  }
}

function parseAward(raw: unknown): ResumeAward {
  if (typeof raw !== 'object' || raw === null) {
    return { title: '', date: '', awarder: '', summary: '' }
  }
  const a = raw as Record<string, unknown>
  return {
    title: str(a.title),
    date: str(a.date),
    awarder: str(a.awarder),
    summary: str(a.summary),
  }
}

function parseCertificate(raw: unknown): ResumeCertificate {
  if (typeof raw !== 'object' || raw === null) {
    return { name: '', date: '', issuer: '', url: '' }
  }
  const c = raw as Record<string, unknown>
  return {
    name: str(c.name),
    date: str(c.date),
    issuer: str(c.issuer),
    url: str(c.url),
  }
}

function parsePublication(raw: unknown): ResumePublication {
  if (typeof raw !== 'object' || raw === null) {
    return { name: '', publisher: '', releaseDate: '', url: '', summary: '' }
  }
  const p = raw as Record<string, unknown>
  return {
    name: str(p.name),
    publisher: str(p.publisher),
    releaseDate: str(p.releaseDate),
    url: str(p.url),
    summary: str(p.summary),
  }
}

function parseInterest(raw: unknown): ResumeInterest {
  if (typeof raw !== 'object' || raw === null) {
    return { name: '', keywords: [] }
  }
  const i = raw as Record<string, unknown>
  return {
    name: str(i.name),
    keywords: arr<string>(i.keywords).map((k) => str(k)),
  }
}

function parseReference(raw: unknown): ResumeReference {
  if (typeof raw !== 'object' || raw === null) {
    return { name: '', reference: '' }
  }
  const r = raw as Record<string, unknown>
  return {
    name: str(r.name),
    reference: str(r.reference),
  }
}

// ── Main import function ──

/**
 * Imports a standard JSON Resume format string and converts it to ResumeDataV2.
 *
 * - Parses all standard JSON Resume sections
 * - Flattens grouped skills to flat string array
 * - Converts highlights arrays to HTML summaries
 * - Sets schemaVersion: 2
 * - Defaults countryCode to 'US' and jobCategory to 'general'
 * - Handles missing fields gracefully with empty strings/arrays
 *
 * @throws {SyntaxError} if the JSON string is malformed
 */
export function importJsonResume(json: string): ResumeDataV2 {
  const raw = JSON.parse(json)

  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid JSON Resume: expected an object at the root level')
  }

  const obj = raw as Record<string, unknown>

  // Parse meta, preserving standard fields and adding our extensions
  const rawMeta = (typeof obj.meta === 'object' && obj.meta !== null)
    ? obj.meta as Record<string, unknown>
    : {}

  return {
    schemaVersion: 2,
    basics: parseBasics(obj.basics),
    work: arr(obj.work).map(parseWork),
    education: arr(obj.education).map(parseEducation),
    skills: parseSkills(arr(obj.skills)),
    languages: arr(obj.languages).map(parseLanguage),
    projects: arr(obj.projects).map(parseProject),
    volunteer: arr(obj.volunteer).map(parseVolunteer),
    awards: arr(obj.awards).map(parseAward),
    certificates: arr(obj.certificates).map(parseCertificate),
    publications: arr(obj.publications).map(parsePublication),
    interests: arr(obj.interests).map(parseInterest),
    references: arr(obj.references).map(parseReference),
    meta: {
      canonical: str(rawMeta.canonical),
      version: str(rawMeta.version, '1.0.0'),
      lastModified: str(rawMeta.lastModified, new Date().toISOString()),
      countryCode: str(rawMeta.countryCode, 'US'),
      jobCategory: str(rawMeta.jobCategory, 'general'),
      seniority: str(rawMeta.seniority, 'mid'),
    },
  }
}
