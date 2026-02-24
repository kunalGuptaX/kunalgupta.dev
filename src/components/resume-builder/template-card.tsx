// src/components/resume-builder/template-card.tsx
'use client'

import { useRouter } from 'next/navigation'
import type { TemplateConfig } from './types'
import { TemplateThumbnail } from './template-thumbnail'

type TemplateCardProps = {
  template: TemplateConfig
}

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/resume-builder/edit?template=${template.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className="group relative text-left rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden transition-all hover:border-zinc-600 hover:shadow-lg"
    >
      <div className="relative aspect-[8.5/11] bg-zinc-800 overflow-hidden">
        <TemplateThumbnail template={template} />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-white">{template.name}</h3>
        <p className="text-xs text-zinc-500 mt-0.5">{template.description}</p>
      </div>
    </button>
  )
}
