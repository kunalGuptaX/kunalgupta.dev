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
    role: 'Lead Software Engineer',
    company: 'Destm Technologies',
    companyUrl: 'https://destm.com/',
    location: 'C204, Second Floor, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab, India',
    type: 'Full-time',
    startDate: 'Sep 2019',
    endDate: 'Mar 2021',
    bullets: [
      'Designed and coded UI components, applying React concepts for responsive web-based user interactions.',
      'Translated designs and wireframes into high-quality code, ensuring seamless application interface functionality.',
      'Troubleshot interface software and debugged application codes to enhance overall performance.',
      'Monitored and improved front-end performance, documenting changes to ensure transparency.',
      'Built reusable components using React.JS, optimizing for maximum performance across various web-capable devices and browsers. Collaborated with the onshore development team to discuss UI ideas and applications, applying agile development practices throughout the process.',
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
