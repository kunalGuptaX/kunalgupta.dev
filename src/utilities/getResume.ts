import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { skills as staticSkills, experience as staticExperience, projects as staticProjects } from '@/data/resume'
import type { Skill, Experience, Project } from '@/data/resume'

type ResumeData = {
  skills: Skill[]
  experience: Experience[]
  projects: Project[]
}

export const getResume = unstable_cache(
  async (): Promise<ResumeData> => {
    try {
      const payload = await getPayload({ config: configPromise })
      const data = await payload.findGlobal({ slug: 'resume' })

      const hasData = data?.skills?.length || data?.experience?.length || data?.projects?.length
      if (!hasData) {
        return fallback()
      }

      return {
        skills: (data.skills || []).map((s) => ({ name: s.name })),
        experience: (data.experience || []).map((e) => ({
          role: e.role,
          company: e.company,
          companyUrl: e.companyUrl || undefined,
          location: e.location,
          type: e.type,
          startDate: e.startDate,
          endDate: e.endDate,
          bullets: (e.bullets || []).map((b) => b.text),
        })),
        projects: (data.projects || []).map((p) => ({
          name: p.name,
          description: p.description,
          techStack: (p.techStack || []).map((t) => t.name),
          liveUrl: p.liveUrl || undefined,
          sourceUrl: p.sourceUrl || undefined,
        })),
      }
    } catch {
      return fallback()
    }
  },
  ['resume'],
  { tags: ['resume'] },
)

function fallback(): ResumeData {
  return {
    skills: staticSkills,
    experience: staticExperience,
    projects: staticProjects,
  }
}
