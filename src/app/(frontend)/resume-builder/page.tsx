import type { Metadata } from 'next'
import { Inter, Bitter } from 'next/font/google'
import { Monitor } from 'lucide-react'
import { ResumeBuilder } from '@/components/resume-builder/builder'
import { getSiteConfig } from '@/utilities/getSiteConfig'
import { getResume } from '@/utilities/getResume'
import { siteToResumeData } from '@/utilities/siteToResumeData'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })
const bitter = Bitter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-bitter' })

const fontClassName = `${inter.className} ${bitter.variable}`

export const metadata: Metadata = {
  title: 'Resume Builder',
  description: 'Build and customize your resume with a live preview. Export as PDF or JSON.',
}

export default async function ResumeBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; download?: string }>
}) {
  const params = await searchParams
  let prefillData = undefined

  if (params.source === 'portfolio') {
    const [config, resume] = await Promise.all([getSiteConfig(), getResume()])
    prefillData = siteToResumeData(config, resume)
  }

  const autoDownload = params.download === 'true'

  return (
    <div className={fontClassName}>
      {/* Mobile/tablet message — hidden during auto-download and print */}
      {!autoDownload && (
        <div className="flex lg:hidden print:hidden flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <Monitor className="size-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Desktop Only</h2>
          <p className="text-muted-foreground max-w-sm">
            The Resume Builder requires a larger screen. Please open this page on a desktop or laptop computer.
          </p>
        </div>
      )}
      {/* Builder: visually hidden on mobile but still rendered so fonts load.
          Uses visibility:hidden + h-0 overflow-hidden instead of display:none
          so the browser still downloads required fonts. */}
      <div className={autoDownload ? 'invisible h-0 overflow-hidden print:visible print:h-auto print:overflow-visible' : 'hidden lg:contents print:contents'}>
        <ResumeBuilder prefillData={prefillData} autoDownload={autoDownload} fontClassName={fontClassName} />
      </div>
    </div>
  )
}
