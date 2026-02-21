import type { Metadata } from 'next'
import { Monitor } from 'lucide-react'
import { ResumeBuilder } from '@/components/resume-builder/builder'
import { getSiteConfig } from '@/utilities/getSiteConfig'
import { getResume } from '@/utilities/getResume'
import { siteToResumeData } from '@/utilities/siteToResumeData'

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
    <>
      {/* Mobile/tablet message */}
      <div className="flex lg:hidden print:hidden flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <Monitor className="size-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Desktop Only</h2>
        <p className="text-muted-foreground max-w-sm">
          The Resume Builder requires a larger screen. Please open this page on a desktop or laptop computer.
        </p>
      </div>
      {/* Desktop builder */}
      <div className="hidden lg:contents print:contents">
        <ResumeBuilder prefillData={prefillData} autoDownload={autoDownload} />
      </div>
    </>
  )
}
