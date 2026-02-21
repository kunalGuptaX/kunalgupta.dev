'use client'

import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer'
import type { Skill, Experience, Project } from '@/data/resume'

const ACCENT = '#2ba5a5'

const C = {
  black: '#1a1a1a',
  dark: '#333333',
  muted: '#555555',
  light: '#888888',
  border: '#333333',
  dotted: '#d4d4d4',
  white: '#ffffff',
}

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: C.dark,
    lineHeight: 1.45,
  },

  // ── Header ──
  header: {
    marginBottom: 18,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: ACCENT,
    marginTop: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 8,
    color: C.dark,
    marginRight: 4,
  },
  contactLink: {
    fontSize: 8.5,
    color: C.muted,
    textDecoration: 'none',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationIcon: {
    fontSize: 8,
    color: C.dark,
    marginRight: 4,
  },
  location: {
    fontSize: 8.5,
    color: C.muted,
  },

  // ── Two-column body ──
  body: {
    flexDirection: 'row',
    marginTop: 16,
  },
  colLeft: {
    width: '58%',
    paddingRight: 14,
  },
  colRight: {
    width: '42%',
    paddingLeft: 14,
  },

  // ── Section titles ──
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: C.black,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionAccent: {
    width: 40,
    height: 3,
    backgroundColor: ACCENT,
    marginBottom: 8,
  },

  // ── Summary ──
  summary: {
    fontSize: 9,
    color: C.muted,
    lineHeight: 1.6,
    marginBottom: 16,
  },

  // ── Experience ──
  jobBlock: {
    marginBottom: 4,
  },
  jobRole: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: C.black,
  },
  jobCompany: {
    fontSize: 9.5,
    color: C.muted,
    marginTop: 2,
  },
  jobMeta: {
    flexDirection: 'row',
    marginTop: 3,
    gap: 20,
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobMetaIcon: {
    fontSize: 7.5,
    color: C.light,
    marginRight: 3,
  },
  jobMetaText: {
    fontSize: 8.5,
    color: C.light,
  },
  bullets: {
    marginTop: 7,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3.5,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 10,
    fontSize: 8,
    color: C.light,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.5,
    color: C.dark,
  },
  jobDivider: {
    borderBottom: `0.75 dashed ${C.dotted}`,
    marginTop: 10,
    marginBottom: 12,
  },

  // ── Skills (grid badges) ──
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillBadge: {
    border: `1 solid ${C.border}`,
    borderRadius: 2,
    paddingVertical: 5,
    paddingHorizontal: 12,
    fontSize: 8.5,
    color: C.dark,
    textAlign: 'center',
  },

  // ── Education ──
  eduSection: {
    marginTop: 22,
  },
  eduDegree: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: C.black,
    lineHeight: 1.4,
  },
  eduSchool: {
    fontSize: 9,
    color: C.muted,
    marginTop: 3,
  },
  eduMeta: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 14,
  },
  eduMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eduMetaIcon: {
    fontSize: 7.5,
    color: C.light,
    marginRight: 3,
  },
  eduMetaText: {
    fontSize: 8.5,
    color: C.light,
  },

  // ── Projects ──
  projectsSection: {
    marginTop: 22,
  },
  projectBlock: {
    marginBottom: 10,
  },
  projectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  projectName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: C.black,
  },
  projectLinks: {
    flexDirection: 'row',
    gap: 6,
  },
  projectLink: {
    color: ACCENT,
    textDecoration: 'none',
    fontSize: 8,
  },
  projectDesc: {
    fontSize: 8.5,
    color: C.muted,
    marginTop: 2,
    lineHeight: 1.45,
  },
  projectTech: {
    fontSize: 8,
    color: C.light,
    marginTop: 3,
  },
  projectDivider: {
    borderBottom: `0.75 dashed ${C.dotted}`,
    marginTop: 8,
    marginBottom: 10,
  },
})

export type ResumeTemplateProps = {
  name: string
  title: string
  email: string
  socials: { github: string; linkedin: string; twitter: string }
  skills: Skill[]
  experience: Experience[]
  projects: Project[]
}

