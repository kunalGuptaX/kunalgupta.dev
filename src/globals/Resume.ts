import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from './hooks/revalidateGlobal'

export const Resume: GlobalConfig = {
  slug: 'resume',
  label: 'Resume',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal('resume')],
  },
  fields: [
    {
      name: 'skills',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'experience',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
          required: true,
        },
        {
          name: 'companyUrl',
          type: 'text',
        },
        {
          name: 'location',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'text',
          required: true,
        },
        {
          name: 'startDate',
          type: 'text',
          required: true,
        },
        {
          name: 'endDate',
          type: 'text',
          required: true,
        },
        {
          name: 'bullets',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'projects',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'techStack',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'liveUrl',
          type: 'text',
        },
        {
          name: 'sourceUrl',
          type: 'text',
        },
      ],
    },
  ],
}
