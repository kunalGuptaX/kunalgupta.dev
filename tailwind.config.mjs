/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#a1a1aa',
            '--tw-prose-headings': '#fafafa',
            '--tw-prose-lead': '#a1a1aa',
            '--tw-prose-links': '#fafafa',
            '--tw-prose-bold': '#fafafa',
            '--tw-prose-counters': '#71717a',
            '--tw-prose-bullets': '#52525b',
            '--tw-prose-hr': '#27272a',
            '--tw-prose-quotes': '#d4d4d8',
            '--tw-prose-quote-borders': '#27272a',
            '--tw-prose-captions': '#71717a',
            '--tw-prose-code': '#fafafa',
            '--tw-prose-pre-code': '#d4d4d8',
            '--tw-prose-pre-bg': '#18181b',
            '--tw-prose-th-borders': '#3f3f46',
            '--tw-prose-td-borders': '#27272a',
            '--tw-prose-invert-body': '#a1a1aa',
            '--tw-prose-invert-headings': '#fafafa',
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
              marginBottom: '0.5em',
            },
            h2: {
              fontWeight: '700',
              fontSize: '1.5rem',
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.125rem',
            },
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              '&:hover': {
                color: '#d4d4d8',
              },
            },
            code: {
              backgroundColor: '#27272a',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.25rem',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      }),
    },
  },
}

export default config
