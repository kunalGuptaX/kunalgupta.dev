import type { ResumeData } from '@/components/resume-builder/types'

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

type ResumeSkill = { name: string }

export function siteToResumeData(
  config: SiteConfig,
  resume: {
    skills: ResumeSkill[]
    experience: ResumeExperience[]
    projects: ResumeProject[]
  },
): ResumeData {
  return {
    name: config.name,
    title: config.title,
    email: config.email,
    phone: '',
    location: '',
    linkedin: config.socials.linkedin,
    github: config.socials.github,
    summary: config.bio,
    skills: resume.skills.map((s) => s.name),
    experience: resume.experience.map((exp) => ({
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: exp.location,
      bullets: exp.bullets,
    })),
    education: [],
    projects: resume.projects.map((p) => ({
      name: p.name,
      description: p.description,
      techStack: p.techStack,
      liveUrl: p.liveUrl,
      sourceUrl: p.sourceUrl,
    })),
    strengths: [],
  }
}
