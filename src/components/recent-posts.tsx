import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const getRecentPosts = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.find({
      collection: 'posts',
      depth: 1,
      limit: 4,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        publishedAt: true,
        heroImage: true,
      },
      sort: '-publishedAt',
    })
  },
  ['recent-posts'],
  { tags: ['posts-list'] },
)

export async function RecentPosts() {
  const posts = await getRecentPosts()

  if (posts.docs.length === 0) return null

  return (
    <section aria-label="Recent posts" className="pb-16 sm:pb-20">
      <p className="mt-2 text-sm text-muted-foreground">Latest from the blog.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {posts.docs.map((post) => {
          const image =
            post.heroImage && typeof post.heroImage === 'object'
              ? {
                  url:
                    post.heroImage.sizes?.thumbnail?.url ||
                    post.heroImage.url ||
                    null,
                  alt: post.heroImage.alt || post.title,
                }
              : null

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-border"
            >
              <div className="relative aspect-[16/9] w-full bg-muted">
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt || post.title}
                    fill
                    className="object-cover transition-opacity group-hover:opacity-80"
                    sizes="(min-width: 640px) 220px, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground/50">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between p-3">
                <h3 className="text-sm font-medium leading-snug text-foreground line-clamp-2 group-hover:text-muted-foreground transition-colors">
                  {post.title}
                </h3>
                {post.publishedAt && (
                  <time
                    className="mt-1.5 block text-xs text-muted-foreground/60"
                    dateTime={post.publishedAt}
                  >
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </Link>
          )
        })}

        {/* View All card */}
        <Link
          href="/blog"
          className="group flex flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border/50 bg-card transition-colors hover:border-border"
        >
          <div className="flex flex-col items-center gap-2 p-6">
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              View all posts
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
