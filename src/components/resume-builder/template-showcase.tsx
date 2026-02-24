'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { templateRegistry } from './templates/registry'
import { TemplateThumbnail } from './template-thumbnail'
import type { TemplateConfig } from './types'

function LazyTemplateCard({ template, index, visible }: {
  template: TemplateConfig
  index: number
  visible: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      href={`/resume-builder/edit?template=${template.id}`}
      className="group relative block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 transition-all duration-300 group-hover:border-zinc-500 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.06)] group-hover:-translate-y-1">
        <div ref={ref} className="aspect-[8.5/11] bg-zinc-800 overflow-hidden">
          {inView && <TemplateThumbnail template={template} />}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-white">{template.name}</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">{template.description}</p>
        </div>
      </div>
    </Link>
  )
}

export function TemplateShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {templateRegistry.map((t, i) => (
          <LazyTemplateCard key={t.id} template={t} index={i} visible={visible} />
        ))}
      </div>
    </div>
  )
}
