import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/utilities/formatDateTime'

interface BlogCardProps {
  title: string
  slug: string
  publishedAt?: string | null
  description?: string | null
  categories?: Array<{ title: string; slug?: string | null }> | null
  heroImage?: { url: string | null; alt: string | null } | null
}

export function BlogCard({ title, slug, publishedAt, description, categories, heroImage }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block py-4">
      <article className="flex gap-4">
        {heroImage?.url && (
          <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-md sm:block">
            <Image
              src={heroImage.url}
              alt={heroImage.alt || title}
              fill
              className="object-cover transition-opacity group-hover:opacity-80"
              sizes="80px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-muted-foreground">
              {title}
            </h3>
            {publishedAt && (
              <time className="shrink-0 text-xs text-muted-foreground/70" dateTime={publishedAt}>
                {formatDateTime(publishedAt)}
              </time>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
          {categories && categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <Badge
                  key={cat.title}
                  variant="secondary"
                  className="px-2 py-0.5 text-xs font-normal"
                >
                  {cat.title}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
