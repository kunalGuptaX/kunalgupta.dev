'use client'

import Link from 'next/link'
import { siteConfig } from '@/data/site'
import { IconGitHub, IconLinkedIn, IconTwitter } from '@/components/icons'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[680px] items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-lg font-bold text-foreground" aria-label="Home">
          {siteConfig.initials}
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label="Main navigation" className="hidden items-center gap-6 sm:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3" aria-label="Social links" role="group">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <IconGitHub className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <IconLinkedIn className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="X / Twitter"
            >
              <IconTwitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
