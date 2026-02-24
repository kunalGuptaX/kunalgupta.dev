'use client'

import type { ResumeDataV2, ThemeConfig } from '../../types'
import { safeHtml } from '../../sanitize'
import { stripUrl, BASE_SECTION_LABELS, PhoneIcon, AtSignIcon, LinkIcon, PinIcon } from '../shared'

/* ── static colour tokens ── */
const BODY = '#333'
const META = '#555'
const ICON = '#555'

/* ── default section labels ── */
const DEFAULT_LABELS: Record<string, string> = { ...BASE_SECTION_LABELS, summary: 'About Me', work: 'Work Experience' }

/* ── themed section heading (minimal style: full-width underline) ── */
function SectionTitle({
  children,
  accentColor,
  headingFont,
  fontSize,
}: {
  children: React.ReactNode
  accentColor: string
  headingFont: string
  fontSize: string
}) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <h2
        style={{
          fontFamily: `${headingFont}, Georgia, serif`,
          fontSize,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: accentColor,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {children}
      </h2>
      <div style={{ width: '100%', height: '2px', backgroundColor: accentColor, marginTop: '4px' }} />
    </div>
  )
}

/* ── props ── */
type MinimalLayoutProps = {
  data: ResumeDataV2
  theme: ThemeConfig
  sectionOrder: string[]
  hiddenSections?: string[]
  sectionLabels?: Record<string, string>
}

