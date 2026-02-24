import { getCountryConfig } from './countries'
import { getJobCategory } from './job-categories'
import { getSeniorityLevel } from './seniority-levels'
import type { SectionId, SectionVisibility } from '../types/resume'
import { ALL_SECTION_IDS, defaultSectionVisibility } from '../types/resume'

/**
 * Computes initial section order, visibility, labels, and tips based on
 * the user's selected country, job category, and seniority level.
 *
 * Priority for section order:
 * 1. Seniority level (strongest influence — entry vs exec have very different ordering)
 * 2. Country config (regional conventions)
 * 3. Fallback to default
 *
 * Priority for visibility:
 * 1. Job category (which sections matter for this industry)
 * 2. Seniority level (entry doesn't need references, exec doesn't need projects)
 *
 * Labels come from job category.
 * Tips are combined from all three sources.
 */
export function computeInitialPreferences(
  countryCode: string,
  jobCategoryId: string,
  seniorityId?: string,
) {
  const country = getCountryConfig(countryCode)
  const category = getJobCategory(jobCategoryId)
  const seniority = getSeniorityLevel(seniorityId || 'mid')

  // ── Section order ──
  // Seniority-driven order takes priority (it determines the structure),
  // but we use country config to handle any sections not in seniority list.
  const validSectionIds = new Set<string>(ALL_SECTION_IDS)

  const seniorityOrder = seniority.sectionOrderOverride
    .filter((s) => validSectionIds.has(s)) as SectionId[]

  // Append any sections not mentioned by seniority config
  const mentioned = new Set(seniorityOrder)
  const remaining = ALL_SECTION_IDS.filter((s) => !mentioned.has(s))
  const sectionOrder: SectionId[] = [...seniorityOrder, ...remaining]

  // ── Section visibility ──
  // Start with defaults, then apply category emphasis, then seniority emphasis
  const sectionVisibility: SectionVisibility = { ...defaultSectionVisibility }

  // Job category adjustments
  for (const id of category.emphasizedSections) {
    if (validSectionIds.has(id)) {
      sectionVisibility[id as SectionId] = true
    }
  }
  for (const id of category.demphasizedSections) {
    if (validSectionIds.has(id)) {
      sectionVisibility[id as SectionId] = false
    }
  }

  // Seniority adjustments (override category where they conflict)
  for (const id of seniority.emphasizedSections) {
    if (validSectionIds.has(id)) {
      sectionVisibility[id as SectionId] = true
    }
  }
  for (const id of seniority.demphasizedSections) {
    if (validSectionIds.has(id)) {
      sectionVisibility[id as SectionId] = false
    }
  }

  // Basics is always visible
  sectionVisibility.basics = true

  // ── Section labels from job category + seniority ──
  const sectionLabels: Record<string, string> = {
    ...category.sectionLabels,
    ...seniority.sectionLabels, // seniority overrides category labels
  }

  // ── Tips (combined from all three sources, deduplicated) ──
  const tips: string[] = [...country.tips, ...category.tips, ...seniority.tips]

  return {
    sectionOrder,
    sectionVisibility,
    sectionLabels,
    tips,
  }
}
