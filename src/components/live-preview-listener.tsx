'use client'

import { useRouter } from 'next/navigation'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { getClientSideURL } from '@/utilities/getURL'

export function LivePreviewListener() {
  const router = useRouter()
  return <RefreshRouteOnSave serverURL={getClientSideURL()} refresh={router.refresh} />
}
