'use client'

import type { ResumeDataV2, ThemeConfig } from '../../types'
import { safeHtml } from '../../sanitize'
import { stripUrl, hexToRgba, BASE_SECTION_LABELS } from '../shared'

const BODY = '#333'
const META = '#555'
const RULE = '#ccc'

const DEFAULT_LABELS: Record<string, string> = {
  ...BASE_SECTION_LABELS,
  summary: 'Profile',
  work: 'Professional Experience',
  certificates: 'Certifications',
  volunteer: 'Volunteer Experience',
}

/* ── Section heading ── */
function SectionTitle({ children, accentColor, headingFont, fontSize }: { children: React.ReactNode; accentColor: string; headingFont: string; fontSize: string }) {
  return (
    <div style={{ marginBottom: '10px', borderBottom: `1px solid ${RULE}`, paddingBottom: '4px' }}>
      <h2 style={{ fontFamily: `${headingFont}, Georgia, serif`, fontSize, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: accentColor, margin: 0, lineHeight: 1.3 }}>
        {children}
      </h2>
    </div>
  )
}

/* ── Timeline entry: date on left, dot + line, content on right ── */
function TimelineEntry({
  dateText,
  children,
  accentColor,
  isLast,
  bodyFont,
  fontSize,
}: {
  dateText: string
  children: React.ReactNode
  accentColor: string
  isLast: boolean
  bodyFont: string
  fontSize: string
}) {
  return (
    <div style={{ display: 'flex', gap: '24px', position: 'relative', minHeight: '32px' }}>
      {/* Left: date */}
      <div style={{ width: '80px', flexShrink: 0, textAlign: 'right', position: 'relative', paddingTop: '2px' }}>
        <div style={{ fontSize, color: META, lineHeight: 1.4, fontFamily: bodyFont, whiteSpace: 'nowrap' }}>{dateText}</div>
        {/* Vertical line */}
        {!isLast && (
          <div style={{ position: 'absolute', top: '16px', right: '-16px', width: '2px', bottom: '-8px', backgroundColor: hexToRgba(accentColor, 0.2) }} />
        )}
        {/* Dot */}
        <div style={{ position: 'absolute', top: '6px', right: '-19px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accentColor, border: '2px solid #fff', boxSizing: 'content-box' }} />
      </div>
      {/* Right: content */}
      <div style={{ flex: 1, paddingBottom: isLast ? '0' : '14px' }}>
        {children}
      </div>
    </div>
  )
}

type TimelineLayoutProps = {
  data: ResumeDataV2
  theme: ThemeConfig
  sectionOrder: string[]
  hiddenSections?: string[]
  sectionLabels?: Record<string, string>
}

export function TimelineLayout({
  data,
  theme,
  sectionOrder,
  hiddenSections = [],
  sectionLabels,
}: TimelineLayoutProps) {
  const fs = (base: number) => `${base + theme.fontSize}px`
  const sp = (base: number) => `${base * theme.spacing}px`

  const ACCENT = theme.accentColor
  const BODY_FONT = `${theme.bodyFont}, system-ui, sans-serif`
  const HEADING_FONT = `${theme.headingFont}, Georgia, serif`

  const label = (id: string) => sectionLabels?.[id] ?? DEFAULT_LABELS[id] ?? id

  const locationParts = [data.basics.location.city, data.basics.location.region].filter(Boolean)
  const locationStr = locationParts.join(', ')

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

  function renderSummary() {
    if (!data.basics.summary) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('summary')}</SectionTitle>
        <div className="resume-rich-text" style={{ margin: 0, fontSize: fs(11), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(data.basics.summary) }} />
      </div>
    )
  }

  function renderWork() {
    if (data.work.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('work')}</SectionTitle>
        {data.work.map((job, i) => {
          const dateText = job.startDate
            ? `${job.startDate}${job.endDate ? ` – ${job.endDate}` : ' – Now'}`
            : ''
          return (
            <TimelineEntry key={i} dateText={dateText} accentColor={ACCENT} isLast={i === data.work.length - 1} bodyFont={BODY_FONT} fontSize={fs(9.5)}>
              <div data-break-avoid>
                <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT, lineHeight: 1.3 }}>{job.position}</div>
                {job.name && <div style={{ fontSize: fs(11), color: '#444', fontWeight: 600, fontFamily: BODY_FONT }}>{job.name}</div>}
                {job.location && <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>{job.location}</div>}
                {job.summary && <div className="resume-rich-text" style={{ margin: `${sp(4)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(job.summary) }} />}
              </div>
            </TimelineEntry>
          )
        })}
      </div>
    )
  }

  function renderEducation() {
    if (data.education.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('education')}</SectionTitle>
        {data.education.map((edu, i) => {
          const dateText = edu.startDate
            ? `${edu.startDate}${edu.endDate ? ` – ${edu.endDate}` : ''}`
            : ''
          return (
            <TimelineEntry key={i} dateText={dateText} accentColor={ACCENT} isLast={i === data.education.length - 1} bodyFont={BODY_FONT} fontSize={fs(9.5)}>
              <div data-break-avoid>
                <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{[edu.studyType, edu.area].filter(Boolean).join(' in ')}</div>
                {edu.institution && <div style={{ fontSize: fs(11), color: '#444', fontWeight: 600, fontFamily: BODY_FONT }}>{edu.institution}</div>}
                {edu.score && <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>GPA: {edu.score}</div>}
                {edu.courses.length > 0 && <div style={{ fontSize: fs(10), color: META, marginTop: sp(2), fontFamily: BODY_FONT }}>{edu.courses.join(', ')}</div>}
              </div>
            </TimelineEntry>
          )
        })}
      </div>
    )
  }

  function renderSkills() {
    if (data.skills.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('skills')}</SectionTitle>
        <div style={{ fontSize: fs(11), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.6 }}>
          {data.skills.join(', ')}
        </div>
      </div>
    )
  }

  function renderProjects() {
    if (data.projects.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('projects')}</SectionTitle>
        {data.projects.map((p, i) => {
          const dateText = p.startDate ? `${p.startDate}${p.endDate ? ` – ${p.endDate}` : ''}` : ''
          if (dateText) {
            return (
              <TimelineEntry key={i} dateText={dateText} accentColor={ACCENT} isLast={i === data.projects.length - 1} bodyFont={BODY_FONT} fontSize={fs(9.5)}>
                <div data-break-avoid>
                  <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{p.name}</div>
                  {p.description && <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(p.description) }} />}
                  {p.keywords.length > 0 && <div style={{ fontSize: fs(10), color: META, marginTop: sp(2), fontFamily: BODY_FONT }}>Tech: {p.keywords.join(', ')}</div>}
                </div>
              </TimelineEntry>
            )
          }
          return (
            <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(10) : 0 }}>
              <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{p.name}</div>
              {p.description && <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(p.description) }} />}
              {p.keywords.length > 0 && <div style={{ fontSize: fs(10), color: META, marginTop: sp(2), fontFamily: BODY_FONT }}>Tech: {p.keywords.join(', ')}</div>}
            </div>
          )
        })}
      </div>
    )
  }

  function renderVolunteer() {
    if (data.volunteer.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('volunteer')}</SectionTitle>
        {data.volunteer.map((v, i) => {
          const dateText = v.startDate ? `${v.startDate}${v.endDate ? ` – ${v.endDate}` : ' – Now'}` : ''
          return (
            <TimelineEntry key={i} dateText={dateText} accentColor={ACCENT} isLast={i === data.volunteer.length - 1} bodyFont={BODY_FONT} fontSize={fs(9.5)}>
              <div data-break-avoid>
                <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{v.position}</div>
                {v.organization && <div style={{ fontSize: fs(11), color: '#444', fontWeight: 600, fontFamily: BODY_FONT }}>{v.organization}</div>}
                {v.summary && <div className="resume-rich-text" style={{ margin: `${sp(3)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(v.summary) }} />}
              </div>
            </TimelineEntry>
          )
        })}
      </div>
    )
  }

  function renderLanguages() {
    if (data.languages.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('languages')}</SectionTitle>
        <div style={{ fontSize: fs(11), color: BODY, fontFamily: BODY_FONT }}>
          {data.languages.map((l) => l.fluency ? `${l.language} (${l.fluency})` : l.language).join(' | ')}
        </div>
      </div>
    )
  }

  function renderCertificates() {
    if (data.certificates.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('certificates')}</SectionTitle>
        {data.certificates.map((c, i) => (
          <div key={i} style={{ marginBottom: i < data.certificates.length - 1 ? sp(6) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <span style={{ fontSize: fs(11), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{c.name}</span>
              {c.date && <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>{c.date}</span>}
            </div>
            {c.issuer && <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>{c.issuer}</div>}
          </div>
        ))}
      </div>
    )
  }

  function renderAwards() {
    if (data.awards.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('awards')}</SectionTitle>
        {data.awards.map((a, i) => (
          <div key={i} style={{ marginBottom: i < data.awards.length - 1 ? sp(6) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{a.title}</span>
              {a.date && <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>{a.date}</span>}
            </div>
            {a.awarder && <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>{a.awarder}</div>}
            {a.summary && <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(10.5), lineHeight: 1.5, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(a.summary) }} />}
          </div>
        ))}
      </div>
    )
  }

  function renderPublications() {
    if (data.publications.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('publications')}</SectionTitle>
        {data.publications.map((p, i) => (
          <div key={i} style={{ marginBottom: i < data.publications.length - 1 ? sp(6) : 0 }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{p.name}</div>
            <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>{[p.publisher, p.releaseDate].filter(Boolean).join(' | ')}</div>
            {p.summary && <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(10.5), lineHeight: 1.5, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(p.summary) }} />}
          </div>
        ))}
      </div>
    )
  }

  function renderInterests() {
    if (data.interests.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('interests')}</SectionTitle>
        <div style={{ fontSize: fs(11), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.6 }}>
          {data.interests.map((int) => int.keywords.length > 0 ? `${int.name}: ${int.keywords.join(', ')}` : int.name).join(' | ')}
        </div>
      </div>
    )
  }

  function renderReferences() {
    if (data.references.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(13)}>{label('references')}</SectionTitle>
        {data.references.map((r, i) => (
          <div key={i} style={{ marginBottom: i < data.references.length - 1 ? sp(8) : 0 }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{r.name}</div>
            {r.reference && <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontStyle: 'italic', fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(r.reference) }} />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ width: '100%', minHeight: '100%', backgroundColor: '#fff', fontFamily: BODY_FONT, color: BODY, fontSize: fs(11), lineHeight: 1.5, padding: 0, boxSizing: 'border-box', overflowWrap: 'anywhere' }}>
      {/* Header */}
      <div data-break-avoid style={{ marginBottom: sp(16) }}>
        <h1 style={{ fontFamily: HEADING_FONT, fontSize: fs(28), fontWeight: 700, color: ACCENT, margin: 0, lineHeight: 1.2 }}>
          {data.basics.name}
        </h1>
        {data.basics.label && (
          <div style={{ fontSize: fs(13), color: META, marginTop: sp(2), fontFamily: BODY_FONT }}>{data.basics.label}</div>
        )}
        {contactParts.length > 0 && (
          <div style={{ fontSize: fs(10), color: META, marginTop: sp(6), fontFamily: BODY_FONT, lineHeight: 1.6 }}>
            {contactParts.join('  |  ')}
          </div>
        )}
        <div style={{ width: '100%', height: '2px', backgroundColor: ACCENT, marginTop: sp(8) }} />
      </div>

      {/* Sections */}
      {visibleSections.map((id) => (
        <div key={id}>{renderSection(id)}</div>
      ))}
    </div>
  )
}
