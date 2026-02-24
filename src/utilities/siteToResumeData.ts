import type { ResumeDataV2 } from '@/components/resume-builder/types'
import { emptyResumeDataV2 } from '@/components/resume-builder/types/resume'

type SiteConfig = {
  name: string
  title: string
  bio: string
  email: string
  socials: { github: string; linkedin: string; twitter: string }
}

type ResumeExperience = {
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
}

type ResumeProject = {
  name: string
  description: string
  techStack: string[]
  liveUrl?: string
  sourceUrl?: string
}

export function siteToResumeData(
  config: SiteConfig,
  resume: {
    skills: { name: string }[]
    experience: ResumeExperience[]
    projects: ResumeProject[]
  },
): ResumeDataV2 {
  const profiles: ResumeDataV2['basics']['profiles'] = []
  if (config.socials.linkedin) {
    profiles.push({ network: 'LinkedIn', username: '', url: config.socials.linkedin })
  }
  if (config.socials.github) {
    profiles.push({ network: 'GitHub', username: '', url: config.socials.github })
  }

  return {
    ...emptyResumeDataV2,
    basics: {
      ...emptyResumeDataV2.basics,
      name: config.name,
      label: config.title,
      email: config.email,
      summary: config.bio,
      profiles,
    },
    work: resume.experience.map((exp) => ({
      name: exp.company,
      position: exp.role,
      url: '',
      startDate: exp.startDate,
      endDate: exp.endDate,
      summary: exp.bullets.length > 0
        ? '<ul>' + exp.bullets.map((b) => `<li>${b}</li>`).join('') + '</ul>'
        : '',
      location: exp.location,
    })),
    skills: resume.skills.map((s) => s.name),
    projects: resume.projects.map((p) => ({
      name: p.name,
      description: p.description,
      keywords: p.techStack,
      startDate: '',
      endDate: '',
      url: p.liveUrl ?? p.sourceUrl ?? '',
      roles: [],
      entity: '',
      type: '',
    })),
    meta: {
      ...emptyResumeDataV2.meta,
      lastModified: new Date().toISOString(),
    },
  }
}
