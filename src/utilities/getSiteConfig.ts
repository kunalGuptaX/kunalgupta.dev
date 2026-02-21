import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { siteConfig } from '@/data/site'

type SiteConfigData = {
  name: string
  initials: string
  title: string
  bio: string
  email: string
  url: string
  socials: {
    github: string
    linkedin: string
    twitter: string
  }
  nav: { label: string; href: string }[]
}

export const getSiteConfig = unstable_cache(
  async (): Promise<SiteConfigData> => {
    try {
      const payload = await getPayload({ config: configPromise })
      const data = await payload.findGlobal({ slug: 'site-config' })

      if (!data?.name) {
        return fallback()
      }

      return {
        name: data.name,
        initials: data.initials,
        title: data.title,
        bio: data.bio,
        email: data.email,
        url: siteConfig.url,
        socials: {
          github: data.socials?.github || '',
          linkedin: data.socials?.linkedin || '',
          twitter: data.socials?.twitter || '',
        },
        nav: (data.nav || []).map((item) => ({
          label: item.label,
          href: item.href,
        })),
      }
    } catch {
      return fallback()
    }
  },
  ['site-config'],
  { tags: ['site-config'] },
)

function fallback(): SiteConfigData {
  return {
    name: siteConfig.name,
    initials: siteConfig.initials,
    title: siteConfig.title,
    bio: siteConfig.bio,
    email: siteConfig.email,
    url: siteConfig.url,
    socials: {
      github: siteConfig.socials.github,
      linkedin: siteConfig.socials.linkedin,
      twitter: siteConfig.socials.twitter,
    },
    nav: siteConfig.nav.map((item) => ({ label: item.label, href: item.href })),
  }
}
