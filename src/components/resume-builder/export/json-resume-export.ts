import type { ResumeDataV2 } from '../types/resume'

/**
 * Country-specific extension fields on basics that are NOT part of the
 * standard JSON Resume schema and should be stripped on export.
 */
const BASICS_EXTENSION_FIELDS = [
  'photo',
  'dateOfBirth',
  'gender',
  'maritalStatus',
  'nationality',
  'fathersName',
  'nationalId',
  'visaStatus',
  'militaryService',
  'religion',
  'bloodType',
] as const

/**
 * Meta fields that are internal extensions and should be stripped on export.
 */
const META_EXTENSION_FIELDS = ['countryCode', 'jobCategory'] as const

/**
 * Converts ResumeDataV2 to standard JSON Resume format.
 *
 * Strips:
 * - `schemaVersion` (internal field)
 * - Country-specific extension fields on `basics`
 * - `meta.countryCode` and `meta.jobCategory`
 *
 * @returns Prettified JSON string conforming to jsonresume.org schema
 */
export function exportToJsonResume(data: ResumeDataV2): string {
  // Strip extension fields from basics
  const cleanBasics = { ...data.basics }
  for (const field of BASICS_EXTENSION_FIELDS) {
    delete cleanBasics[field]
  }

  // Strip extension fields from meta
  const cleanMeta: Record<string, unknown> = { ...data.meta }
  for (const field of META_EXTENSION_FIELDS) {
    delete cleanMeta[field]
  }

  // Build standard JSON Resume object (no schemaVersion)
  const jsonResume = {
    basics: cleanBasics,
    work: data.work,
    education: data.education,
    skills: data.skills,
    languages: data.languages,
    projects: data.projects,
    volunteer: data.volunteer,
    awards: data.awards,
    certificates: data.certificates,
    publications: data.publications,
    interests: data.interests,
    references: data.references,
    meta: cleanMeta,
  }

  return JSON.stringify(jsonResume, null, 2)
}

/**
 * Triggers a browser download of the JSON Resume file.
 */
export function downloadJsonResume(data: ResumeDataV2, filename?: string): void {
  const json = exportToJsonResume(data)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename ?? `${data.basics.name || 'resume'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
