import { Badge } from '@/components/ui/badge'
import { skills } from '@/data/resume'

export function Skills() {
  return (
    <section id="skills" aria-label="Technical skills" className="py-16 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Skills</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Technologies and tools I work with. These evolve over time.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill.name}
            variant="secondary"
            className="px-3 py-1 text-sm font-normal"
          >
            {skill.name}
          </Badge>
        ))}
      </div>
    </section>
  )
}
