import { experience } from '@/data/resume'

export function Experience() {
  return (
    <section id="experience" aria-label="Work experience" className="py-16 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Experience</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        My work history.{' '}
        <a
          href="/resume.pdf"
          className="underline underline-offset-4 transition-colors hover:text-foreground"
          download
        >
          Download my resume
        </a>
      </p>

      <div className="mt-8 space-y-0">
        {experience.map((job, index) => (
          <div key={index} className="relative pl-8 pb-10 last:pb-0">
            {/* Timeline line */}
            {index < experience.length - 1 && (
              <div className="absolute left-[7px] top-[10px] h-full w-px bg-border" />
            )}
            {/* Timeline dot */}
            <div className="absolute left-0 top-[6px] h-[15px] w-[15px] rounded-full border-2 border-amber-500/80 bg-background" />

            <div>
              <h3 className="text-base font-semibold text-foreground">{job.role}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {job.companyUrl ? (
                  <a
                    href={job.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
                {' · '}
                {job.location}
                {' · '}
                {job.type}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground/70">
                {job.startDate} — {job.endDate}
              </p>
              <ul className="mt-3 space-y-1.5">
                {job.bullets.map((bullet, i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                    <span className="mr-2 text-muted-foreground/50">•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
