import type { Metadata } from 'next'
import { Inter, Bitter } from 'next/font/google'
import { Monitor } from 'lucide-react'
import { ResumeEditor } from '@/components/resume-builder/builder'
import { BmcWidget } from '@/components/bmc-widget'
import { getSiteConfig } from '@/utilities/getSiteConfig'
import { getResume } from '@/utilities/getResume'
import { siteToResumeData } from '@/utilities/siteToResumeData'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })
const bitter = Bitter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-bitter',
})

const fontClassName = `${inter.className} ${bitter.variable}`

export const metadata: Metadata = {
  title: 'Resume Builder | Edit',
  description: 'Edit your resume with inline editing and live preview.',
  robots: { index: false, follow: true },
}

export default async function ResumeEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; template?: string; source?: string; download?: string }>
}) {
  const params = await searchParams
  let prefillData = undefined

  if (params.source === 'portfolio') {
    const [config, resume] = await Promise.all([getSiteConfig(), getResume()])
    prefillData = siteToResumeData(config, resume)
  }

  // Generate a new ID when navigating with just a template (e.g. from template showcase)
  const resumeId = params.id || crypto.randomUUID()

  if (!params.id && !params.template) {
    return (
      <div className={fontClassName}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <p className="text-muted-foreground mb-4">No resume selected.</p>
          <a href="/resume-builder/dashboard" className="text-sm text-blue-400 hover:underline">Go to dashboard</a>
        </div>
      </div>
    )
  }

  return (
    <div className={fontClassName}>
      <div className="flex lg:hidden print:hidden flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <Monitor className="size-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Desktop Only</h2>
        <p className="text-muted-foreground max-w-sm">
          The Resume Builder requires a larger screen.
        </p>
      </div>
      <div className="hidden lg:contents print:contents">
        <ResumeEditor
          resumeId={resumeId}
          initialTemplateId={params.template}
          prefillData={prefillData}
          autoDownload={params.download === 'true'}
          fontClassName={fontClassName}
        />
      </div>
      <BmcWidget />
    </div>
  )
}
