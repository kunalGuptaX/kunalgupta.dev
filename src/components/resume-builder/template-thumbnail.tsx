'use client'

import { useRef, useState, useEffect, memo } from 'react'
import type { TemplateConfig, ThemeConfig } from './types'
import { defaultResumeDataV2, DEFAULT_SECTION_ORDER_V2 } from './types/resume'
import { ClassicLayout } from './templates/layouts/classic'
import { MinimalLayout } from './templates/layouts/minimal'
import { ProfessionalLayout } from './templates/layouts/professional'
import { ModernLayout } from './templates/layouts/modern'
import { ExecutiveLayout } from './templates/layouts/executive'
import { CompactLayout } from './templates/layouts/compact'
import { BoldLayout } from './templates/layouts/bold'
import { TimelineLayout } from './templates/layouts/timeline'

const layoutComponents: Record<string, typeof ClassicLayout> = {
  classic: ClassicLayout,
  minimal: MinimalLayout,
  professional: ProfessionalLayout,
  modern: ModernLayout,
  executive: ExecutiveLayout,
  compact: CompactLayout,
  bold: BoldLayout,
  timeline: TimelineLayout,
}

/** Full A4 width that the layout components are designed for */
const A4_WIDTH = 794

const sampleSectionOrder = [...DEFAULT_SECTION_ORDER_V2]
const noop = () => {}

type TemplateThumbnailProps = {
  template: TemplateConfig
  /** Override the theme (e.g. to show current user theme instead of template default) */
  themeOverride?: ThemeConfig
}

/**
 * Renders a live mini-preview of a resume template using the actual layout
 * component scaled down to fit the container. The container should set its
 * own width and aspect-ratio (e.g. `aspect-[8.5/11]`).
 */
export const TemplateThumbnail = memo(function TemplateThumbnail({
  template,
  themeOverride,
}: TemplateThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      if (w > 0) setScale(w / A4_WIDTH)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const LayoutComponent = layoutComponents[template.layout] ?? ClassicLayout
  const theme = themeOverride ?? template.defaultTheme

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden bg-white relative"
    >
      {scale > 0 && (
        <div
          style={{
            width: `${A4_WIDTH}px`,
            padding: '40px 44px',
            boxSizing: 'border-box',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          <LayoutComponent
            data={defaultResumeDataV2}
            theme={theme}
            isEditing={false}
            sectionOrder={sampleSectionOrder}
            hiddenSections={[]}
            onDataChange={noop}
            onSectionOrderChange={noop}
          />
        </div>
      )}
    </div>
  )
})
