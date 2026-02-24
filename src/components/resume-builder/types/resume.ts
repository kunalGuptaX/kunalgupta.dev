// JSON Resume-based data model (v2) with country-specific extensions
// See: https://jsonresume.org/schema/
// Description fields (summary, description) may contain ATS-safe HTML
// (p, ul, ol, li, strong, em) from the WYSIWYG editor.

export type ResumeLocation = {
  address: string
  city: string
  region: string
  postalCode: string
  countryCode: string
}

export type ResumeProfile = {
  network: string
  username: string
  url: string
}

export type ResumeBasics = {
  name: string
  label: string // job title
  email: string
  phone: string
  url: string
  summary: string // HTML
  location: ResumeLocation
  profiles: ResumeProfile[]
  // Country-specific extensions
  photo?: string
  dateOfBirth?: string
  gender?: string
  maritalStatus?: string
  nationality?: string
  fathersName?: string
  nationalId?: string
  visaStatus?: string
  militaryService?: string
  religion?: string
  bloodType?: string
}

export type ResumeWork = {
  name: string
  position: string
  url: string
  startDate: string
  endDate: string
  summary: string // HTML — replaces old highlights array
  location: string
}

export type ResumeEducation = {
  institution: string
  area: string
  studyType: string
  startDate: string
  endDate: string
  score: string
  url: string
  courses: string[]
}

export type ResumeLanguage = {
  language: string
  fluency: string
}

export type ResumeProject = {
  name: string
  description: string // HTML — replaces old highlights array
  keywords: string[]
  startDate: string
  endDate: string
  url: string
  roles: string[]
  entity: string
  type: string
}

export type ResumeVolunteer = {
  organization: string
  position: string
  url: string
  startDate: string
  endDate: string
  summary: string // HTML — replaces old highlights array
}

export type ResumeAward = {
  title: string
  date: string
  awarder: string
  summary: string // HTML
}

export type ResumeCertificate = {
  name: string
  date: string
  issuer: string
  url: string
}

export type ResumePublication = {
  name: string
  publisher: string
  releaseDate: string
  url: string
  summary: string // HTML
}

export type ResumeInterest = {
  name: string
  keywords: string[]
}

export type ResumeReference = {
  name: string
  reference: string
}

export type ResumeMeta = {
  canonical: string
  version: string
  lastModified: string
  countryCode: string
  jobCategory: string
  seniority: string
}

export type ResumeDataV2 = {
  schemaVersion: 2
  basics: ResumeBasics
  work: ResumeWork[]
  education: ResumeEducation[]
  skills: string[] // flat list of skill names
  languages: ResumeLanguage[]
  projects: ResumeProject[]
  volunteer: ResumeVolunteer[]
  awards: ResumeAward[]
  certificates: ResumeCertificate[]
  publications: ResumePublication[]
  interests: ResumeInterest[]
  references: ResumeReference[]
  meta: ResumeMeta
}

export type SectionId =
  | 'basics'
  | 'work'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'volunteer'
  | 'awards'
  | 'certificates'
  | 'publications'
  | 'interests'
  | 'references'

export type SectionVisibility = Record<SectionId, boolean>

// ── Defaults ──

export const emptyLocation: ResumeLocation = {
  address: '',
  city: '',
  region: '',
  postalCode: '',
  countryCode: 'US',
}

export const emptyResumeDataV2: ResumeDataV2 = {
  schemaVersion: 2,
  basics: {
    name: '',
    label: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: { ...emptyLocation },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  volunteer: [],
  awards: [],
  certificates: [],
  publications: [],
  interests: [],
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

export const defaultResumeDataV2: ResumeDataV2 = {
  schemaVersion: 2,
  basics: {
    name: 'Alex Johnson',
    label: 'Full Stack Developer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    url: 'https://alexjohnson.dev',
    summary:
      'Full Stack Developer with 5+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and delivering exceptional user experiences.',
    location: {
      address: '',
      city: 'San Francisco',
      region: 'CA',
      postalCode: '',
      countryCode: 'US',
    },
    profiles: [
      { network: 'LinkedIn', username: 'alexjohnson', url: 'https://linkedin.com/in/alexjohnson' },
      { network: 'GitHub', username: 'alexjohnson', url: 'https://github.com/alexjohnson' },
    ],
  },
  work: [
    {
      name: 'TechCorp Inc.',
      position: 'Senior Frontend Engineer',
      url: '',
      startDate: '2022-01',
      endDate: '',
      summary:
        '<ul><li>Led migration of legacy jQuery app to React/Next.js, improving page load times by 60%</li><li>Designed and implemented a component library used across 4 product teams</li><li>Mentored 3 junior developers through code reviews and pair programming sessions</li></ul>',
      location: 'San Francisco, CA',
    },
    {
      name: 'StartupXYZ',
      position: 'Full Stack Developer',
      url: '',
      startDate: '2019-06',
      endDate: '2021-12',
      summary:
        '<ul><li>Built and maintained REST APIs serving 50k+ daily active users</li><li>Implemented real-time collaboration features using WebSockets</li><li>Reduced infrastructure costs by 40% through database query optimization</li></ul>',
      location: 'Remote',
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      area: 'Computer Science',
      studyType: 'B.S.',
      startDate: '2015-08',
      endDate: '2019-05',
      score: '',
      url: '',
      courses: [],
    },
  ],
  skills: [
    'TypeScript', 'React', 'Next.js', 'Tailwind CSS',
    'Node.js', 'PostgreSQL', 'GraphQL', 'Redis',
    'AWS', 'Docker', 'Git', 'CI/CD',
  ],
  languages: [
    { language: 'English', fluency: 'Native' },
  ],
  projects: [
    {
      name: 'DevBoard',
      description: 'A real-time project management dashboard for developer teams with Kanban boards, sprint tracking, and GitHub integration.',
      keywords: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      startDate: '',
      endDate: '',
      url: 'https://devboard.example.com',
      roles: [],
      entity: '',
      type: 'application',
    },
    {
      name: 'CloudDeploy CLI',
      description: 'An open-source CLI tool that simplifies deploying containerized applications to AWS with zero-config defaults.',
      keywords: ['Node.js', 'Docker', 'AWS SDK', 'Commander.js'],
      startDate: '',
      endDate: '',
      url: 'https://github.com/alexjohnson/clouddeploy',
      roles: [],
      entity: '',
      type: 'tool',
    },
  ],
  volunteer: [],
  awards: [],
  certificates: [],
  publications: [],
  interests: [
    { name: 'Strengths', keywords: ['Problem Solving', 'System Design', 'Team Leadership', 'Technical Communication'] },
  ],
  references: [],
  meta: {
    canonical: '',
    version: '1.0.0',
    lastModified: new Date().toISOString(),
    countryCode: 'US',
    jobCategory: 'tech',
    seniority: 'mid',
  },
}

// ── All section IDs (for ordering) ──

export const ALL_SECTION_IDS: SectionId[] = [
  'work',
  'education',
  'skills',
  'projects',
  'languages',
  'volunteer',
  'awards',
  'certificates',
  'publications',
  'interests',
  'references',
]

export const DEFAULT_SECTION_ORDER_V2: SectionId[] = [
  'work',
  'education',
  'skills',
  'projects',
  'languages',
  'certificates',
  'volunteer',
  'awards',
  'publications',
  'interests',
  'references',
]

export const defaultSectionVisibility: SectionVisibility = {
  basics: true,
  work: true,
  education: true,
  skills: true,
  languages: false,
  projects: true,
  volunteer: false,
  awards: false,
  certificates: false,
  publications: false,
  interests: false,
  references: false,
}
