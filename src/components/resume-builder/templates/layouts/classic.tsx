'use client'

import type { ResumeDataV2, ThemeConfig } from '../../types'
import { safeHtml } from '../../sanitize'
import { stripUrl, BASE_SECTION_LABELS, PhoneIcon, AtSignIcon, LinkIcon, PinIcon, CalendarIcon } from '../shared'

/* ── static colour tokens ── */
const BODY = '#333'
const MUTED = '#555'
const LIGHT = '#888'
const BADGE_BORDER = '#444'
const ICON = '#555'

/* ── default column assignment ── */
const LEFT_SECTIONS = ['summary', 'work']
const RIGHT_SECTIONS = [
  'skills', 'education', 'projects', 'interests',
  'languages', 'certificates', 'volunteer', 'awards',
  'publications', 'references',
]

/* ── default section labels ── */
const DEFAULT_LABELS = BASE_SECTION_LABELS

/* ── themed section heading ── */
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
    <div style={{ marginBottom: '10px' }}>
      <h2
        style={{
          fontFamily: `${headingFont}, Georgia, serif`,
          fontSize,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: accentColor,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {children}
      </h2>
      <div style={{ width: '100%', height: '3px', backgroundColor: accentColor, marginTop: '2px' }} />
    </div>
  )
}

/* ── props ── */
type ClassicLayoutProps = {
  data: ResumeDataV2
  theme: ThemeConfig
  sectionOrder: string[]
  hiddenSections?: string[]
  sectionLabels?: Record<string, string>
}

