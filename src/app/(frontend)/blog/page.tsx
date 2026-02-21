import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import React from 'react'
import { BlogCard } from '@/components/blog-card'
import { getSiteConfig } from '@/utilities/getSiteConfig'
import { getServerSideURL } from '@/utilities/getURL'

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

const getCachedPosts = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })

    return payload.find({
      collection: 'posts',
      depth: 1,
      limit: 50,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        categories: true,
        publishedAt: true,
        heroImage: true,
        meta: true,
        content: true,
      },
      sort: '-publishedAt',
    })
  },
  ['posts-list'],
  { tags: ['posts-list'] },
)

export default async function BlogPage() {
  const [posts, config] = await Promise.all([getCachedPosts(), getSiteConfig()])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog',
    description: 'Thoughts on software development, tools, and technology.',
    url: `${getServerSideURL()}/blog`,
    isPartOf: {
      '@type': 'WebSite',
      name: config.name,
      url: config.url,
    },
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

            const heroImage = post.heroImage && typeof post.heroImage === 'object'
              ? { url: post.heroImage.sizes?.thumbnail?.url || post.heroImage.url || null, alt: post.heroImage.alt || post.title }
              : null

            return (
              <BlogCard
                key={post.slug}
                title={post.title}
                slug={post.slug!}
                publishedAt={post.publishedAt ?? null}
                description={post.meta?.description || extractTextFromLexical(post.content) || null}
                categories={categories}
                heroImage={heroImage}
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
    alternates: {
      canonical: '/blog',
    },
  }
}
