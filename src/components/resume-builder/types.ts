export type ResumeData = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  summary: string
  skills: string[]
  experience: {
    role: string
    company: string
    startDate: string
    endDate: string
    location: string
    bullets: string[]
  }[]
  education: {
    degree: string
    school: string
    startDate: string
    endDate: string
    location: string
  }[]
  projects: {
    name: string
    description: string
    techStack: string[]
    liveUrl?: string
    sourceUrl?: string
  }[]
  strengths: string[]
}

export const emptyResumeData: ResumeData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  strengths: [],
}

export const defaultResumeData: ResumeData = {
  name: 'Alex Johnson',
  title: 'Full Stack Developer',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'https://linkedin.com/in/alexjohnson',
  github: 'https://github.com/alexjohnson',
  summary:
    'Full Stack Developer with 5+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and delivering exceptional user experiences. Experienced in leading small teams and shipping products from concept to production.',
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'PostgreSQL',
    'GraphQL',
    'AWS',
    'Docker',
    'Tailwind CSS',
    'Python',
    'Redis',
    'Git',
  ],
  experience: [
    {
      role: 'Senior Frontend Engineer',
      company: 'TechCorp Inc.',
      startDate: 'Jan 2022',
      endDate: 'Present',
      location: 'San Francisco, CA',
      bullets: [
        'Led migration of legacy jQuery app to React/Next.js, improving page load times by 60%',
        'Designed and implemented a component library used across 4 product teams',
        'Mentored 3 junior developers through code reviews and pair programming sessions',
      ],
    },
    {
      role: 'Full Stack Developer',
      company: 'StartupXYZ',
      startDate: 'Jun 2019',
      endDate: 'Dec 2021',
      location: 'Remote',
      bullets: [
        'Built and maintained REST APIs serving 50k+ daily active users',
        'Implemented real-time collaboration features using WebSockets',
        'Reduced infrastructure costs by 40% through database query optimization',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      school: 'University of California, Berkeley',
      startDate: 'Aug 2015',
      endDate: 'May 2019',
      location: 'Berkeley, CA',
    },
  ],
  projects: [
    {
      name: 'DevBoard',
      description:
        'A real-time project management dashboard for developer teams with Kanban boards, sprint tracking, and GitHub integration.',
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      liveUrl: 'https://devboard.example.com',
      sourceUrl: 'https://github.com/alexjohnson/devboard',
    },
    {
      name: 'CloudDeploy CLI',
      description:
        'An open-source CLI tool that simplifies deploying containerized applications to AWS with zero-config defaults.',
      techStack: ['Node.js', 'Docker', 'AWS SDK', 'Commander.js'],
      sourceUrl: 'https://github.com/alexjohnson/clouddeploy',
    },
  ],
  strengths: [
    'Problem Solving',
    'System Design',
    'Team Leadership',
    'Technical Communication',
    'Agile Methodologies',
    'Continuous Learning',
  ],
}
