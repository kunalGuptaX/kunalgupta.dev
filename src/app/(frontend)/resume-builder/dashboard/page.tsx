import type { Metadata } from 'next'
import { TemplateGallery } from '@/components/resume-builder/template-gallery'

export const metadata: Metadata = {
  title: 'Resume Builder | Dashboard',
  description: 'Create, edit, and manage your resumes.',
  robots: { index: false, follow: true },
}

export default function ResumeBuilderDashboardPage() {
  return <TemplateGallery />
}
