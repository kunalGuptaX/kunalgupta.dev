import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Shield, Users, FileText, CheckCircle2 } from 'lucide-react'
import { TemplateShowcase } from '@/components/resume-builder/template-showcase'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

/* ── SEO Metadata ── */

const siteUrl = getServerSideURL()
const pageUrl = `${siteUrl}/resume-builder`

export const metadata: Metadata = {
  title: 'Free Resume Builder Online — No Sign-Up, ATS-Friendly Templates',
  description:
    'Build a professional ATS-compatible resume for free. 8 beautiful templates, no account required, no data collection. 100% browser-based, open-source resume builder — your data never leaves your device.',
  keywords: [
    'free resume builder',
    'ATS resume builder',
    'free ATS resume builder',
    'open source resume builder',
    'resume builder no sign up',
    'free resume maker',
    'online resume builder',
    'resume builder no login',
    'ATS-friendly resume templates',
    'privacy-first resume builder',
    'resume builder free no account',
    'best free resume builder',
    'resume templates free',
    'professional resume builder',
    'resume builder open source',
  ],
  alternates: {
    canonical: '/resume-builder',
  },
  openGraph: mergeOpenGraph({
    title: 'Free Resume Builder — ATS Templates, No Sign-Up Required',
    description:
      'Build a professional resume for free with 8 ATS-compatible templates. No account, no paywall. Your data stays in your browser.',
    url: pageUrl,
    type: 'website',
  }),
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder — ATS Templates, No Sign-Up',
    description:
      'Build a professional resume for free. 8 ATS-compatible templates, privacy-first, open source.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
}

/* ── Data ── */

const features = [
  {
    icon: Heart,
    title: 'Free Forever',
    description:
      'No hidden fees, no premium tier, no "upgrade to unlock." Every feature is available to everyone.',
  },
  {
    icon: Users,
    title: 'Built for Community',
    description:
      'Open source and community-driven. Built by developers, designed for everyone.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'All data stays in your browser. Nothing is sent to any server — your resume is yours alone.',
  },
]

const highlights = [
  '8 ATS-compatible professional templates',
  'Real-time live preview as you type',
  'Export to PDF or JSON for any job board',
  'Customizable fonts, colors, and spacing',
  'Section reordering via drag and drop',
  'Works offline — no internet required after load',
]

const faqs = [
  {
    q: 'Is this resume builder really free?',
    a: 'Yes, 100% free with no hidden fees. There is no premium tier, no feature gating, and no "upgrade to unlock" prompts. Every template and feature is available to everyone.',
  },
  {
    q: 'Do I need to create an account or sign up?',
    a: 'No. You can start building your resume immediately — no account, no email, no sign-up required. Your data is stored locally in your browser.',
  },
  {
    q: 'Are the resume templates ATS-compatible?',
    a: 'Yes. All 8 templates are designed to pass Applicant Tracking Systems (ATS). They use clean HTML structure, standard section headings, and avoid complex layouts that confuse ATS parsers.',
  },
  {
    q: 'Where is my resume data stored?',
    a: "All data stays in your browser's local storage. Nothing is sent to any server. Your resume data never leaves your device, giving you complete privacy and control.",
  },
  {
    q: 'Can I export my resume as a PDF?',
    a: 'Yes. You can export to PDF for printing or uploading to job applications, and to JSON for backup and portability.',
  },
  {
    q: 'Is this resume builder open source?',
    a: 'Yes. The entire project is open source and community-driven. You can view the source code, contribute improvements, or fork it to build your own version.',
  },
]

/* ── JSON-LD Structured Data ── */

const softwareAppJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Free Resume Builder',
  url: pageUrl,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any (Web Browser)',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Free open-source resume builder with 8 ATS-compatible templates. No sign-up required. Privacy-first — all data stays in your browser.',
  featureList: [
    '8 ATS-compatible professional templates',
    'Real-time live preview',
    'PDF and JSON export',
    'Customizable fonts, colors, and spacing',
    'Drag-and-drop section reordering',
    'Works offline',
    'No account or sign-up required',
    'Privacy-first — data stays in browser',
  ],
  screenshot: `${siteUrl}/og.png`,
  author: {
    '@type': 'Person',
    name: 'Kunal Gupta',
    url: siteUrl,
  },
})

const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
})

const breadcrumbJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Resume Builder', item: pageUrl },
  ],
})

/* ── Page ── */

export default function ResumeBuilderPage() {
  return (
    <>
      {/* Structured data for search engines & AI answer engines */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: softwareAppJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Free Resume Builder.
            <br />
            <span className="text-zinc-400">No Sign-Up. ATS-Ready.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Build a professional, ATS-compatible resume in minutes. 8 beautiful
            templates, real-time preview, PDF export — completely free, forever.
            Your data never leaves your browser.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href="/resume-builder/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Start Building — It&apos;s Free
              <ArrowRight className="size-4" />
            </Link>
            <span className="text-xs text-muted-foreground">
              No sign-up required &middot; No data collected
            </span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-zinc-900/40 p-6"
              >
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-zinc-800">
                  <f.icon className="size-5 text-zinc-400" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center sm:text-3xl">
            Everything you need to land the interview
          </h2>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Template Showcase ── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4" />
              8 Professional Templates
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              ATS-compatible templates for every style
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Classic, Modern, Executive, and more — designed to pass Applicant
              Tracking Systems and look great on screen and paper.
            </p>
          </div>
          <TemplateShowcase />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center sm:text-3xl mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-sm font-semibold text-foreground">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Support ── */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="size-4" />
            Open Source
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Support This Project
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            This is a passion project kept free for everyone. If it helped you
            land an interview, consider leaving a tip to help keep it running.
          </p>
          <a
            href="https://www.buymeacoffee.com/kunalguptax"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#FFDD00' }}
          >
            <Heart className="size-4" />
            Buy Me a Coffee
          </a>
        </div>
      </section>
    </>
  )
}
