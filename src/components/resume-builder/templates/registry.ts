import type { TemplateConfig } from '../types'
import { themes } from './themes'

/**
 * Template Registry — 1 entry per unique layout.
 *
 * Colors and fonts are customizable via the Design Panel (theme system),
 * so each layout only needs a single entry with sensible defaults.
 *
 * Layout types:
 * - classic:      Two-column with sidebar for contact/skills
 * - minimal:      Clean single-column, centered header
 * - professional: ATS-optimized single-column, traditional
 * - modern:       Two-column with dark accent sidebar
 * - executive:    Centered header, serif-heavy, generous spacing
 * - compact:      Dense single-column, max content per page
 * - bold:         Full-width color banner header, tag-style skills
 * - timeline:     Left-aligned dates with vertical connecting line
 */

export const templateRegistry: TemplateConfig[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Two-column layout with sidebar — versatile and professional',
    thumbnail: '/templates/classic-default.svg',
    layout: 'classic',
    defaultTheme: themes.default,
    tags: ['professional', 'traditional', 'ats', 'balanced', 'two-column'],
    categories: ['general', 'tech', 'finance', 'consulting'],
    seniority: ['mid', 'senior'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean single-column — lets content speak for itself',
    thumbnail: '/templates/minimal-default.svg',
    layout: 'minimal',
    defaultTheme: themes.default,
    tags: ['clean', 'modern', 'single-column', 'ats', 'entry-level'],
    categories: ['tech', 'creative', 'education'],
    seniority: ['entry', 'mid'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'ATS-optimized single-column — highest compatibility',
    thumbnail: '/templates/classic-default.svg',
    layout: 'professional',
    defaultTheme: themes.navy,
    tags: ['ats', 'traditional', 'conservative', 'single-column', 'professional'],
    categories: ['finance', 'legal', 'consulting', 'government', 'hr'],
    seniority: ['mid', 'senior', 'executive'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column with dark sidebar — contemporary design',
    thumbnail: '/templates/minimal-default.svg',
    layout: 'modern',
    defaultTheme: themes.ocean,
    tags: ['modern', 'tech', 'sidebar', 'two-column', 'bold'],
    categories: ['tech', 'creative', 'product', 'data-science', 'marketing'],
    seniority: ['entry', 'mid'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant serif-heavy layout for senior leaders',
    thumbnail: '/templates/classic-default.svg',
    layout: 'executive',
    defaultTheme: themes.burgundy,
    tags: ['executive', 'traditional', 'conservative', 'single-column'],
    categories: ['finance', 'legal', 'consulting', 'government'],
    seniority: ['senior', 'executive'],
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Dense layout — fit maximum content on one page',
    thumbnail: '/templates/classic-default.svg',
    layout: 'compact',
    defaultTheme: themes.default,
    tags: ['dense', 'ats', 'single-column', 'one-page', 'entry-level'],
    categories: ['tech', 'engineering', 'data-science', 'general'],
    seniority: ['entry', 'mid'],
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Full-width color banner header with modern tag-style skills',
    thumbnail: '/templates/minimal-default.svg',
    layout: 'bold',
    defaultTheme: themes.ocean,
    tags: ['modern', 'bold', 'creative', 'single-column', 'attention-grabbing'],
    categories: ['creative', 'marketing', 'sales', 'product'],
    seniority: ['entry', 'mid'],
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Dates on left, content on right — shows career progression',
    thumbnail: '/templates/classic-default.svg',
    layout: 'timeline',
    defaultTheme: themes.navy,
    tags: ['professional', 'traditional', 'single-column', 'european', 'formal'],
    categories: ['academic', 'medical', 'engineering', 'government', 'nonprofit'],
    seniority: ['mid', 'senior', 'executive'],
  },
]

export function getTemplate(id: string): TemplateConfig | undefined {
  return templateRegistry.find((t) => t.id === id)
}

/**
 * Get templates recommended for a given context.
 * Scores templates based on tag overlap with category + seniority recommendations.
 * Returns all templates sorted by relevance (most relevant first).
 */
export function getRecommendedTemplates(opts: {
  categoryId?: string
  seniorityId?: string
  categoryTags?: string[]
  seniorityTags?: string[]
}): TemplateConfig[] {
  const { categoryId, seniorityId, categoryTags = [], seniorityTags = [] } = opts
  const searchTags = new Set([...categoryTags, ...seniorityTags])

  return [...templateRegistry].sort((a, b) => {
    const scoreA = scoreTemplate(a, categoryId, seniorityId, searchTags)
    const scoreB = scoreTemplate(b, categoryId, seniorityId, searchTags)
    return scoreB - scoreA
  })
}

function scoreTemplate(
  tmpl: TemplateConfig,
  categoryId: string | undefined,
  seniorityId: string | undefined,
  searchTags: Set<string>,
): number {
  let score = 0

  if (categoryId && tmpl.categories?.includes(categoryId)) {
    score += 10
  }

  if (seniorityId && tmpl.seniority?.includes(seniorityId)) {
    score += 8
  }

  for (const tag of tmpl.tags) {
    if (searchTags.has(tag)) {
      score += 2
    }
  }

  if (!tmpl.categories || tmpl.categories.length === 0) {
    score += 1
  }

  return score
}
