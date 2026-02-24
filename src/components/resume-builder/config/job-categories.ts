export type JobCategoryConfig = {
  id: string
  label: string
  icon: string
  emphasizedSections: string[]
  demphasizedSections: string[]
  sectionLabels: Record<string, string>
  tips: string[]
  /** Tags to match against template tags for recommendations */
  recommendedTemplateTags: string[]
}

const tech: JobCategoryConfig = {
  id: 'tech',
  label: 'Technology',
  icon: 'Monitor',
  emphasizedSections: ['skills', 'projects', 'certificates'],
  demphasizedSections: ['volunteer', 'awards'],
  sectionLabels: {
    work: 'Experience',
    projects: 'Projects',
    skills: 'Technical Skills',
    certificates: 'Certifications',
  },
  tips: [
    'List specific technologies, frameworks, and tools — recruiters often use keyword-based filtering.',
    'Include links to your GitHub, portfolio, or live project demos wherever possible.',
    'Quantify impact with metrics like uptime improvements, latency reductions, or user growth.',
  ],
  recommendedTemplateTags: ['modern', 'tech', 'clean'],
}

const academic: JobCategoryConfig = {
  id: 'academic',
  label: 'Academic & Research',
  icon: 'GraduationCap',
  emphasizedSections: ['education', 'publications', 'projects', 'awards'],
  demphasizedSections: ['volunteer'],
  sectionLabels: {
    work: 'Academic Appointments',
    projects: 'Research',
    education: 'Education',
    publications: 'Publications',
    awards: 'Grants & Awards',
  },
  tips: [
    'Lead with your education and list degrees with thesis titles, advisors, and distinctions.',
    'Include a comprehensive publications list formatted in the citation style of your field.',
    'Highlight research grants, fellowships, and conference presentations prominently.',
  ],
  recommendedTemplateTags: ['traditional', 'academic', 'ats'],
}

const medical: JobCategoryConfig = {
  id: 'medical',
  label: 'Medical & Healthcare',
  icon: 'Stethoscope',
  emphasizedSections: ['certificates', 'education', 'work'],
  demphasizedSections: ['projects', 'volunteer'],
  sectionLabels: {
    work: 'Clinical Experience',
    certificates: 'Licenses & Certifications',
    education: 'Education & Training',
    skills: 'Clinical Skills',
  },
  tips: [
    'List all medical licenses, board certifications, and their expiration dates clearly.',
    'Detail clinical rotations, residencies, and fellowships with specific departments and institutions.',
    'Include CME credits and any specialized training relevant to your target role.',
  ],
  recommendedTemplateTags: ['professional', 'conservative', 'ats'],
}

const creative: JobCategoryConfig = {
  id: 'creative',
  label: 'Creative & Design',
  icon: 'Palette',
  emphasizedSections: ['projects', 'skills', 'work'],
  demphasizedSections: ['certificates', 'volunteer'],
  sectionLabels: {
    projects: 'Portfolio',
    skills: 'Tools & Media',
    work: 'Experience',
    awards: 'Recognition & Exhibitions',
  },
  tips: [
    'Link to your online portfolio or attach work samples — creative roles are judged by your work, not just your resume.',
    'List specific design tools, software, and media you work with (e.g. Figma, After Effects, Blender).',
    'Highlight notable clients, brands, or publications you have contributed to.',
  ],
  recommendedTemplateTags: ['modern', 'creative', 'bold'],
}

const legal: JobCategoryConfig = {
  id: 'legal',
  label: 'Legal',
  icon: 'Scale',
  emphasizedSections: ['education', 'work', 'awards', 'certificates'],
  demphasizedSections: ['projects', 'volunteer'],
  sectionLabels: {
    work: 'Legal Experience',
    education: 'Education',
    certificates: 'Bar Admissions & Certifications',
    awards: 'Honors & Awards',
    skills: 'Practice Areas',
  },
  tips: [
    'List all bar admissions with jurisdiction and date — this is essential for legal positions.',
    'Use formal, precise language throughout; legal employers expect meticulous attention to detail.',
    'Highlight notable cases, transactions, or pro bono work that demonstrates your expertise.',
  ],
  recommendedTemplateTags: ['traditional', 'conservative', 'ats'],
}

