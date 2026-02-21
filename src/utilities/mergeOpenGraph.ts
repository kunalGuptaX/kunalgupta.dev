import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Senior Software Developer. Building scalable software with 6+ years of experience.',
  images: [
    {
      url: `${getServerSideURL()}/og.png`,
    },
  ],
  siteName: 'Kunal Gupta',
  title: 'Kunal Gupta | Senior Software Developer',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
