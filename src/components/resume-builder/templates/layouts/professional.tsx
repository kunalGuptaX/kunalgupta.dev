'use client'

import type { ResumeDataV2, ThemeConfig } from '../../types'
import { safeHtml } from '../../sanitize'
import { stripUrl, BASE_SECTION_LABELS } from '../shared'

/* ── static colour tokens ── */
const BODY = '#333'
const META = '#555'
const RULE = '#ccc'

/* ── default section labels ── */
const DEFAULT_LABELS: Record<string, string> = {
  ...BASE_SECTION_LABELS,
  summary: 'Professional Summary',
  work: 'Work Experience',
  skills: 'Technical Skills',
  certificates: 'Certifications',
  volunteer: 'Volunteer Experience',
  awards: 'Awards & Honors',
}

/* ── ATS-friendly section heading: bold uppercase + thin rule ── */
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
    <div style={{ marginBottom: '8px', marginTop: '4px' }}>
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
      <div style={{ width: '100%', height: '1px', backgroundColor: RULE, marginTop: '3px' }} />
    </div>
  )
}

/* ── props ── */
type ProfessionalLayoutProps = {
  data: ResumeDataV2
  theme: ThemeConfig
  sectionOrder: string[]
  hiddenSections?: string[]
  sectionLabels?: Record<string, string>
}

