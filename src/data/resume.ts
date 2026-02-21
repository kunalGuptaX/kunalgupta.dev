export interface Skill {
  name: string
  icon?: string
}

export interface Experience {
  role: string
  company: string
  companyUrl?: string
  location: string
  type: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface Project {
  name: string
  description: string
  techStack: string[]
  liveUrl?: string
  sourceUrl?: string
}

export const skills: Skill[] = [
  // Languages
  { name: 'TypeScript' },
  { name: 'JavaScript' },
  { name: 'Python' },
  { name: 'Go' },
  { name: 'Java' },
  { name: 'SQL' },

  // Frontend
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'Tailwind CSS' },
  { name: 'Vue.js' },

  // Backend
  { name: 'Node.js' },
  { name: 'Express' },
  { name: 'FastAPI' },
  { name: 'GraphQL' },
  { name: 'REST APIs' },

  // Databases
  { name: 'PostgreSQL' },
  { name: 'MongoDB' },
  { name: 'Redis' },
  { name: 'DynamoDB' },

  // Cloud & DevOps
  { name: 'AWS' },
  { name: 'Docker' },
  { name: 'Kubernetes' },
  { name: 'Terraform' },
  { name: 'CI/CD' },
  { name: 'Git' },
]

export const experience: Experience[] = [
  {
    role: 'Senior Software Developer',
    company: 'Company Name',
    companyUrl: 'https://example.com',
    location: 'Remote',
    type: 'Full-time',
    startDate: 'Jan 2022',
    endDate: 'Present',
    bullets: [
      'Led the architecture and development of a microservices platform serving 1M+ requests/day',
      'Mentored a team of 5 junior developers, establishing code review practices and technical standards',
      'Reduced deployment time by 60% by implementing CI/CD pipelines with GitHub Actions and Docker',
      'Designed and built real-time data processing pipelines using Kafka and PostgreSQL',
    ],
  },
  {
    role: 'Software Developer',
    company: 'Previous Company',
    companyUrl: 'https://example.com',
    location: 'San Francisco, CA',
    type: 'Full-time',
    startDate: 'Jun 2019',
    endDate: 'Dec 2021',
    bullets: [
      'Built and maintained customer-facing React applications with 99.9% uptime',
      'Developed RESTful APIs and GraphQL services powering web and mobile clients',
      'Implemented automated testing strategies, increasing code coverage from 40% to 85%',
      'Collaborated with product and design teams to deliver features on tight deadlines',
    ],
  },
  {
    role: 'Junior Developer',
    company: 'First Company',
    companyUrl: 'https://example.com',
    location: 'New York, NY',
    type: 'Full-time',
    startDate: 'Aug 2017',
    endDate: 'May 2019',
    bullets: [
      'Developed and maintained features for an e-commerce platform handling $10M+ in annual transactions',
      'Built internal tools that automated manual processes, saving 20+ hours per week',
      'Participated in agile development processes including sprint planning and retrospectives',
    ],
  },
]

export const projects: Project[] = [
  {
    name: 'Project Alpha',
    description: 'A real-time collaborative document editor with conflict-free replicated data types.',
    techStack: ['TypeScript', 'React', 'Node.js', 'WebSocket', 'PostgreSQL'],
    liveUrl: 'https://example.com',
    sourceUrl: 'https://github.com/kunalgupta/project-alpha',
  },
  {
    name: 'DevOps Dashboard',
    description: 'Monitoring dashboard for Kubernetes clusters with alerting and log aggregation.',
    techStack: ['Go', 'React', 'Prometheus', 'Grafana', 'Docker'],
    liveUrl: 'https://example.com',
    sourceUrl: 'https://github.com/kunalgupta/devops-dashboard',
  },
  {
    name: 'API Gateway',
    description: 'A lightweight API gateway with rate limiting, auth, and request transformation.',
    techStack: ['Go', 'Redis', 'Docker', 'Terraform'],
    sourceUrl: 'https://github.com/kunalgupta/api-gateway',
  },
  {
    name: 'CLI Task Manager',
    description: 'A terminal-based project management tool with Git integration.',
    techStack: ['Rust', 'SQLite', 'Git'],
    sourceUrl: 'https://github.com/kunalgupta/task-cli',
  },
]
