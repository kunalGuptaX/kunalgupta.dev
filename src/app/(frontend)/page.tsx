import { Hero } from '@/components/hero'
import { Skills } from '@/components/skills'
import { Experience } from '@/components/experience'
import { Projects } from '@/components/projects'
import { Contact } from '@/components/contact'
import { Separator } from '@/components/ui/separator'
import { getSiteConfig } from '@/utilities/getSiteConfig'

export default async function HomePage() {
  const config = await getSiteConfig()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.name,
    jobTitle: config.title,
    url: config.url,
    email: config.email,
    sameAs: Object.values(config.socials).filter(Boolean),
  }

  return (
    <div className="mx-auto max-w-[680px] px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Separator className="opacity-50" />
      <Skills />
      <Separator className="opacity-50" />
      <Experience />
      <Separator className="opacity-50" />
      <Projects />
      <Separator className="opacity-50" />
      <Contact />
    </div>
  )
}
