'use client'

import type { ResumeDataV2, ThemeConfig } from '../../types'
import { safeHtml } from '../../sanitize'
import { stripUrl, hexToRgba, BASE_SECTION_LABELS } from '../shared'

const BODY = '#333'
const META = '#555'

const DEFAULT_LABELS: Record<string, string> = { ...BASE_SECTION_LABELS, summary: 'About Me', certificates: 'Certifications' }

function SectionTitle({ children, accentColor, fontSize }: { children: React.ReactNode; accentColor: string; fontSize: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', marginTop: '4px' }}>
      <div style={{ width: '4px', height: '18px', backgroundColor: accentColor, borderRadius: '2px', flexShrink: 0 }} />
      <h2
        style={{
          fontSize,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
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

type BoldLayoutProps = {
  data: ResumeDataV2
  theme: ThemeConfig
  sectionOrder: string[]
  hiddenSections?: string[]
  sectionLabels?: Record<string, string>
}

export function BoldLayout({
  data,
  theme,
  sectionOrder,
  hiddenSections = [],
  sectionLabels,
}: BoldLayoutProps) {
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
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('summary')}</SectionTitle>
        <div className="resume-rich-text" style={{ margin: 0, fontSize: fs(11), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(data.basics.summary) }} />
      </div>
    )
  }

  function renderWork() {
    if (data.work.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('work')}</SectionTitle>
        {data.work.map((job, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.work.length - 1 ? sp(14) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{job.position}</span>
                {job.name && <span style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}> at {job.name}</span>}
              </div>
              {(job.startDate || job.endDate) && (
                <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT, whiteSpace: 'nowrap' }}>
                  {job.startDate}{job.endDate ? ` – ${job.endDate}` : ' – Present'}
                </span>
              )}
            </div>
            {job.location && (
              <div style={{ fontSize: fs(10), color: META, marginTop: '1px', fontFamily: BODY_FONT }}>{job.location}</div>
            )}
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
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('skills')}</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {data.skills.map((skill, i) => (
            <span
              key={i}
              style={{
                fontSize: fs(9.5),
                color: ACCENT,
                fontWeight: 600,
                backgroundColor: hexToRgba(ACCENT, 0.08),
                borderRadius: '4px',
                padding: '2px 8px',
                fontFamily: BODY_FONT,
                lineHeight: 1.5,
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
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('education')}</SectionTitle>
        {data.education.map((edu, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.education.length - 1 ? sp(10) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
                {[edu.studyType, edu.area].filter(Boolean).join(' in ')}
              </span>
              {(edu.startDate || edu.endDate) && (
                <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
              )}
            </div>
            {edu.institution && <div style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}>{edu.institution}</div>}
            {edu.score && <div style={{ fontSize: fs(10), color: META, marginTop: '2px', fontFamily: BODY_FONT }}>GPA: {edu.score}</div>}
          </div>
        ))}
      </div>
    )
  }

  function renderProjects() {
    if (data.projects.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('projects')}</SectionTitle>
        {data.projects.map((p, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(10) : 0 }}>
            <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{p.name}</span>
            {p.description && <div className="resume-rich-text" style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(p.description) }} />}
            {p.keywords.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: sp(3) }}>
                {p.keywords.map((kw, j) => (
                  <span key={j} style={{ fontSize: fs(9), color: ACCENT, fontWeight: 600, backgroundColor: hexToRgba(ACCENT, 0.08), borderRadius: '3px', padding: '1px 6px', fontFamily: BODY_FONT }}>{kw}</span>
                ))}
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
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('languages')}</SectionTitle>
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
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('certificates')}</SectionTitle>
        {data.certificates.map((c, i) => (
          <div key={i} style={{ marginBottom: i < data.certificates.length - 1 ? sp(6) : 0 }}>
            <span style={{ fontSize: fs(11), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{c.name}</span>
            {c.issuer && <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}> — {c.issuer}</span>}
            {c.date && <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>{c.date}</div>}
          </div>
        ))}
      </div>
    )
  }

  function renderVolunteer() {
    if (data.volunteer.length === 0) return null
    return (
      <div style={{ marginBottom: sp(18) }}>
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('volunteer')}</SectionTitle>
        {data.volunteer.map((v, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.volunteer.length - 1 ? sp(10) : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>{v.position}</span>
                {v.organization && <span style={{ fontSize: fs(11), color: META, fontFamily: BODY_FONT }}> | {v.organization}</span>}
              </div>
              {(v.startDate || v.endDate) && (
                <span style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT, whiteSpace: 'nowrap' }}>{v.startDate}{v.endDate ? ` – ${v.endDate}` : ' – Present'}</span>
              )}
            </div>
            {v.summary && (
              <div className="resume-rich-text" style={{ margin: `${sp(3)} 0 0 0`, fontSize: fs(11), lineHeight: 1.55, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(v.summary) }} />
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
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('awards')}</SectionTitle>
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
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('publications')}</SectionTitle>
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
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('interests')}</SectionTitle>
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
        <SectionTitle accentColor={ACCENT} fontSize={fs(13)}>{label('references')}</SectionTitle>
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
      {/* Full-width colored header banner */}
      <div
        data-break-avoid
        style={{
          backgroundColor: ACCENT,
          color: '#fff',
          padding: `${sp(24)} ${sp(28)}`,
          marginBottom: sp(20),
        }}
      >
        <h1 style={{ fontFamily: HEADING_FONT, fontSize: fs(30), fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>
          {data.basics.name}
        </h1>
        {data.basics.label && (
          <div style={{ fontSize: fs(14), fontWeight: 400, color: 'rgba(255,255,255,0.85)', marginTop: sp(4), fontFamily: BODY_FONT }}>{data.basics.label}</div>
        )}
        {contactParts.length > 0 && (
          <div style={{ fontSize: fs(10), color: 'rgba(255,255,255,0.7)', marginTop: sp(10), fontFamily: BODY_FONT, lineHeight: 1.6 }}>
            {contactParts.join('  |  ')}
          </div>
        )}
      </div>

      {/* Body sections */}
      <div style={{ padding: `0 ${sp(4)}` }}>
        {visibleSections.map((id) => (
          <div key={id}>{renderSection(id)}</div>
        ))}
      </div>
    </div>
  )
}
