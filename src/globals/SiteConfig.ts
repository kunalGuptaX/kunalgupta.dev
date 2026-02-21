import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from './hooks/revalidateGlobal'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Config',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('site-config')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Kunal Gupta',
    },
    {
      name: 'initials',
      type: 'text',
      required: true,
      defaultValue: '{ KG.dev }',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Senior Software Developer',
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        {
          name: 'github',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
      ],
    },
    {
      name: 'nav',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