export function ResumeClassicTemplate({
  name,
  title,
  email,
  socials,
  skills,
  experience,
  projects,
}: ResumeTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.title}>{title}</Text>
          <View style={s.contactRow}>
            <View style={s.contactItem}>
              <Text style={s.contactIcon}>@</Text>
              <Link style={s.contactLink} src={`mailto:${email}`}>
                {email}
              </Link>
            </View>
            {socials.linkedin && (
              <View style={s.contactItem}>
                <Link style={s.contactLink} src={socials.linkedin}>
                  {socials.linkedin.replace('https://', '')}
                </Link>
              </View>
            )}
            {socials.github && (
              <View style={s.contactItem}>
                <Link style={s.contactLink} src={socials.github}>
                  {socials.github.replace('https://', '')}
                </Link>
              </View>
            )}
          </View>
          <View style={s.locationRow}>
            <Text style={s.location}>Punjab, India</Text>
          </View>
        </View>

        {/* ── Two-column body ── */}
        <View style={s.body}>
          {/* Left column: Summary + Experience */}
          <View style={s.colLeft}>
            {/* Summary */}
            <View>
              <Text style={s.sectionTitle}>Summary</Text>
              <View style={s.sectionAccent} />
              <Text style={s.summary}>
                {title} with 6+ years of experience in JavaScript, Next.js, TypeScript, React, and
                Node.js. Passionate about building scalable software, optimizing performance, and
                delivering high-quality user experiences.
              </Text>
            </View>

            {/* Experience */}
            <View>
              <Text style={s.sectionTitle}>Experience</Text>
              <View style={s.sectionAccent} />
              {experience.map((job, i) => (
                <View key={i} style={s.jobBlock} wrap={false}>
                  <Text style={s.jobRole}>{job.role}</Text>
                  <Text style={s.jobCompany}>{job.company}</Text>
                  <View style={s.jobMeta}>
                    <View style={s.jobMetaItem}>
                      <Text style={s.jobMetaText}>
                        {job.startDate} - {job.endDate}
                      </Text>
                    </View>
                    <View style={s.jobMetaItem}>
                      <Text style={s.jobMetaText}>{job.location}</Text>
                    </View>
                  </View>
                  <View style={s.bullets}>
                    {job.bullets.map((bullet, j) => (
                      <View key={j} style={s.bulletRow}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                  {i < experience.length - 1 && <View style={s.jobDivider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Right column: Skills + Education + Projects */}
          <View style={s.colRight}>
            {/* Skills */}
            {skills.length > 0 && (
              <View>
                <Text style={s.sectionTitle}>Skills</Text>
                <View style={s.sectionAccent} />
                <View style={s.skillsGrid}>
                  {skills.map((skill) => (
                    <Text key={skill.name} style={s.skillBadge}>
                      {skill.name}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Education */}
            <View style={s.eduSection}>
              <Text style={s.sectionTitle}>Education</Text>
              <View style={s.sectionAccent} />
              <Text style={s.eduDegree}>Bachelor of Technology: Civil Engineering</Text>
              <Text style={s.eduSchool}>Bharati Vidyapeeth University</Text>
              <View style={s.eduMeta}>
                <View style={s.eduMetaItem}>
                  <Text style={s.eduMetaText}>2012 - 2019</Text>
                </View>
                <View style={s.eduMetaItem}>
                  <Text style={s.eduMetaText}>Pune, Maharashtra, India</Text>
                </View>
              </View>
            </View>

            {/* Projects */}
            {projects.length > 0 && (
              <View style={s.projectsSection}>
                <Text style={s.sectionTitle}>Projects</Text>
                <View style={s.sectionAccent} />
                {projects.map((project, i) => (
                  <View key={project.name} style={s.projectBlock} wrap={false}>
                    <View style={s.projectTopRow}>
                      <Text style={s.projectName}>{project.name}</Text>
                      <View style={s.projectLinks}>
                        {project.liveUrl && (
                          <Link style={s.projectLink} src={project.liveUrl}>
                            Live
                          </Link>
                        )}
                        {project.sourceUrl && (
                          <Link style={s.projectLink} src={project.sourceUrl}>
                            Source
                          </Link>
                        )}
                      </View>
                    </View>
                    <Text style={s.projectDesc}>{project.description}</Text>
                    <Text style={s.projectTech}>
                      {project.techStack.join('  ·  ')}
                    </Text>
                    {i < projects.length - 1 && <View style={s.projectDivider} />}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}
