import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/utilities/formatDateTime'

interface BlogCardProps {
  title: string
  slug: string
  publishedAt?: string | null
  description?: string | null
  categories?: Array<{ title: string; slug?: string | null }> | null
}

export function BlogCard({ title, slug, publishedAt, description, categories }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block py-4">
      <article>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-muted-foreground">
            {title}
          </h3>
          {publishedAt && (
            <time className="shrink-0 text-xs text-muted-foreground/70">
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
      </article>
    </Link>
  )
}
