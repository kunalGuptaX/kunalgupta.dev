import { Hero } from '@/components/hero'
import { Skills } from '@/components/skills'
import { Experience } from '@/components/experience'
import { Projects } from '@/components/projects'
import { Contact } from '@/components/contact'
import { Separator } from '@/components/ui/separator'
import { siteConfig, socialUrls } from '@/data/site'

export const dynamic = 'force-static'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.title,
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: socialUrls,
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
