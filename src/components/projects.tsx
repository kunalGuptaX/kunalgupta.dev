import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getResume } from '@/utilities/getResume'
import { IconGitHub } from '@/components/icons'
import { ExternalLink } from 'lucide-react'

export async function Projects() {
  const { projects } = await getResume()

  if (projects.length === 0) return null

  return (
    <>
    <Separator className="opacity-50" />
    <section id="projects" aria-label="Projects" className="py-16 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Projects</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A few things I&apos;ve built.
      </p>

      <div className="mt-8 space-y-6">
        {projects.map((project) => (
          <div
            key={project.name}
            className="group rounded-lg border border-border/50 p-5 transition-colors hover:border-border"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
              <div className="flex items-center gap-2">
                {project.sourceUrl && (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Source code for ${project.name}`}
                  >
                    <IconGitHub className="h-4 w-4" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Live demo for ${project.name}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-2 py-0.5 text-xs font-normal"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  )
}
