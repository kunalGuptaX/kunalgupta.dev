'use client'

import { useState } from 'react'
import type { Skill, Experience, Project } from '@/data/resume'

export type ResumeDownloadProps = {
  name: string
  title: string
  email: string
  socials: { github: string; linkedin: string; twitter: string }
  skills: Skill[]
  experience: Experience[]
  projects: Project[]
}

export function ResumeDownloadButton(props: ResumeDownloadProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle')

  async function handleClick() {
    if (state === 'loading') return
    setState('loading')

    const [{ pdf }, { ResumeClassicTemplate }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('./template-classic'),
    ])

    const blob = await pdf(
      ResumeClassicTemplate({
        name: props.name,
        title: props.title,
        email: props.email,
        socials: props.socials,
        skills: props.skills,
        experience: props.experience,
        projects: props.projects,
      }),
    ).toBlob()

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.name.replace(/\s+/g, '_')}_Resume.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setState('ready')
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      className="underline underline-offset-4 transition-colors hover:text-foreground disabled:opacity-50"
    >
      {state === 'loading' ? 'Preparing resume...' : 'Download my resume'}
    </button>
  )
}
