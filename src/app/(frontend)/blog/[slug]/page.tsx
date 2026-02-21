import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React from 'react'
import Image from 'next/image'
import RichText from '@/components/RichText'
import { notFound } from 'next/navigation'

import type { Category } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getServerSideURL } from '@/utilities/getURL'
import { getSiteConfig } from '@/utilities/getSiteConfig'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { LivePreviewListener } from '@/components/live-preview-listener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function BlogPost({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const { isEnabled: draft } = await draftMode()
  const [post, config] = await Promise.all([
    queryPostBySlug({ slug: decodedSlug, draft }),
    getSiteConfig(),
  ])

  if (!post) return notFound()

  const categories = (post.categories ?? []).filter(
    (cat): cat is Category => typeof cat === 'object',
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: config.name,
      url: config.url,
    },
    description: post.meta?.description || '',
    url: `${getServerSideURL()}/blog/${post.slug}`,
  }

  return (
    <article className="mx-auto max-w-[680px] px-6 pb-24 pt-20">
      {draft && <LivePreviewListener />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <Link
          href="/blog"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to blog
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3">
          {post.publishedAt && (
            <time className="text-sm text-muted-foreground" dateTime={post.publishedAt}>
              {formatDateTime(post.publishedAt)}
            </time>
          )}
          {categories.length > 0 && (
            <div className="flex gap-1.5">
              {categories.map((cat) => (
                <Badge key={cat.title} variant="secondary" className="px-2 py-0.5 text-xs font-normal">
                  {cat.title}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      {post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url && (
        <div className="mt-8 overflow-hidden rounded-lg">
          <Image
            src={post.heroImage.url}
            alt={post.heroImage.alt || post.title}
            width={post.heroImage.width || 680}
            height={post.heroImage.height || 400}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-10">
        <RichText className="max-w-none" data={post.content} enableGutter={false} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug, draft: false })

  return generateMeta({ doc: post })
}

async function queryPostBySlug({ slug, draft }: { slug: string; draft?: boolean }) {
  if (draft) {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      draft: true,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        slug: { equals: slug },
      },
    })
    return result.docs?.[0] || null
  }

  const getCachedPost = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'posts',
        draft: false,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        where: {
          slug: { equals: slug },
        },
      })
      return result.docs?.[0] || null
    },
    [`post-${slug}`],
    { tags: [`post-${slug}`, 'posts-list'] },
  )

  return getCachedPost()
}
