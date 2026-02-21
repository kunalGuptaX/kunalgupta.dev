import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[680px] flex-col items-center justify-center px-6 py-32">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="mt-2 text-muted-foreground">This page could not be found.</p>
      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      >
        Go back home
      </Link>
    </div>
  )
}
