import Link from 'next/link'
import { siteConfig } from '@/data/site'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/50">
      <div className="mx-auto flex max-w-[680px] flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p className="text-sm text-muted-foreground">
          Built with{' '}
          <Link
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Next.js
          </Link>
          {' & '}
          <Link
            href="https://payloadcms.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Payload
          </Link>
        </p>
      </div>
    </footer>
  )
}
