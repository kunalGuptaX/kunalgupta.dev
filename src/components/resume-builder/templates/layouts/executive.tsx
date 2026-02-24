'use client'

import type { ResumeDataV2, ThemeConfig } from '../../types'
import { safeHtml } from '../../sanitize'

/* ── static colour tokens ── */
const BODY = '#2d2d2d'
const MUTED = '#666'
const LIGHT = '#888'
const RULE = '#c5c5c5'

/* ── default section labels (executive tone) ── */
const DEFAULT_LABELS: Record<string, string> = {
  summary: 'Executive Summary',
  work: 'Professional Experience',
  skills: 'Core Competencies',
  education: 'Education',
  projects: 'Key Initiatives',
  interests: 'Interests',
  languages: 'Languages',
  certificates: 'Certifications',
  volunteer: 'Board & Volunteer Service',
  awards: 'Honors & Awards',
  publications: 'Publications',
  references: 'References',
}

function stripUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '')
}

/* ── Executive section heading: small-caps text with a thin line extending right ── */
function SectionTitle({
  children,
  accentColor,
  headingFont,
  fontSize,
  spacing,
}: {
  children: React.ReactNode
  accentColor: string
  headingFont: string
  fontSize: string
  spacing: string
}) {
  return (
    <div
      data-break-avoid
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: spacing,
      }}
    >
      <h2
        style={{
          fontFamily: `${headingFont}, Georgia, serif`,
          fontSize,
          fontWeight: 600,
          fontVariant: 'small-caps',
          letterSpacing: '2px',
          color: accentColor,
          margin: 0,
          lineHeight: 1.3,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {children}
      </h2>
      <div
        style={{
          flex: 1,
          height: '1px',
          backgroundColor: RULE,
          minWidth: '40px',
        }}
      />
    </div>
  )
}

/* ── props ── */
type ExecutiveLayoutProps = {
  data: ResumeDataV2
  theme: ThemeConfig
  isEditing: boolean
  sectionOrder: string[]
  hiddenSections?: string[]
  onDataChange: (data: ResumeDataV2) => void
  onSectionOrderChange: (order: string[]) => void
  sectionLabels?: Record<string, string>
}

