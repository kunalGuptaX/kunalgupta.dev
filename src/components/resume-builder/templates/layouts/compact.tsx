'use client'

import type { ResumeDataV2, ThemeConfig } from '../../types'
import { safeHtml } from '../../sanitize'

const BODY = '#333'
const META = '#555'
const RULE = '#d4d4d4'

const DEFAULT_LABELS: Record<string, string> = {
  summary: 'Summary',
  work: 'Experience',
  skills: 'Skills',
  education: 'Education',
  projects: 'Projects',
  interests: 'Interests',
  languages: 'Languages',
  certificates: 'Certifications',
  volunteer: 'Volunteer',
  awards: 'Awards',
  publications: 'Publications',
  references: 'References',
}

function stripUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '')
}

function SectionTitle({ children, accentColor }: { children: React.ReactNode; accentColor: string }) {
  return (
    <div style={{ marginBottom: '4px', borderBottom: `1px solid ${RULE}`, paddingBottom: '2px' }}>
      <h2
        style={{
          fontSize: '10px',
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
    </div>
  )
}

type CompactLayoutProps = {
  data: ResumeDataV2
  theme: ThemeConfig
  isEditing: boolean
  sectionOrder: string[]
  hiddenSections?: string[]
  onDataChange: (data: ResumeDataV2) => void
  onSectionOrderChange: (order: string[]) => void
  sectionLabels?: Record<string, string>
}

export function CompactLayout({
  data,
  theme,
  sectionOrder,
  hiddenSections = [],
  sectionLabels,
}: CompactLayoutProps) {
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
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <div className="resume-rich-text" style={{ margin: 0, fontSize: fs(9.5), lineHeight: 1.5, color: BODY, fontFamily: BODY_FONT, fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: safeHtml(data.basics.summary) }} />
      </div>
    )
  }

  function renderWork() {
    if (data.work.length === 0) return null
    return (
      <div style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('work')}</SectionTitle>
        {data.work.map((job, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.work.length - 1 ? sp(6) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: fs(10), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{job.position}</span>
                {job.name && <span style={{ fontSize: fs(9.5), color: META, fontFamily: BODY_FONT }}> | {job.name}</span>}
                {job.location && <span style={{ fontSize: fs(9), color: META, fontFamily: BODY_FONT }}> | {job.location}</span>}
              </div>
              {(job.startDate || job.endDate) && (
                <span style={{ fontSize: fs(8.5), color: META, fontFamily: BODY_FONT, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {job.startDate}{job.endDate ? ` – ${job.endDate}` : ' – Present'}
                </span>
              )}
            </div>
            {job.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(9), lineHeight: 1.45, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(job.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderSkills() {
    if (data.skills.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('skills')}</SectionTitle>
        <div style={{ fontSize: fs(9), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.5 }}>
          {data.skills.join(', ')}
        </div>
      </div>
    )
  }

  function renderEducation() {
    if (data.education.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('education')}</SectionTitle>
        {data.education.map((edu, i) => (
          <div key={i} style={{ fontSize: fs(9.5), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.5, marginBottom: sp(2) }}>
            <span style={{ fontWeight: 700, color: ACCENT }}>{[edu.studyType, edu.area].filter(Boolean).join(' in ')}</span>
            {edu.institution && <span style={{ color: META }}> — {edu.institution}</span>}
            {(edu.startDate || edu.endDate) && <span style={{ color: META }}> — {edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</span>}
            {edu.score && <span style={{ color: META }}> (GPA: {edu.score})</span>}
          </div>
        ))}
      </div>
    )
  }

  function renderProjects() {
    if (data.projects.length === 0) return null
    return (
      <div style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('projects')}</SectionTitle>
        {data.projects.map((p, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(4) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <span style={{ fontSize: fs(10), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{p.name}</span>
              {p.keywords.length > 0 && (
                <span style={{ fontSize: fs(8), color: META, fontFamily: BODY_FONT }}>{p.keywords.join(', ')}</span>
              )}
            </div>
            {p.description && (
              <div className="resume-rich-text" style={{ margin: `${sp(1)} 0 0 0`, fontSize: fs(9), lineHeight: 1.45, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(p.description) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderLanguages() {
    if (data.languages.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('languages')}</SectionTitle>
        <div style={{ fontSize: fs(9), color: BODY, fontFamily: BODY_FONT }}>
          {data.languages.map((l) => l.fluency ? `${l.language} (${l.fluency})` : l.language).join(' | ')}
        </div>
      </div>
    )
  }

  function renderCertificates() {
    if (data.certificates.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('certificates')}</SectionTitle>
        {data.certificates.map((c, i) => (
          <div key={i} style={{ fontSize: fs(9), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>{c.name}</span>
            {c.issuer && <span style={{ color: META }}> — {c.issuer}</span>}
            {c.date && <span style={{ color: META }}> ({c.date})</span>}
          </div>
        ))}
      </div>
    )
  }

  function renderVolunteer() {
    if (data.volunteer.length === 0) return null
    return (
      <div style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('volunteer')}</SectionTitle>
        {data.volunteer.map((v, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.volunteer.length - 1 ? sp(4) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <div>
                <span style={{ fontSize: fs(10), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{v.position}</span>
                {v.organization && <span style={{ fontSize: fs(9), color: META, fontFamily: BODY_FONT }}> | {v.organization}</span>}
              </div>
              {(v.startDate || v.endDate) && (
                <span style={{ fontSize: fs(8.5), color: META, fontFamily: BODY_FONT, whiteSpace: 'nowrap' }}>
                  {v.startDate}{v.endDate ? ` – ${v.endDate}` : ' – Present'}
                </span>
              )}
            </div>
            {v.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(1)} 0 0 0`, fontSize: fs(9), lineHeight: 1.45, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(v.summary) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderAwards() {
    if (data.awards.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('awards')}</SectionTitle>
        {data.awards.map((a, i) => (
          <div key={i} style={{ fontSize: fs(9), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>{a.title}</span>
            {a.awarder && <span style={{ color: META }}> — {a.awarder}</span>}
            {a.date && <span style={{ color: META }}> ({a.date})</span>}
          </div>
        ))}
      </div>
    )
  }

  function renderPublications() {
    if (data.publications.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('publications')}</SectionTitle>
        {data.publications.map((p, i) => (
          <div key={i} style={{ fontSize: fs(9), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>{p.name}</span>
            {p.publisher && <span style={{ color: META }}> — {p.publisher}</span>}
            {p.releaseDate && <span style={{ color: META }}> ({p.releaseDate})</span>}
          </div>
        ))}
      </div>
    )
  }

  function renderInterests() {
    if (data.interests.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('interests')}</SectionTitle>
        <div style={{ fontSize: fs(9), color: BODY, fontFamily: BODY_FONT, lineHeight: 1.6 }}>
          {data.interests.map((int) =>
            int.keywords.length > 0 ? `${int.name}: ${int.keywords.join(', ')}` : int.name
          ).join(' | ')}
        </div>
      </div>
    )
  }

  function renderReferences() {
    if (data.references.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(8) }}>
        <SectionTitle accentColor={ACCENT}>{label('references')}</SectionTitle>
        {data.references.map((r, i) => (
          <div key={i} style={{ marginBottom: i < data.references.length - 1 ? sp(4) : 0 }}>
            <div style={{ fontSize: fs(9.5), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{r.name}</div>
            {r.reference && (
              <div className="resume-rich-text" style={{ margin: '1px 0 0 0', fontSize: fs(8.5), lineHeight: 1.5, color: BODY, fontStyle: 'italic', fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(r.reference) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#fff',
        fontFamily: BODY_FONT,
        color: BODY,
        fontSize: fs(9.5),
        lineHeight: 1.4,
        padding: 0,
        boxSizing: 'border-box',
        overflowWrap: 'anywhere',
      }}
    >
      {/* Header: name left, contact right */}
      <div data-break-avoid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px 12px', marginBottom: sp(6), borderBottom: `2px solid ${ACCENT}`, paddingBottom: sp(6) }}>
        <div>
          <h1 style={{ fontFamily: HEADING_FONT, fontSize: fs(22), fontWeight: 700, color: ACCENT, margin: 0, lineHeight: 1.2 }}>
            {data.basics.name}
          </h1>
          {data.basics.label && (
            <div style={{ fontSize: fs(11), color: META, marginTop: sp(1), fontFamily: BODY_FONT }}>{data.basics.label}</div>
          )}
        </div>
        {contactParts.length > 0 && (
          <div style={{ textAlign: 'right', fontSize: fs(8.5), color: META, fontFamily: BODY_FONT, lineHeight: 1.6, maxWidth: '50%' }}>
            {contactParts.join('  |  ')}
          </div>
        )}
      </div>

      {/* Sections */}
      {visibleSections.map((id) => (
        <div key={id}>{renderSection(id)}</div>
      ))}
    </div>
  )
}
