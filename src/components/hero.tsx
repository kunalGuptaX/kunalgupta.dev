import { getSiteConfig } from '@/utilities/getSiteConfig'

export async function Hero() {
  const config = await getSiteConfig()

  return (
    <section aria-label="About" className="pb-4 pt-20 sm:pb-4 sm:pt-28">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {config.name}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {config.title}
      </p>
      <p className="mt-4 max-w-[540px] text-base leading-relaxed text-muted-foreground">
        {config.bio}
      </p>
    </section>
  )
}
