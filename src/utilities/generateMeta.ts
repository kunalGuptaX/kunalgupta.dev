import type { Metadata } from 'next'

import type { Media, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getSiteConfig } from './getSiteConfig'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/og.png'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const config = await getSiteConfig()

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | ' + config.name
    : config.name

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      type: 'article',
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
      ...(doc?.publishedAt ? { publishedTime: doc.publishedAt } : {}),
    }),
    title,
    alternates: {
      canonical: `/blog/${doc?.slug}`,
    },
  }
}