const finance: JobCategoryConfig = {
  id: 'finance',
  label: 'Finance & Accounting',
  icon: 'TrendingUp',
  emphasizedSections: ['certificates', 'work', 'education', 'skills'],
  demphasizedSections: ['projects', 'volunteer'],
  sectionLabels: {
    work: 'Experience',
    certificates: 'Licenses & Certifications',
    education: 'Education',
    skills: 'Technical & Analytical Skills',
  },
  tips: [
    'Prominently display certifications like CPA, CFA, FRM, or Series licenses with their current status.',
    'Quantify your impact with financial metrics — portfolio size managed, revenue generated, cost savings achieved.',
    'Highlight proficiency with financial software and analytical tools (Bloomberg, Excel modeling, SQL).',
  ],
  recommendedTemplateTags: ['professional', 'conservative', 'ats'],
}

const government: JobCategoryConfig = {
  id: 'government',
  label: 'Government & Public Sector',
  icon: 'Landmark',
  emphasizedSections: ['education', 'work', 'volunteer', 'certificates'],
  demphasizedSections: ['projects'],
  sectionLabels: {
    work: 'Professional Experience',
    education: 'Education',
    volunteer: 'Community Service & Volunteer Work',
    certificates: 'Certifications & Clearances',
    skills: 'Core Competencies',
  },
  tips: [
    'Include your nationality and security clearance level if applicable — many government roles require this.',
    'Use the specific job announcement language and KSA (Knowledge, Skills, Abilities) framework when relevant.',
    'Government resumes are typically longer and more detailed than private-sector ones; thoroughness is expected.',
  ],
  recommendedTemplateTags: ['traditional', 'conservative', 'ats'],
}

const marketing: JobCategoryConfig = {
  id: 'marketing',
  label: 'Marketing & Communications',
  icon: 'Megaphone',
  emphasizedSections: ['work', 'skills', 'projects', 'certificates'],
  demphasizedSections: ['volunteer', 'publications'],
  sectionLabels: {
    work: 'Marketing Experience',
    projects: 'Campaigns & Portfolio',
    skills: 'Marketing Skills & Tools',
    certificates: 'Certifications',
  },
  tips: [
    'Quantify campaign results — CTR, conversion rates, ROI, engagement metrics, and revenue attributed.',
    'List marketing platforms and tools (Google Analytics, HubSpot, Meta Ads, Mailchimp, SEO tools).',
    'Include links to campaigns, content, or portfolio pieces that demonstrate your capabilities.',
  ],
  recommendedTemplateTags: ['modern', 'creative', 'balanced'],
}

const sales: JobCategoryConfig = {
  id: 'sales',
  label: 'Sales & Business Dev',
  icon: 'Handshake',
  emphasizedSections: ['work', 'skills', 'awards', 'certificates'],
  demphasizedSections: ['projects', 'publications', 'volunteer'],
  sectionLabels: {
    work: 'Sales Experience',
    skills: 'Sales Skills & Tools',
    awards: 'Sales Achievements & Awards',
    certificates: 'Sales Certifications',
  },
  tips: [
    'Lead every bullet with revenue numbers — quota attainment, deal sizes, pipeline growth, territory expansion.',
    'Highlight specific sales methodologies (MEDDIC, Challenger, SPIN, Sandler) and CRM tools (Salesforce, HubSpot).',
    'Include Presidents Club awards, top performer rankings, and other recognition prominently.',
  ],
  recommendedTemplateTags: ['professional', 'bold', 'ats'],
}

