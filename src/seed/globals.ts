import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '../data/site'
import { skills, experience, projects } from '../data/resume'

async function seed() {
  const payload = await getPayload({ config })

  // Seed SiteConfig
  const existingSiteConfig = await payload.findGlobal({ slug: 'site-config' })
  if (!existingSiteConfig?.name) {
    payload.logger.info('Seeding SiteConfig global...')
    await payload.updateGlobal({
      slug: 'site-config',
      data: {
        name: siteConfig.name,
        initials: siteConfig.initials,
        title: siteConfig.title,
        bio: siteConfig.bio,
        email: siteConfig.email,
        socials: {
          github: siteConfig.socials.github,
          linkedin: siteConfig.socials.linkedin,
          twitter: siteConfig.socials.twitter,
        },
        nav: siteConfig.nav.map((item) => ({
          label: item.label,
          href: item.href,
        })),
      },
    })
    payload.logger.info('SiteConfig seeded.')
  } else {
    payload.logger.info('SiteConfig already populated, skipping.')
  }

  // Seed Resume
  const existingResume = await payload.findGlobal({ slug: 'resume' })
  const hasResume =
    existingResume?.skills?.length || existingResume?.experience?.length || existingResume?.projects?.length
  if (!hasResume) {
    payload.logger.info('Seeding Resume global...')
    await payload.updateGlobal({
      slug: 'resume',
      data: {
        skills: skills.map((s) => ({ name: s.name })),
        experience: experience.map((e) => ({
          role: e.role,
          company: e.company,
          companyUrl: e.companyUrl || '',
          location: e.location,
          type: e.type,
          startDate: e.startDate,
          endDate: e.endDate,
          bullets: e.bullets.map((b) => ({ text: b })),
        })),
        projects: projects.map((p) => ({
          name: p.name,
          description: p.description,
          techStack: p.techStack.map((t) => ({ name: t })),
          liveUrl: p.liveUrl || '',
          sourceUrl: p.sourceUrl || '',
        })),
      },
    })
    payload.logger.info('Resume seeded.')
  } else {
    payload.logger.info('Resume already populated, skipping.')
  }

  payload.logger.info('Seeding complete.')
  process.exit(0)
}

seed()
