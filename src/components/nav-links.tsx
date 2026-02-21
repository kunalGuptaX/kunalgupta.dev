'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks({ items }: { items: { label: string; href: string }[] }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-6 sm:flex">
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(item.href + '/')

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`text-sm transition-colors hover:text-foreground ${
              isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