const hr: JobCategoryConfig = {
  id: 'hr',
  label: 'Human Resources',
  icon: 'Users',
  emphasizedSections: ['work', 'certificates', 'education', 'skills'],
  demphasizedSections: ['projects', 'publications'],
  sectionLabels: {
    work: 'HR Experience',
    certificates: 'HR Certifications',
    skills: 'HR Competencies & Tools',
    education: 'Education',
  },
  tips: [
    'Highlight HR certifications (PHR, SPHR, SHRM-CP, SHRM-SCP) with their current status.',
    'Quantify impact: retention rates improved, hiring time reduced, training programs developed, headcount managed.',
    'List HRIS platforms and tools (Workday, BambooHR, SAP SuccessFactors, ADP) you have experience with.',
  ],
  recommendedTemplateTags: ['professional', 'balanced', 'ats'],
}

const consulting: JobCategoryConfig = {
  id: 'consulting',
  label: 'Consulting & Strategy',
  icon: 'Lightbulb',
  emphasizedSections: ['work', 'education', 'skills', 'certificates'],
  demphasizedSections: ['projects', 'volunteer', 'interests'],
  sectionLabels: {
    work: 'Consulting Experience',
    education: 'Education',
    skills: 'Areas of Expertise',
    certificates: 'Certifications',
    awards: 'Awards & Recognition',
  },
  tips: [
    'Structure bullets as: action → context → quantified result. Consulting firms value structured thinking.',
    'Highlight client-facing work, industries served, and scope of engagements (budget, team size).',
    'Education section is critical — include MBA, target school reputation, and academic honors.',
  ],
  recommendedTemplateTags: ['professional', 'conservative', 'ats'],
}

const engineering: JobCategoryConfig = {
  id: 'engineering',
  label: 'Engineering (Non-Software)',
  icon: 'Wrench',
  emphasizedSections: ['work', 'skills', 'certificates', 'education'],
  demphasizedSections: ['volunteer', 'interests'],
  sectionLabels: {
    work: 'Engineering Experience',
    skills: 'Technical Skills & Software',
    certificates: 'Professional Licenses & Certifications',
    education: 'Education',
    projects: 'Key Projects',
  },
  tips: [
    'List your PE license, FE/EIT status, and any industry-specific certifications prominently.',
    'Include CAD/CAM software, simulation tools, and industry standards you work with.',
    'Quantify projects: budget managed, efficiency improvements, safety records, completion timelines.',
  ],
  recommendedTemplateTags: ['professional', 'traditional', 'ats'],
}

const education: JobCategoryConfig = {
  id: 'education',
  label: 'Education & Teaching',
  icon: 'BookOpen',
  emphasizedSections: ['education', 'work', 'certificates', 'awards'],
  demphasizedSections: ['projects', 'interests'],
  sectionLabels: {
    work: 'Teaching Experience',
    education: 'Education & Qualifications',
    certificates: 'Teaching Certifications & Licenses',
    skills: 'Subjects & Skills',
    awards: 'Awards & Recognition',
    volunteer: 'Community & Extracurricular',
  },
  tips: [
    'List all teaching certifications, endorsements, and subject area qualifications with expiration dates.',
    'Include student achievement metrics, test score improvements, and curriculum development.',
    'Highlight extracurricular involvement — clubs supervised, sports coached, committees served on.',
  ],
  recommendedTemplateTags: ['traditional', 'clean', 'balanced'],
}

const nonprofit: JobCategoryConfig = {
  id: 'nonprofit',
  label: 'Nonprofit & NGO',
  icon: 'Heart',
  emphasizedSections: ['work', 'volunteer', 'education', 'awards'],
  demphasizedSections: ['projects', 'interests'],
  sectionLabels: {
    work: 'Professional Experience',
    volunteer: 'Volunteer & Board Service',
    skills: 'Core Competencies',
    awards: 'Grants & Awards',
    certificates: 'Certifications',
  },
  tips: [
    'Emphasize mission-driven results: funds raised, communities served, programs launched, partnerships formed.',
    'Include board memberships and volunteer leadership roles — they carry significant weight in the sector.',
    'Highlight grant writing, fundraising, and stakeholder engagement experience specifically.',
  ],
  recommendedTemplateTags: ['clean', 'balanced', 'ats'],
}