export function ProfessionalLayout({
  data,
  theme,
  sectionOrder,
  hiddenSections = [],
  sectionLabels,
}: ProfessionalLayoutProps) {
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

  /* ── contact line ── */
  const contactParts: string[] = []
  if (data.basics.phone) contactParts.push(data.basics.phone)
  if (data.basics.email) contactParts.push(data.basics.email)
  if (locationStr) contactParts.push(locationStr)
  if (data.basics.url) contactParts.push(stripUrl(data.basics.url))
  for (const profile of data.basics.profiles) {
    if (profile.url) contactParts.push(stripUrl(profile.url))
    else if (profile.username) contactParts.push(`${profile.network}: ${profile.username}`)
  }

  const visibleSections = sectionOrder.filter((s) => !hiddenSections.includes(s))

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
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('summary')}
        </SectionTitle>
        <div className="resume-rich-text" style={{ margin: 0, fontSize: fs(11), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(data.basics.summary) }} />
      </div>
    )
  }

  function renderWork() {
    if (data.work.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('work')}
        </SectionTitle>
        {data.work.map((job, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.work.length - 1 ? sp(14) : 0 }}>
            {/* Row: Position | Company | Date range */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
                  {job.position}
                </span>
                {job.name && (
                  <span style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
                    {' '}| {job.name}
                  </span>
                )}
                {job.location && (
                  <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>
                    {' '}| {job.location}
                  </span>
                )}
              </div>
              {(job.startDate || job.endDate) && (
                <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT, whiteSpace: 'nowrap' }}>
                  {job.startDate}{job.endDate ? ` - ${job.endDate}` : ' - Present'}
                </div>
              )}
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
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('skills')}
        </SectionTitle>
        <div style={{ fontSize: fs(11), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.6 }}>
          {data.skills.join(', ')}
        </div>
      </div>
    )
  }

  function renderEducation() {
    if (data.education.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('education')}
        </SectionTitle>
        {data.education.map((edu, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.education.length - 1 ? sp(10) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
                  {[edu.studyType, edu.area].filter(Boolean).join(' in ')}
                </span>
                {edu.institution && (
                  <span style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
                    {' '}| {edu.institution}
                  </span>
                )}
              </div>
              {(edu.startDate || edu.endDate) && (
                <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT, whiteSpace: 'nowrap' }}>
                  {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                </div>
              )}
            </div>
            {edu.score && (
              <div style={{ fontSize: fs(10), color: META, marginTop: '2px', fontFamily: BODY_FONT }}>
                GPA: {edu.score}
              </div>
            )}
            {edu.courses.length > 0 && (
              <div style={{ fontSize: fs(10), color: META, marginTop: sp(2), fontFamily: BODY_FONT }}>
                Relevant Courses: {edu.courses.join(', ')}
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
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('projects')}
        </SectionTitle>
        {data.projects.map((project, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(10) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
                {project.name}
              </span>
              {(project.startDate || project.endDate) && (
                <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT, whiteSpace: 'nowrap' }}>
                  {project.startDate}{project.endDate ? ` - ${project.endDate}` : ''}
                </span>
              )}
            </div>
            {project.description && (
              <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(project.description) }} />
            )}
            {project.keywords.length > 0 && (
              <div style={{ fontSize: fs(10), color: META, marginTop: sp(2), fontFamily: BODY_FONT }}>
                Technologies: {project.keywords.join(', ')}
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
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('languages')}
        </SectionTitle>
        <div style={{ fontSize: fs(11), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.6 }}>
          {data.languages.map((lang) =>
            lang.fluency ? `${lang.language} (${lang.fluency})` : lang.language,
          ).join(' | ')}
        </div>
      </div>
    )
  }

  function renderCertificates() {
    if (data.certificates.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('certificates')}
        </SectionTitle>
        {data.certificates.map((cert, i) => (
          <div key={i} style={{ marginBottom: i < data.certificates.length - 1 ? sp(6) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <span style={{ fontSize: fs(11), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
                {cert.name}
              </span>
              {cert.date && (
                <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>
                  {cert.date}
                </span>
              )}
            </div>
            {cert.issuer && (
              <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>
                {cert.issuer}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderVolunteer() {
    if (data.volunteer.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('volunteer')}
        </SectionTitle>
        {data.volunteer.map((vol, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.volunteer.length - 1 ? sp(10) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
                  {vol.position}
                </span>
                {vol.organization && (
                  <span style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>
                    {' '}| {vol.organization}
                  </span>
                )}
              </div>
              {(vol.startDate || vol.endDate) && (
                <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT, whiteSpace: 'nowrap' }}>
                  {vol.startDate}{vol.endDate ? ` - ${vol.endDate}` : ' - Present'}
                </div>
              )}
            </div>
            {vol.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(3)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(vol.summary) }} />
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
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('awards')}
        </SectionTitle>
        {data.awards.map((award, i) => (
          <div key={i} style={{ marginBottom: i < data.awards.length - 1 ? sp(6) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
                {award.title}
              </span>
              {award.date && (
                <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>
                  {award.date}
                </span>
              )}
            </div>
            {award.awarder && (
              <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>
                {award.awarder}
              </div>
            )}
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
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('publications')}
        </SectionTitle>
        {data.publications.map((pub, i) => (
          <div key={i} style={{ marginBottom: i < data.publications.length - 1 ? sp(6) : 0 }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {pub.name}
            </div>
            <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>
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

  function renderInterests() {
    if (data.interests.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('interests')}
        </SectionTitle>
        <div style={{ fontSize: fs(11), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.6 }}>
          {data.interests.map((interest) =>
            interest.keywords.length > 0
              ? `${interest.name}: ${interest.keywords.join(', ')}`
              : interest.name,
          ).join(' | ')}
        </div>
      </div>
    )
  }

  function renderReferences() {
    if (data.references.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(14)}>
          {label('references')}
        </SectionTitle>
        {data.references.map((ref, i) => (
          <div key={i} style={{ marginBottom: i < data.references.length - 1 ? sp(8) : 0 }}>
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
        fontSize: fs(11),
        lineHeight: 1.5,
        padding: 0,
        boxSizing: 'border-box',
        overflowWrap: 'anywhere',
      }}
    >
      {/* ── Header ── */}
      <div data-break-avoid style={{ marginBottom: sp(16) }}>
        {/* Name */}
        <h1
          style={{
            fontFamily: HEADING_FONT,
            fontSize: fs(28),
            fontWeight: 700,
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
              fontSize: fs(14),
              fontWeight: 400,
              color: META,
              marginTop: sp(2),
              fontFamily: BODY_FONT,
            }}
          >
            {data.basics.label}
          </div>
        )}

        {/* Contact line */}
        {contactParts.length > 0 && (
          <div
            style={{
              fontSize: fs(10),
              color: META,
              marginTop: sp(8),
              fontFamily: BODY_FONT,
              lineHeight: 1.6,
            }}
          >
            {contactParts.join('  |  ')}
          </div>
        )}

        {/* Horizontal rule divider */}
        <div style={{ width: '100%', height: '2px', backgroundColor: ACCENT, marginTop: sp(10) }} />
      </div>

      {/* ── Single-column sections ── */}
      {visibleSections.map((id) => (
        <div key={id}>{renderSection(id)}</div>
      ))}
    </div>
  )
}
