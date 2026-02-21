export const siteConfig = {
  name: 'Kunal Gupta',
  initials: '{ KG.dev }',
  title: 'Senior Software Developer',
  bio: 'Building scalable software with 6+ years of experience across full-stack development, cloud infrastructure, and developer tooling.',
  email: 'kunalgupta.contact@gmail.com',
  url: 'https://kunalgupta.dev',
  socials: {
    github: 'https://github.com/kunalguptaX',
    linkedin: 'https://linkedin.com/in/kunalgupta26',
    twitter: 'https://x.com/kunalguptadevx',
  },
  nav: [
    { label: 'Resume', href: '/#experience' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ],
} as const

export const socialUrls = Object.values(siteConfig.socials)