const dataScience: JobCategoryConfig = {
  id: 'data-science',
  label: 'Data Science & Analytics',
  icon: 'BarChart',
  emphasizedSections: ['skills', 'projects', 'work', 'education'],
  demphasizedSections: ['volunteer', 'awards'],
  sectionLabels: {
    work: 'Experience',
    projects: 'Data Projects & Research',
    skills: 'Technical Skills',
    education: 'Education',
    publications: 'Publications & Talks',
  },
  tips: [
    'List ML frameworks (TensorFlow, PyTorch, scikit-learn), languages (Python, R, SQL), and cloud platforms.',
    'Describe projects with methodology, data scale, and business impact — not just tools used.',
    'Include Kaggle rankings, published papers, or conference presentations if applicable.',
  ],
  recommendedTemplateTags: ['modern', 'tech', 'clean'],
}

const product: JobCategoryConfig = {
  id: 'product',
  label: 'Product Management',
  icon: 'Layers',
  emphasizedSections: ['work', 'skills', 'education', 'projects'],
  demphasizedSections: ['volunteer', 'publications'],
  sectionLabels: {
    work: 'Product Experience',
    skills: 'Product Skills & Tools',
    projects: 'Product Launches & Initiatives',
    education: 'Education',
  },
  tips: [
    'Focus on outcomes over outputs: revenue impact, user growth, engagement metrics, market share gains.',
    'Highlight cross-functional leadership — engineering, design, marketing, sales stakeholder management.',
    'List product tools (Jira, Linear, Amplitude, Mixpanel, Figma) and methodologies (Agile, Lean, OKRs).',
  ],
  recommendedTemplateTags: ['professional', 'modern', 'balanced'],
}

const operations: JobCategoryConfig = {
  id: 'operations',
  label: 'Operations & Supply Chain',
  icon: 'Settings',
  emphasizedSections: ['work', 'skills', 'certificates', 'education'],
  demphasizedSections: ['projects', 'publications', 'interests'],
  sectionLabels: {
    work: 'Operations Experience',
    skills: 'Core Competencies & Tools',
    certificates: 'Certifications',
    education: 'Education',
  },
  tips: [
    'Quantify operational improvements: cost reduction %, throughput increase, cycle time reduction, quality metrics.',
    'Highlight certifications like Six Sigma (Belt level), PMP, APICS CSCP, Lean Manufacturing.',
    'Include ERP/WMS systems experience (SAP, Oracle, Manhattan Associates) and process improvement methodologies.',
  ],
  recommendedTemplateTags: ['professional', 'traditional', 'ats'],
}

const general: JobCategoryConfig = {
  id: 'general',
  label: 'General',
  icon: 'Briefcase',
  emphasizedSections: ['work', 'education', 'skills'],
  demphasizedSections: [],
  sectionLabels: {
    work: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certificates: 'Certifications',
    languages: 'Languages',
    volunteer: 'Volunteer Experience',
    awards: 'Awards',
  },
  tips: [
    'Tailor your resume for each application — highlight the experience and skills most relevant to the role.',
    'Use clear action verbs and quantify your accomplishments wherever possible.',
    'Keep formatting clean and consistent; avoid overly complex layouts that may not parse well in applicant tracking systems.',
  ],
  recommendedTemplateTags: ['professional', 'balanced', 'ats'],
}

export const jobCategories: Record<string, JobCategoryConfig> = {
  tech,
  academic,
  medical,
  creative,
  legal,
  finance,
  government,
  marketing,
  sales,
  hr,
  consulting,
  engineering,
  education,
  nonprofit,
  'data-science': dataScience,
  product,
  operations,
  general,
}

export function getJobCategory(id: string): JobCategoryConfig {
  return jobCategories[id] ?? jobCategories.general
}

export const jobCategoryList: { id: string; label: string; icon: string }[] = Object.values(jobCategories).map(
  ({ id, label, icon }) => ({ id, label, icon }),
)
