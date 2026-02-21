import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export function revalidateGlobal(tag: string): GlobalAfterChangeHook {
  return ({ req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating global: ${tag}`)
      revalidateTag(tag)
      revalidatePath('/')
    }
  }
}