export function MinimalLayout({
  data,
  theme,
  sectionOrder,
  hiddenSections = [],
  sectionLabels,
}: MinimalLayoutProps) {
  /* ── helpers from theme ── */
  const fs = (base: number) => `${base + theme.fontSize}px`
  const sp = (base: number) => `${base * theme.spacing}px`

  const ACCENT = theme.accentColor
  const HEADING_FONT = `${theme.headingFont}, Georgia, serif`
  const BODY_FONT = `${theme.bodyFont}, system-ui, sans-serif`

  const label = (sectionId: string) =>
    sectionLabels?.[sectionId] ?? DEFAULT_LABELS[sectionId] ?? sectionId

  /* ── location string ── */
  const locationParts = [data.basics.location.city, data.basics.location.region].filter(Boolean)
  const locationStr = locationParts.join(', ')

  /* ── section renderer ── */
  const renderSection = (id: string) => {
    switch (id) {
      case 'summary': return renderSummary()
      case 'work': return renderWork()
      case 'education': return renderEducation()
      case 'skills': return renderSkills()
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
      <div data-break-avoid style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('summary')}
        </SectionTitle>
        <div className="resume-rich-text" style={{ margin: 0, fontSize: fs(12), lineHeight: 1.65, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(data.basics.summary) }} />
      </div>
    )
  }

  function renderWork() {
    if (data.work.length === 0) return null
    return (
      <div style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('work')}
        </SectionTitle>
        {data.work.map((job, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.work.length - 1 ? sp(14) : 0 }}>
            {/* Company + dates row */}
            <div style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
              {job.name}
              {(job.startDate || job.endDate) && (
                <span> | {job.startDate}{job.endDate ? ` - ${job.endDate}` : ' - Present'}</span>
              )}
            </div>
            {/* Position */}
            <div
              style={{
                fontSize: fs(13),
                fontWeight: 700,
                color: ACCENT,
                marginTop: sp(2),
                fontFamily: BODY_FONT,
              }}
            >
              {job.position}
            </div>
            {/* Summary */}
            {job.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(4)} 0 0 0`, fontSize: fs(12), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(job.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderEducation() {
    if (data.education.length === 0) return null
    return (
      <div style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('education')}
        </SectionTitle>
        {data.education.map((edu, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.education.length - 1 ? sp(14) : 0 }}>
            {/* Institution + dates */}
            <div style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
              {edu.institution}
              {(edu.startDate || edu.endDate) && (
                <span> | {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</span>
              )}
            </div>
            {/* Degree */}
            <div
              style={{
                fontSize: fs(13),
                fontWeight: 700,
                color: ACCENT,
                marginTop: sp(2),
                fontFamily: BODY_FONT,
              }}
            >
              {[edu.studyType, edu.area].filter(Boolean).join(' in ')}
            </div>
            {/* Score */}
            {edu.score && (
              <div style={{ fontSize: fs(10), color: META, marginTop: '1px', fontFamily: BODY_FONT }}>
                GPA: {edu.score}
              </div>
            )}
            {/* Courses */}
            {edu.courses.length > 0 && (
              <div style={{ fontSize: fs(10), color: META, marginTop: sp(2), fontFamily: BODY_FONT }}>
                {edu.courses.join(' | ')}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderSkills() {
    if (data.skills.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('skills')}
        </SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: `${sp(4)} ${sp(16)}`,
          }}
        >
          {data.skills.map((skill, i) => (
            <div
              key={i}
              style={{
                fontSize: fs(12),
                color: BODY,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: BODY_FONT,
              }}
            >
              <span style={{ color: ACCENT, fontSize: '6px' }}>&#9679;</span>
              {skill}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderProjects() {
    if (data.projects.length === 0) return null
    return (
      <div style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('projects')}
        </SectionTitle>
        {data.projects.map((project, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(14) : 0 }}>
            {/* Project name */}
            <div
              style={{
                fontSize: fs(13),
                fontWeight: 700,
                color: ACCENT,
                fontFamily: BODY_FONT,
              }}
            >
              {project.name}
            </div>
            {/* Description */}
            {project.description && (
              <div
                className="resume-rich-text"
                style={{
                  margin: `${sp(2)} 0 0 0`,
                  fontSize: fs(12),
                  lineHeight: 1.6,
                  color: BODY,
                  fontFamily: BODY_FONT,
                }}
                dangerouslySetInnerHTML={{ __html: safeHtml(project.description) }}
              />
            )}
            {/* Keywords */}
            {project.keywords.length > 0 && (
              <div style={{ fontSize: fs(11), color: META, marginTop: sp(2), fontFamily: BODY_FONT }}>
                {project.keywords.join(' / ')}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderInterests() {
    if (data.interests.length === 0) return null
    const allKeywords = data.interests.flatMap((interest) =>
      interest.keywords.length > 0 ? interest.keywords : [interest.name],
    )
    return (
      <div data-break-avoid style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('interests')}
        </SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: `${sp(4)} ${sp(16)}`,
          }}
        >
          {allKeywords.map((keyword, i) => (
            <div
              key={i}
              style={{
                fontSize: fs(12),
                color: BODY,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: BODY_FONT,
              }}
            >
              <span style={{ color: ACCENT, fontSize: '6px' }}>&#9679;</span>
              {keyword}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderLanguages() {
    if (data.languages.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('languages')}
        </SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: `${sp(4)} ${sp(16)}`,
          }}
        >
          {data.languages.map((lang, i) => (
            <div
              key={i}
              style={{
                fontSize: fs(12),
                color: BODY,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: BODY_FONT,
              }}
            >
              <span style={{ color: ACCENT, fontSize: '6px' }}>&#9679;</span>
              {lang.language}{lang.fluency ? ` (${lang.fluency})` : ''}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderCertificates() {
    if (data.certificates.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('certificates')}
        </SectionTitle>
        {data.certificates.map((cert, i) => (
          <div key={i} style={{ marginBottom: i < data.certificates.length - 1 ? sp(10) : 0 }}>
            <div style={{ fontSize: fs(13), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {cert.name}
            </div>
            <div style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
              {[cert.issuer, cert.date].filter(Boolean).join(' | ')}
            </div>
          </div>
        ))}
      </div>
    )
  }

  function renderVolunteer() {
    if (data.volunteer.length === 0) return null
    return (
      <div style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('volunteer')}
        </SectionTitle>
        {data.volunteer.map((vol, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.volunteer.length - 1 ? sp(14) : 0 }}>
            <div style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
              {vol.organization}
              {(vol.startDate || vol.endDate) && (
                <span> | {vol.startDate}{vol.endDate ? ` - ${vol.endDate}` : ' - Present'}</span>
              )}
            </div>
            <div style={{ fontSize: fs(13), fontWeight: 700, color: ACCENT, marginTop: sp(2), fontFamily: BODY_FONT }}>
              {vol.position}
            </div>
            {vol.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(4)} 0 0 0`, fontSize: fs(12), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(vol.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderAwards() {
    if (data.awards.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('awards')}
        </SectionTitle>
        {data.awards.map((award, i) => (
          <div key={i} style={{ marginBottom: i < data.awards.length - 1 ? sp(10) : 0 }}>
            <div style={{ fontSize: fs(13), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {award.title}
            </div>
            <div style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
              {[award.awarder, award.date].filter(Boolean).join(' | ')}
            </div>
            {award.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(12), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(award.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderPublications() {
    if (data.publications.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('publications')}
        </SectionTitle>
        {data.publications.map((pub, i) => (
          <div key={i} style={{ marginBottom: i < data.publications.length - 1 ? sp(10) : 0 }}>
            <div style={{ fontSize: fs(13), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {pub.name}
            </div>
            <div style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
              {[pub.publisher, pub.releaseDate].filter(Boolean).join(' | ')}
            </div>
            {pub.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(12), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(pub.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderReferences() {
    if (data.references.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(22) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(17)}>
          {label('references')}
        </SectionTitle>
        {data.references.map((ref, i) => (
          <div key={i} style={{ marginBottom: i < data.references.length - 1 ? sp(10) : 0 }}>
            <div style={{ fontSize: fs(13), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {ref.name}
            </div>
            {ref.reference && (
              <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(12), lineHeight: 1.6, color: BODY, fontStyle: 'italic', fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(ref.reference) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  /* ──────────────────────────── Render ──────────────────────────── */

  const visibleSections = sectionOrder.filter((s) => !hiddenSections.includes(s))

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
      {/* ── Header — centered ── */}
      <div data-break-avoid style={{ textAlign: 'center', marginBottom: sp(24) }}>
        {/* Name */}
        <h1
          style={{
            fontFamily: HEADING_FONT,
            fontSize: fs(32),
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: ACCENT,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {data.basics.name}
        </h1>

        {/* Label */}
        {data.basics.label && (
          <div
            style={{
              fontFamily: HEADING_FONT,
              fontSize: fs(15),
              fontWeight: 400,
              color: META,
              marginTop: sp(4),
            }}
          >
            {data.basics.label}
          </div>
        )}

        {/* Contact row — centered */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '4px 16px',
            marginTop: sp(12),
            fontSize: fs(11),
            color: META,
            fontFamily: BODY_FONT,
          }}
        >
          {data.basics.phone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <PhoneIcon color={ICON} /> {data.basics.phone}
            </span>
          )}
          {data.basics.email && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <AtSignIcon color={ICON} /> {data.basics.email}
            </span>
          )}
          {locationStr && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <PinIcon color={ICON} /> {locationStr}
            </span>
          )}
          {data.basics.profiles.map((profile, i) =>
            (profile.url || profile.username) ? (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <LinkIcon color={ICON} /> {profile.url ? stripUrl(profile.url) : profile.username}
              </span>
            ) : null,
          )}
        </div>
      </div>

      {/* ── Single-column sections ── */}
      {visibleSections.map((id) => (
        <div key={id}>{renderSection(id)}</div>
      ))}
    </div>
  )
}
