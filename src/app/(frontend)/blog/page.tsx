import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { BlogCard } from '@/components/blog-card'

function extractTextFromLexical(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  const texts: string[] = []
  const walk = (nodes: unknown[]) => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue
      const n = node as { type?: string; text?: string; children?: unknown[] }
      if (n.type === 'text' && n.text) texts.push(n.text)
      if (n.children) walk(n.children)
    }
  }
  walk(root.children as unknown[])
  const full = texts.join(' ').trim()
  return full.length > 160 ? full.slice(0, 160) + '...' : full
}

export const dynamic = 'force-static'
export const revalidate = 600

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 50,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      publishedAt: true,
      meta: true,
      content: true,
    },
    sort: '-publishedAt',
  })

  return (
    <div className="mx-auto max-w-[680px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thoughts on software development, tools, and technology.
      </p>

      <div className="mt-10 divide-y divide-border/50">
        {posts.docs.length > 0 ? (
          posts.docs.map((post) => {
            const categories =
              post.categories?.map((cat) =>
                typeof cat === 'object' ? { title: cat.title, slug: cat.slug } : { title: '', slug: null },
              ) ?? null

            return (
              <BlogCard
                key={post.slug}
                title={post.title}
                slug={post.slug!}
                publishedAt={post.publishedAt ?? null}
                description={post.meta?.description || extractTextFromLexical(post.content) || null}
                categories={categories}
              />
            )
          })
        ) : (
          <p className="py-8 text-sm text-muted-foreground">No posts yet. Check back soon.</p>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Blog',
    description: 'Thoughts on software development, tools, and technology.',
  }
}
