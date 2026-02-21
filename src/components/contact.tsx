import { getSiteConfig } from '@/utilities/getSiteConfig'
import { IconGitHub, IconLinkedIn, IconTwitter } from '@/components/icons'
import { Mail } from 'lucide-react'

export async function Contact() {
  const config = await getSiteConfig()

  return (
    <section id="contact" aria-label="Contact information" className="py-16 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Get in touch</h2>
      <p className="mt-2 max-w-[480px] text-sm leading-relaxed text-muted-foreground">
        I&apos;m always open to new opportunities and interesting conversations. Feel free to reach
        out.
      </p>
      <div className="mt-6 flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <a
          href={`mailto:${config.email}`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {config.email}
        </a>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <a
          href={config.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="GitHub"
        >
          <IconGitHub className="h-5 w-5" />
        </a>
        <a
          href={config.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="LinkedIn"
        >
          <IconLinkedIn className="h-5 w-5" />
        </a>
        <a
          href={config.socials.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="X / Twitter"
        >
          <IconTwitter className="h-5 w-5" />
        </a>
      </div>
    </section>
  )
}
