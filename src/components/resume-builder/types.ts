import type { ResumeDataV2 as _ResumeDataV2 } from './types/resume'

// Re-export V2 types as the primary data model
export type {
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
  ResumeMeta,
  ResumeLocation,
  ResumeProfile,
  SectionId,
  SectionVisibility,
} from './types/resume'

export {
  emptyResumeDataV2,
  defaultResumeDataV2,
  emptyLocation,
  ALL_SECTION_IDS,
  DEFAULT_SECTION_ORDER_V2,
  defaultSectionVisibility,
} from './types/resume'

// ── V1 types (kept for migration only) ──

export type CustomElementType = 'text' | 'bullets' | 'tags' | 'dated-entries'

export type DatedEntry = {
  title: string
  subtitle: string
  startDate: string
  endDate: string
  location: string
  bullets: string[]
}

export type CustomSectionElement = {
  id: string
  type: CustomElementType
  textValue?: string
  items?: string[]
  entries?: DatedEntry[]
}

export type CustomSection = {
  id: string
  title: string
  elements: CustomSectionElement[]
}

/** @deprecated Use ResumeDataV2 instead */
export type ResumeData = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  summary: string
  skills: string[]
  experience: {
    role: string
    company: string
    startDate: string
    endDate: string
    location: string
    bullets: string[]
  }[]
  education: {
    degree: string
    school: string
    startDate: string
    endDate: string
    location: string
  }[]
  projects: {
    name: string
    description: string
    techStack: string[]
    liveUrl?: string
    sourceUrl?: string
  }[]
  strengths: string[]
  customSections: CustomSection[]
}

// ── Theme (shared across V1 and V2) ──

export type ThemeConfig = {
  accentColor: string
  headingFont: string
  bodyFont: string
  fontSize: number // offset from base (-3 to +4)
  spacing: number // multiplier (0.6 to 1.6)
}

export type TemplateLayoutId = 'classic' | 'minimal' | 'professional' | 'modern' | 'executive' | 'compact' | 'bold' | 'timeline'

export type TemplateConfig = {
  id: string
  name: string
  description: string
  thumbnail: string
  layout: TemplateLayoutId
  defaultTheme: ThemeConfig
  tags: string[]
  /** Which job categories this template is recommended for (empty = all) */
  categories?: string[]
  /** Which seniority levels this template suits (empty = all) */
  seniority?: string[]
}

export type UserPreferences = {
  templateId: string
  theme: ThemeConfig
  sectionOrder: string[]
  hiddenSections: string[]
  sectionVisibility?: Record<string, boolean>
  sectionLabels?: Record<string, string>
  resumeTitle?: string
}

export type ResumeDocument = {
  id: string
  title: string
  templateId: string
  data: _ResumeDataV2
  preferences: UserPreferences
  createdAt: string // ISO date
  updatedAt: string // ISO date
}

export const DEFAULT_THEME: ThemeConfig = {
  accentColor: '#1a1a1a',
  headingFont: 'Bitter',
  bodyFont: 'Inter',
  fontSize: 0,
  spacing: 1.0,
}

export const defaultResumeData: ResumeData = {
  name: 'Alex Johnson',
  title: 'Full Stack Developer',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'https://linkedin.com/in/alexjohnson',
  github: 'https://github.com/alexjohnson',
  summary:
    'Full Stack Developer with 5+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and delivering exceptional user experiences. Experienced in leading small teams and shipping products from concept to production.',
  skills: [
    'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'GraphQL',
    'AWS', 'Docker', 'Tailwind CSS', 'Python', 'Redis', 'Git',
  ],
  experience: [
    {
      role: 'Senior Frontend Engineer',
      company: 'TechCorp Inc.',
      startDate: 'Jan 2022',
      endDate: 'Present',
      location: 'San Francisco, CA',
      bullets: [
        'Led migration of legacy jQuery app to React/Next.js, improving page load times by 60%',
        'Designed and implemented a component library used across 4 product teams',
        'Mentored 3 junior developers through code reviews and pair programming sessions',
      ],
    },
    {
      role: 'Full Stack Developer',
      company: 'StartupXYZ',
      startDate: 'Jun 2019',
      endDate: 'Dec 2021',
      location: 'Remote',
      bullets: [
        'Built and maintained REST APIs serving 50k+ daily active users',
        'Implemented real-time collaboration features using WebSockets',
        'Reduced infrastructure costs by 40% through database query optimization',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      school: 'University of California, Berkeley',
      startDate: 'Aug 2015',
      endDate: 'May 2019',
      location: 'Berkeley, CA',
    },
  ],
  projects: [
    {
      name: 'DevBoard',
      description:
        'A real-time project management dashboard for developer teams with Kanban boards, sprint tracking, and GitHub integration.',
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      liveUrl: 'https://devboard.example.com',
      sourceUrl: 'https://github.com/alexjohnson/devboard',
    },
    {
      name: 'CloudDeploy CLI',
      description:
        'An open-source CLI tool that simplifies deploying containerized applications to AWS with zero-config defaults.',
      techStack: ['Node.js', 'Docker', 'AWS SDK', 'Commander.js'],
      sourceUrl: 'https://github.com/alexjohnson/clouddeploy',
    },
  ],
  strengths: [
    'Problem Solving', 'System Design', 'Team Leadership',
    'Technical Communication', 'Agile Methodologies', 'Continuous Learning',
  ],
  customSections: [],
}

export const emptyResumeData: ResumeData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  strengths: [],
  customSections: [],
}
