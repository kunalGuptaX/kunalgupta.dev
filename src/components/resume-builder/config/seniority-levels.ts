export type SeniorityLevelConfig = {
  id: string
  label: string
  description: string
  icon: string // emoji
  sectionOrderOverride: string[] // preferred section order
  emphasizedSections: string[]
  demphasizedSections: string[]
  sectionLabels: Record<string, string>
  tips: string[]
  /** Tags to match against template tags for recommendations */
  recommendedTemplateTags: string[]
}

const entry: SeniorityLevelConfig = {
  id: 'entry',
  label: 'Entry Level',
  description: '0-2 years experience, internships, new grad',
  icon: '\u{1F331}',
  sectionOrderOverride: ['education', 'projects', 'skills', 'work', 'certificates', 'languages', 'volunteer', 'awards', 'publications', 'interests', 'references'],
  emphasizedSections: ['education', 'projects', 'skills', 'volunteer'],
  demphasizedSections: ['publications', 'references'],
  sectionLabels: {
    work: 'Experience',
    projects: 'Projects & Coursework',
    volunteer: 'Leadership & Activities',
  },
  tips: [
    'Lead with education — include relevant coursework, GPA (if above 3.5), honors, and academic projects.',
    'Highlight internships, part-time work, and academic projects to show practical experience.',
    'Keep it to one page — entry-level resumes should be concise and focused.',
    'Include relevant extracurricular activities, hackathons, and volunteer work to demonstrate initiative.',
  ],
  recommendedTemplateTags: ['clean', 'modern', 'entry-level'],
}

const mid: SeniorityLevelConfig = {
  id: 'mid',
  label: 'Mid Level',
  description: '3-7 years experience',
  icon: '\u{1F4C8}',
  sectionOrderOverride: ['work', 'skills', 'projects', 'education', 'certificates', 'languages', 'volunteer', 'awards', 'publications', 'interests', 'references'],
  emphasizedSections: ['work', 'skills', 'projects', 'certificates'],
  demphasizedSections: ['volunteer', 'interests'],
  sectionLabels: {
    work: 'Professional Experience',
    skills: 'Skills & Expertise',
  },
  tips: [
    'Lead with your work experience — focus on achievements and measurable impact rather than responsibilities.',
    'Highlight career progression and increasing responsibility across roles.',
    'One to two pages is ideal — include only the most relevant experience.',
    'Emphasize certifications and professional development that demonstrate growth.',
  ],
  recommendedTemplateTags: ['professional', 'ats', 'balanced'],
}

const senior: SeniorityLevelConfig = {
  id: 'senior',
  label: 'Senior Level',
  description: '8-15 years experience, team lead, principal',
  icon: '\u{2B50}',
  sectionOrderOverride: ['work', 'skills', 'certificates', 'education', 'projects', 'awards', 'publications', 'languages', 'volunteer', 'interests', 'references'],
  emphasizedSections: ['work', 'skills', 'certificates', 'awards'],
  demphasizedSections: ['projects', 'volunteer', 'interests'],
  sectionLabels: {
    work: 'Professional Experience',
    skills: 'Core Competencies',
    awards: 'Awards & Recognition',
    certificates: 'Certifications & Licenses',
  },
  tips: [
    'Focus on leadership, strategy, and measurable business impact in each role.',
    'Two pages is acceptable — prioritize the last 10-15 years of experience.',
    'Highlight cross-functional collaboration, mentoring, and technical leadership.',
    'Include industry-specific certifications and thought leadership (speaking, publications).',
  ],
  recommendedTemplateTags: ['professional', 'traditional', 'ats', 'senior'],
}

const executive: SeniorityLevelConfig = {
  id: 'executive',
  label: 'Executive / C-Suite',
  description: 'VP, Director, C-level, Board roles',
  icon: '\u{1F451}',
  sectionOrderOverride: ['work', 'education', 'awards', 'certificates', 'publications', 'skills', 'languages', 'volunteer', 'projects', 'interests', 'references'],
  emphasizedSections: ['work', 'education', 'awards', 'publications'],
  demphasizedSections: ['projects', 'interests', 'references'],
  sectionLabels: {
    work: 'Executive Experience',
    education: 'Education',
    awards: 'Awards & Board Memberships',
    skills: 'Areas of Expertise',
    publications: 'Publications & Speaking',
    volunteer: 'Civic & Nonprofit Leadership',
  },
  tips: [
    'Lead with a strong executive summary emphasizing vision, strategy, and P&L accountability.',
    'Quantify everything — revenue growth, team size, market expansion, cost savings at scale.',
    'Two to three pages is acceptable for executive resumes — depth matters more than brevity.',
    'Include board memberships, advisory roles, and industry leadership positions.',
    'List keynote speeches, published articles, and media appearances that establish thought leadership.',
  ],
  recommendedTemplateTags: ['executive', 'traditional', 'conservative', 'premium'],
}

export const seniorityLevels: Record<string, SeniorityLevelConfig> = {
  entry,
  mid,
  senior,
  executive,
}

export function getSeniorityLevel(id: string): SeniorityLevelConfig {
  return seniorityLevels[id] ?? seniorityLevels.mid
}

export const seniorityLevelList: { id: string; label: string; description: string; icon: string }[] =
  Object.values(seniorityLevels).map(({ id, label, description, icon }) => ({ id, label, description, icon }))
