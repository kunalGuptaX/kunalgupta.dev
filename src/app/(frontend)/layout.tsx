import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { Nav } from '@/components/nav'
import { SiteFooter } from '@/components/footer'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import { getSiteConfig } from '@/utilities/getSiteConfig'

import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig()

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
    description: config.bio,
    sameAs: Object.values(config.socials).filter(Boolean),
  }

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main-content" className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()

  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: `${config.name} | ${config.title}`,
      template: `%s | ${config.name}`,
    },
    description: config.bio,
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: '/',
    },
  }
}
