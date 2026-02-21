import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { notFound } from 'next/navigation'

import type { Category } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { formatDateTime } from '@/utilities/formatDateTime'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

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
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return notFound()

  const categories = (post.categories ?? []).filter(
    (cat): cat is Category => typeof cat === 'object',
  )

  return (
    <article className="mx-auto max-w-[680px] px-6 pb-24 pt-20">
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
            <time className="text-sm text-muted-foreground">{formatDateTime(post.publishedAt)}</time>
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

      <div className="mt-10">
        <RichText className="max-w-none" data={post.content} enableGutter={false} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
