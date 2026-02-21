import { Hero } from '@/components/hero'
import { Skills } from '@/components/skills'
import { Experience } from '@/components/experience'
import { Projects } from '@/components/projects'
import { Contact } from '@/components/contact'
import { Separator } from '@/components/ui/separator'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[680px] px-6">
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