export function ExecutiveLayout({
  data,
  theme,
  sectionOrder,
  hiddenSections = [],
  sectionLabels,
}: ExecutiveLayoutProps) {
  /* ── helpers from theme ── */
  const fs = (base: number) => `${base + theme.fontSize}px`
  const sp = (base: number) => `${base * theme.spacing}px`

  const ACCENT = theme.accentColor
  const HEADING_FONT = `${theme.headingFont}, Georgia, serif`
  const BODY_FONT = `${theme.bodyFont}, system-ui, sans-serif`

  const label = (sectionId: string) =>
    sectionLabels?.[sectionId] ?? DEFAULT_LABELS[sectionId] ?? sectionId

  /* ── visible sections ── */
  const visibleSections = sectionOrder.filter((s) => !hiddenSections.includes(s))

  /* ── contact line (pipe-separated) ── */
  const contactParts: string[] = []
  if (data.basics.email) contactParts.push(data.basics.email)
  if (data.basics.phone) contactParts.push(data.basics.phone)
  const locationParts = [data.basics.location.city, data.basics.location.region].filter(Boolean)
  if (locationParts.length > 0) contactParts.push(locationParts.join(', '))
  for (const profile of data.basics.profiles) {
    if (profile.url || profile.username) {
      contactParts.push(profile.url ? stripUrl(profile.url) : profile.username)
    }
  }
  if (data.basics.url) contactParts.push(stripUrl(data.basics.url))

  /* ── section renderer ── */
  const renderSection = (id: string) => {
    switch (id) {
      case 'summary': return renderSummary()
      case 'work': return renderWork()
      case 'skills': return renderSkills()
      case 'education': return renderEducation()
      case 'projects': return renderProjects()
      case 'interests': return renderInterests()
      case 'languages': return renderLanguages()
      case 'certificates': return renderCertificates()
      case 'volunteer': return renderVolunteer()
      case 'awards': return renderAwards()
      case 'publications': return renderPublications()
      case 'references': return renderReferences()
      default: return null
    }
  }

  /* ──────────────────────────── Section renderers ──────────────────────────── */

  function renderSummary() {
    if (!data.basics.summary) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('summary')}
        </SectionTitle>
        <div
          className="resume-rich-text"
          style={{
            margin: 0,
            fontSize: fs(12),
            lineHeight: 1.75,
            color: BODY,
            fontFamily: BODY_FONT,
          }}
          dangerouslySetInnerHTML={{ __html: safeHtml(data.basics.summary) }}
        />
      </div>
    )
  }

  function renderWork() {
    if (data.work.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('work')}
        </SectionTitle>
        {data.work.map((job, i) => (
          <div
            key={i}
            data-break-avoid
            style={{ marginBottom: i < data.work.length - 1 ? sp(24) : 0 }}
          >
            {/* Company name — prominent for executive resumes */}
            <div
              style={{
                fontSize: fs(15),
                fontWeight: 700,
                color: ACCENT,
                lineHeight: 1.3,
                fontFamily: HEADING_FONT,
              }}
            >
              {job.name}
            </div>
            {/* Position — secondary */}
            <div
              style={{
                fontSize: fs(12),
                fontWeight: 600,
                color: BODY,
                marginTop: sp(2),
                fontFamily: BODY_FONT,
              }}
            >
              {job.position}
            </div>
            {/* Date + Location row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '4px 16px',
                marginTop: sp(4),
                fontSize: fs(10),
                color: LIGHT,
                fontFamily: BODY_FONT,
              }}
            >
              {(job.startDate || job.endDate) && (
                <span>
                  {job.startDate}
                  {job.endDate ? ` \u2013 ${job.endDate}` : ' \u2013 Present'}
                </span>
              )}
              {job.location && (
                <span>{job.location}</span>
              )}
            </div>
            {/* Summary */}
            {job.summary && (
              <div
                className="resume-rich-text"
                style={{
                  margin: `${sp(8)} 0 0 0`,
                  fontSize: fs(11.5),
                  lineHeight: 1.7,
                  color: BODY,
                  fontFamily: BODY_FONT,
                }}
                dangerouslySetInnerHTML={{ __html: safeHtml(job.summary) }}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderSkills() {
    if (data.skills.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('skills')}
        </SectionTitle>
        <div
          style={{
            fontSize: fs(11.5),
            lineHeight: 1.7,
            color: BODY,
            fontFamily: BODY_FONT,
          }}
        >
          {data.skills.join(', ')}
        </div>
      </div>
    )
  }

  function renderEducation() {
    if (data.education.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('education')}
        </SectionTitle>
        {data.education.map((edu, i) => (
          <div
            key={i}
            data-break-avoid
            style={{ marginBottom: i < data.education.length - 1 ? sp(18) : 0 }}
          >
            {/* Institution — prominent */}
            <div
              style={{
                fontSize: fs(14),
                fontWeight: 700,
                color: ACCENT,
                lineHeight: 1.3,
                fontFamily: HEADING_FONT,
              }}
            >
              {edu.institution}
            </div>
            {/* Degree */}
            <div
              style={{
                fontSize: fs(12),
                fontWeight: 600,
                color: BODY,
                marginTop: sp(2),
                fontFamily: BODY_FONT,
              }}
            >
              {[edu.studyType, edu.area].filter(Boolean).join(' in ')}
            </div>
            {/* Date + Score */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '4px 16px',
                marginTop: sp(4),
                fontSize: fs(10),
                color: LIGHT,
                fontFamily: BODY_FONT,
              }}
            >
              {(edu.startDate || edu.endDate) && (
                <span>
                  {edu.startDate}
                  {edu.endDate ? ` \u2013 ${edu.endDate}` : ''}
                </span>
              )}
              {edu.score && <span>GPA: {edu.score}</span>}
            </div>
            {/* Courses */}
            {edu.courses.length > 0 && (
              <div
                style={{
                  marginTop: sp(6),
                  fontSize: fs(10.5),
                  color: MUTED,
                  lineHeight: 1.6,
                  fontFamily: BODY_FONT,
                }}
              >
                {edu.courses.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderProjects() {
    if (data.projects.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('projects')}
        </SectionTitle>
        {data.projects.map((project, i) => (
          <div
            key={i}
            data-break-avoid
            style={{ marginBottom: i < data.projects.length - 1 ? sp(20) : 0 }}
          >
            {/* Project name */}
            <div
              style={{
                fontSize: fs(14),
                fontWeight: 700,
                color: ACCENT,
                lineHeight: 1.3,
                fontFamily: HEADING_FONT,
              }}
            >
              {project.name}
            </div>
            {/* Dates if present */}
            {(project.startDate || project.endDate) && (
              <div
                style={{
                  fontSize: fs(10),
                  color: LIGHT,
                  marginTop: sp(2),
                  fontFamily: BODY_FONT,
                }}
              >
                {project.startDate}
                {project.endDate ? ` \u2013 ${project.endDate}` : ' \u2013 Present'}
              </div>
            )}
            {/* Description */}
            {project.description && (
              <div
                className="resume-rich-text"
                style={{
                  margin: `${sp(6)} 0 0 0`,
                  fontSize: fs(11.5),
                  lineHeight: 1.7,
                  color: BODY,
                  fontFamily: BODY_FONT,
                }}
                dangerouslySetInnerHTML={{ __html: safeHtml(project.description) }}
              />
            )}
            {/* Keywords — comma-separated */}
            {project.keywords.length > 0 && (
              <div
                style={{
                  marginTop: sp(6),
                  fontSize: fs(10.5),
                  color: MUTED,
                  fontFamily: BODY_FONT,
                }}
              >
                {project.keywords.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderInterests() {
    if (data.interests.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('interests')}
        </SectionTitle>
        {data.interests.map((interest, i) => (
          <div key={i} style={{ marginBottom: i < data.interests.length - 1 ? sp(8) : 0 }}>
            {interest.name && (
              <span
                style={{
                  fontSize: fs(11.5),
                  fontWeight: 700,
                  color: ACCENT,
                  fontFamily: BODY_FONT,
                }}
              >
                {interest.name}
                {interest.keywords.length > 0 ? ': ' : ''}
              </span>
            )}
            {interest.keywords.length > 0 && (
              <span
                style={{
                  fontSize: fs(11.5),
                  lineHeight: 1.7,
                  color: BODY,
                  fontFamily: BODY_FONT,
                }}
              >
                {interest.keywords.join(', ')}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderLanguages() {
    if (data.languages.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('languages')}
        </SectionTitle>
        <div
          style={{
            fontSize: fs(11.5),
            lineHeight: 1.7,
            color: BODY,
            fontFamily: BODY_FONT,
          }}
        >
          {data.languages
            .map((lang) =>
              lang.fluency ? `${lang.language} (${lang.fluency})` : lang.language,
            )
            .join(', ')}
        </div>
      </div>
    )
  }

  function renderCertificates() {
    if (data.certificates.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('certificates')}
        </SectionTitle>
        {data.certificates.map((cert, i) => (
          <div
            key={i}
            style={{ marginBottom: i < data.certificates.length - 1 ? sp(10) : 0 }}
          >
            <div
              style={{
                fontSize: fs(12),
                fontWeight: 700,
                color: ACCENT,
                fontFamily: BODY_FONT,
              }}
            >
              {cert.name}
            </div>
            <div
              style={{
                fontSize: fs(10.5),
                color: MUTED,
                marginTop: sp(2),
                fontFamily: BODY_FONT,
              }}
            >
              {[cert.issuer, cert.date].filter(Boolean).join(' \u2022 ')}
            </div>
          </div>
        ))}
      </div>
    )
  }

  function renderVolunteer() {
    if (data.volunteer.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('volunteer')}
        </SectionTitle>
        {data.volunteer.map((vol, i) => (
          <div
            key={i}
            data-break-avoid
            style={{ marginBottom: i < data.volunteer.length - 1 ? sp(20) : 0 }}
          >
            {/* Organization — prominent */}
            <div
              style={{
                fontSize: fs(14),
                fontWeight: 700,
                color: ACCENT,
                lineHeight: 1.3,
                fontFamily: HEADING_FONT,
              }}
            >
              {vol.organization}
            </div>
            {/* Position */}
            <div
              style={{
                fontSize: fs(12),
                fontWeight: 600,
                color: BODY,
                marginTop: sp(2),
                fontFamily: BODY_FONT,
              }}
            >
              {vol.position}
            </div>
            {/* Date */}
            {(vol.startDate || vol.endDate) && (
              <div
                style={{
                  fontSize: fs(10),
                  color: LIGHT,
                  marginTop: sp(4),
                  fontFamily: BODY_FONT,
                }}
              >
                {vol.startDate}
                {vol.endDate ? ` \u2013 ${vol.endDate}` : ' \u2013 Present'}
              </div>
            )}
            {/* Summary */}
            {vol.summary && (
              <div
                className="resume-rich-text"
                style={{
                  margin: `${sp(8)} 0 0 0`,
                  fontSize: fs(11.5),
                  lineHeight: 1.7,
                  color: BODY,
                  fontFamily: BODY_FONT,
                }}
                dangerouslySetInnerHTML={{ __html: safeHtml(vol.summary) }}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderAwards() {
    if (data.awards.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('awards')}
        </SectionTitle>
        {data.awards.map((award, i) => (
          <div
            key={i}
            style={{ marginBottom: i < data.awards.length - 1 ? sp(12) : 0 }}
          >
            <div
              style={{
                fontSize: fs(12),
                fontWeight: 700,
                color: ACCENT,
                fontFamily: BODY_FONT,
              }}
            >
              {award.title}
            </div>
            <div
              style={{
                fontSize: fs(10.5),
                color: MUTED,
                marginTop: sp(2),
                fontFamily: BODY_FONT,
              }}
            >
              {[award.awarder, award.date].filter(Boolean).join(' \u2022 ')}
            </div>
            {award.summary && (
              <div
                className="resume-rich-text"
                style={{
                  margin: `${sp(6)} 0 0 0`,
                  fontSize: fs(11.5),
                  lineHeight: 1.7,
                  color: BODY,
                  fontFamily: BODY_FONT,
                }}
                dangerouslySetInnerHTML={{ __html: safeHtml(award.summary) }}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderPublications() {
    if (data.publications.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('publications')}
        </SectionTitle>
        {data.publications.map((pub, i) => (
          <div
            key={i}
            style={{ marginBottom: i < data.publications.length - 1 ? sp(12) : 0 }}
          >
            <div
              style={{
                fontSize: fs(12),
                fontWeight: 700,
                color: ACCENT,
                fontFamily: BODY_FONT,
              }}
            >
              {pub.name}
            </div>
            <div
              style={{
                fontSize: fs(10.5),
                color: MUTED,
                marginTop: sp(2),
                fontFamily: BODY_FONT,
              }}
            >
              {[pub.publisher, pub.releaseDate].filter(Boolean).join(' \u2022 ')}
            </div>
            {pub.summary && (
              <div
                className="resume-rich-text"
                style={{
                  margin: `${sp(6)} 0 0 0`,
                  fontSize: fs(11.5),
                  lineHeight: 1.7,
                  color: BODY,
                  fontFamily: BODY_FONT,
                }}
                dangerouslySetInnerHTML={{ __html: safeHtml(pub.summary) }}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderReferences() {
    if (data.references.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle
          accentColor={ACCENT}
          headingFont={theme.headingFont}
          fontSize={fs(13)}
          spacing={sp(6)}
        >
          {label('references')}
        </SectionTitle>
        {data.references.map((ref, i) => (
          <div
            key={i}
            style={{ marginBottom: i < data.references.length - 1 ? sp(14) : 0 }}
          >
            <div
              style={{
                fontSize: fs(12),
                fontWeight: 700,
                color: ACCENT,
                fontFamily: BODY_FONT,
              }}
            >
              {ref.name}
            </div>
            {ref.reference && (
              <div
                className="resume-rich-text"
                style={{
                  margin: `${sp(4)} 0 0 0`,
                  fontSize: fs(11.5),
                  lineHeight: 1.7,
                  color: BODY,
                  fontStyle: 'italic',
                  fontFamily: BODY_FONT,
                }}
                dangerouslySetInnerHTML={{ __html: safeHtml(ref.reference) }}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  /* ──────────────────────────── Render ──────────────────────────── */

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#fff',
        fontFamily: BODY_FONT,
        color: BODY,
        fontSize: fs(12),
        lineHeight: 1.6,
        padding: 0,
        boxSizing: 'border-box',
        overflowWrap: 'anywhere',
      }}
    >
      {/* ── Header — full width, centered, generous spacing ── */}
      <div
        data-break-avoid
        style={{
          textAlign: 'center',
          marginBottom: sp(20),
        }}
      >
        {/* Name — large elegant serif, centered */}
        <h1
          style={{
            fontFamily: HEADING_FONT,
            fontSize: fs(36),
            fontWeight: 400,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: ACCENT,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {data.basics.name}
        </h1>

        {/* Thin decorative line under name */}
        <div
          style={{
            width: '60px',
            height: '1px',
            backgroundColor: ACCENT,
            margin: `${sp(10)} auto`,
          }}
        />

        {/* Job title / label — smaller muted text, centered */}
        {data.basics.label && (
          <div
            style={{
              fontFamily: BODY_FONT,
              fontSize: fs(14),
              fontWeight: 400,
              letterSpacing: '1.5px',
              color: MUTED,
              marginBottom: sp(10),
            }}
          >
            {data.basics.label}
          </div>
        )}

        {/* Contact info — single centered line, pipe-separated */}
        {contactParts.length > 0 && (
          <div
            style={{
              fontSize: fs(10),
              color: LIGHT,
              fontFamily: BODY_FONT,
              letterSpacing: '0.5px',
              lineHeight: 1.6,
            }}
          >
            {contactParts.join('  |  ')}
          </div>
        )}
      </div>

      {/* ── Single-column body with generous spacing ── */}
      {visibleSections.map((id) => (
        <div key={id}>{renderSection(id)}</div>
      ))}
    </div>
  )
}
