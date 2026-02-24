'use client'

import { templateRegistry } from './templates/registry'
import { TemplateThumbnail } from './template-thumbnail'

type TemplatePickerProps = {
  currentTemplateId: string
  onSelect: (templateId: string) => void
}

export function TemplatePicker({ currentTemplateId, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {templateRegistry.map((t) => {
        const selected = t.id === currentTemplateId

        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`relative rounded-md border overflow-hidden transition-all text-left ${
              selected
                ? 'ring-2 ring-primary border-primary'
                : 'border-border hover:border-zinc-600'
            } cursor-pointer`}
          >
            <div className="relative aspect-[8.5/11] bg-zinc-800 overflow-hidden">
              <TemplateThumbnail template={t} />
            </div>
            <div className="px-2 py-1.5">
              <span className="text-xs font-medium text-foreground leading-tight block truncate">
                {t.name}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
