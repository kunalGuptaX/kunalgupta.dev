import { siteConfig } from '@/data/site'

export function Hero() {
  return (
    <section className="pb-16 pt-20 sm:pb-24 sm:pt-28">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {siteConfig.title}
      </p>
      <p className="mt-4 max-w-[540px] text-base leading-relaxed text-muted-foreground">
        {siteConfig.bio}
      </p>
    </section>
  )
}