export function ClassicLayout({
  data,
  theme,
  sectionOrder,
  hiddenSections = [],
  sectionLabels,
}: ClassicLayoutProps) {
  /* ── helpers from theme ── */
  const fs = (base: number) => `${base + theme.fontSize}px`
  const sp = (base: number) => `${base * theme.spacing}px`

  const ACCENT = theme.accentColor
  const HEADING_FONT = `${theme.headingFont}, Georgia, serif`
  const BODY_FONT = `${theme.bodyFont}, system-ui, sans-serif`

  const label = (sectionId: string) =>
    sectionLabels?.[sectionId] ?? DEFAULT_LABELS[sectionId] ?? sectionId

  /* ── column partitioning from sectionOrder (filter hidden) ── */
  const visibleSections = sectionOrder.filter((s) => !hiddenSections.includes(s))
  const leftSections = visibleSections.filter((s) => LEFT_SECTIONS.includes(s))
  const rightSections = visibleSections.filter((s) => RIGHT_SECTIONS.includes(s))

  /* ── contact items ── */
  const contactItems: { icon: React.ReactNode; text: string }[] = []
  if (data.basics.phone) contactItems.push({ icon: <PhoneIcon color={ICON} />, text: data.basics.phone })
  if (data.basics.email) contactItems.push({ icon: <AtSignIcon color={ICON} />, text: data.basics.email })
  for (const profile of data.basics.profiles) {
    if (profile.url || profile.username) {
      contactItems.push({
        icon: <LinkIcon color={ICON} />,
        text: profile.url ? stripUrl(profile.url) : profile.username,
      })
    }
  }

  /* ── location string ── */
  const locationParts = [data.basics.location.city, data.basics.location.region].filter(Boolean)
  const locationStr = locationParts.join(', ')

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
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('summary')}
        </SectionTitle>
        <div className="resume-rich-text" style={{ margin: 0, fontSize: fs(11.5), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(data.basics.summary) }} />
      </div>
    )
  }

  function renderWork() {
    if (data.work.length === 0) return null
    return (
      <div style={{ marginBottom: sp(20) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('work')}
        </SectionTitle>
        {data.work.map((job, i) => (
          <div key={i} data-break-avoid>
            {i > 0 && (
              <div style={{ borderBottom: '1px dashed #ccc', margin: `${sp(12)} 0` }} />
            )}
            <div style={{ marginBottom: sp(4) }}>
              {/* Position */}
              <div style={{ fontSize: fs(14), fontWeight: 700, color: ACCENT, lineHeight: 1.3, fontFamily: BODY_FONT }}>
                {job.position}
              </div>
              {/* Company */}
              <div style={{ fontSize: fs(11.5), fontWeight: 600, color: '#444', marginTop: '1px', fontFamily: BODY_FONT }}>
                {job.name}
              </div>
              {/* Date + Location */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '4px 16px',
                  marginTop: sp(4),
                  fontSize: fs(10),
                  color: '#666',
                  fontFamily: BODY_FONT,
                }}
              >
                {(job.startDate || job.endDate) && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <CalendarIcon color={LIGHT} /> {job.startDate}{job.endDate ? ` - ${job.endDate}` : ' - Present'}
                  </span>
                )}
                {job.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <PinIcon color={ICON} /> {job.location}
                  </span>
                )}
              </div>
            </div>
            {/* Summary */}
            {job.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(4)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(job.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderSkills() {
    if (data.skills.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('skills')}
        </SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp(7) }}>
          {data.skills.map((skill, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${BADGE_BORDER}`,
                borderRadius: '4px',
                padding: `${sp(4)} ${sp(12)}`,
                fontSize: fs(10.5),
                fontWeight: 500,
                color: ACCENT,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                fontFamily: BODY_FONT,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )
  }

  function renderEducation() {
    if (data.education.length === 0) return null
    return (
      <div style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('education')}
        </SectionTitle>
        {data.education.map((edu, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.education.length - 1 ? sp(12) : 0 }}>
            {/* Degree */}
            <div style={{ fontSize: fs(13), fontWeight: 700, color: ACCENT, lineHeight: 1.35, fontFamily: BODY_FONT }}>
              {[edu.studyType, edu.area].filter(Boolean).join(' in ')}
            </div>
            {/* Institution */}
            <div style={{ fontSize: fs(11.5), fontWeight: 600, color: '#444', marginTop: sp(2), fontFamily: BODY_FONT }}>
              {edu.institution}
            </div>
            {/* Date + Score */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '4px 14px',
                marginTop: sp(4),
                fontSize: fs(10),
                color: '#666',
                fontFamily: BODY_FONT,
              }}
            >
              {(edu.startDate || edu.endDate) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <CalendarIcon color={LIGHT} /> {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                </span>
              )}
              {edu.score && (
                <span>GPA: {edu.score}</span>
              )}
            </div>
            {/* Courses */}
            {edu.courses.length > 0 && (
              <div style={{ marginTop: sp(4), fontSize: fs(10), color: MUTED, fontFamily: BODY_FONT }}>
                {edu.courses.join(' | ')}
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
      <div style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('projects')}
        </SectionTitle>
        {data.projects.map((project, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(10) : 0 }}>
            {i > 0 && (
              <div style={{ borderBottom: '1px dashed #ccc', marginBottom: sp(10) }} />
            )}
            {/* Project name */}
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, lineHeight: 1.3, fontFamily: BODY_FONT }}>
              {project.name}
            </div>
            {/* Description */}
            {project.description && (
              <div className="resume-rich-text" style={{ margin: `${sp(3)} 0 0 0`, fontSize: fs(11), lineHeight: 1.5, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(project.description) }} />
            )}
            {/* Keywords / tech stack */}
            {project.keywords.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: sp(4) }}>
                {project.keywords.map((tech, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: fs(9),
                      color: MUTED,
                      fontWeight: 600,
                      backgroundColor: '#f5f5f5',
                      borderRadius: '2px',
                      padding: '1px 5px',
                      fontFamily: BODY_FONT,
                    }}
                  >
                    {tech}
                  </span>
                ))}
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
      <div data-break-avoid style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('interests')}
        </SectionTitle>
        {data.interests.map((interest, i) => (
          <div key={i} style={{ marginBottom: i < data.interests.length - 1 ? sp(8) : 0 }}>
            <div style={{ fontSize: fs(11.5), fontWeight: 700, color: ACCENT, lineHeight: 1.4, fontFamily: BODY_FONT }}>
              {interest.name}
            </div>
            {interest.keywords.length > 0 && (
              <div style={{ fontSize: fs(10.5), color: MUTED, marginTop: sp(2), fontFamily: BODY_FONT }}>
                {interest.keywords.join(' | ')}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderLanguages() {
    if (data.languages.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('languages')}
        </SectionTitle>
        {data.languages.map((lang, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2px 8px',
              fontSize: fs(11),
              color: BODY,
              fontFamily: BODY_FONT,
              marginBottom: sp(4),
            }}
          >
            <span style={{ fontWeight: 600 }}>{lang.language}</span>
            {lang.fluency && <span style={{ color: MUTED }}>{lang.fluency}</span>}
          </div>
        ))}
      </div>
    )
  }

  function renderCertificates() {
    if (data.certificates.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('certificates')}
        </SectionTitle>
        {data.certificates.map((cert, i) => (
          <div key={i} style={{ marginBottom: i < data.certificates.length - 1 ? sp(8) : 0 }}>
            <div style={{ fontSize: fs(11.5), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {cert.name}
            </div>
            <div style={{ fontSize: fs(10), color: MUTED, fontFamily: BODY_FONT }}>
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
      <div style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('volunteer')}
        </SectionTitle>
        {data.volunteer.map((vol, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.volunteer.length - 1 ? sp(10) : 0 }}>
            <div style={{ fontSize: fs(13), fontWeight: 700, color: ACCENT, lineHeight: 1.3, fontFamily: BODY_FONT }}>
              {vol.position}
            </div>
            <div style={{ fontSize: fs(11.5), fontWeight: 600, color: '#444', marginTop: '1px', fontFamily: BODY_FONT }}>
              {vol.organization}
            </div>
            {(vol.startDate || vol.endDate) && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: sp(4), fontSize: fs(10), color: '#666', fontFamily: BODY_FONT }}>
                <CalendarIcon color={LIGHT} /> {vol.startDate}{vol.endDate ? ` - ${vol.endDate}` : ' - Present'}
              </div>
            )}
            {vol.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(4)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(vol.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderAwards() {
    if (data.awards.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('awards')}
        </SectionTitle>
        {data.awards.map((award, i) => (
          <div key={i} style={{ marginBottom: i < data.awards.length - 1 ? sp(8) : 0 }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {award.title}
            </div>
            <div style={{ fontSize: fs(10), color: MUTED, fontFamily: BODY_FONT }}>
              {[award.awarder, award.date].filter(Boolean).join(' | ')}
            </div>
            {award.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(10.5), lineHeight: 1.5, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(award.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderPublications() {
    if (data.publications.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('publications')}
        </SectionTitle>
        {data.publications.map((pub, i) => (
          <div key={i} style={{ marginBottom: i < data.publications.length - 1 ? sp(8) : 0 }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {pub.name}
            </div>
            <div style={{ fontSize: fs(10), color: MUTED, fontFamily: BODY_FONT }}>
              {[pub.publisher, pub.releaseDate].filter(Boolean).join(' | ')}
            </div>
            {pub.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(10.5), lineHeight: 1.5, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(pub.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderReferences() {
    if (data.references.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(24) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(16)}>
          {label('references')}
        </SectionTitle>
        {data.references.map((ref, i) => (
          <div key={i} style={{ marginBottom: i < data.references.length - 1 ? sp(10) : 0 }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {ref.name}
            </div>
            {ref.reference && (
              <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontStyle: 'italic', fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(ref.reference) }} />
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
        fontSize: fs(11.5),
        lineHeight: 1.5,
        padding: 0,
        boxSizing: 'border-box',
        overflowWrap: 'anywhere',
      }}
    >
      {/* ── Header ── */}
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        {/* Name */}
        <h1
          style={{
            fontFamily: HEADING_FONT,
            fontSize: fs(30),
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: ACCENT,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {data.basics.name}
        </h1>

        {/* Label / job title */}
        {data.basics.label && (
          <div
            style={{
              fontFamily: HEADING_FONT,
              fontSize: fs(14),
              fontWeight: 700,
              color: ACCENT,
              marginTop: sp(2),
            }}
          >
            {data.basics.label}
          </div>
        )}

        {/* Contact row */}
        {contactItems.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: sp(16),
              marginTop: sp(10),
              fontSize: fs(11),
              fontWeight: 600,
              color: '#444',
              fontFamily: BODY_FONT,
            }}
          >
            {contactItems.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        )}

        {/* Location row */}
        {locationStr && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: sp(4),
              fontSize: fs(11),
              fontWeight: 600,
              color: '#444',
              fontFamily: BODY_FONT,
            }}
          >
            <PinIcon color={ICON} />
            {locationStr}
          </div>
        )}
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'flex', gap: sp(30) }}>
        {/* Left column - 58% */}
        <div style={{ flex: '0 0 58%', minWidth: 0 }}>
          {leftSections.map((id) => (
            <div key={id}>{renderSection(id)}</div>
          ))}
        </div>

        {/* Right column - 42% */}
        <div style={{ flex: '0 0 calc(42% - 30px)', minWidth: 0 }}>
          {rightSections.map((id) => (
            <div key={id}>{renderSection(id)}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
