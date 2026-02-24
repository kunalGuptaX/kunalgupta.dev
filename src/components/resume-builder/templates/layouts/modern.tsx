'use client'

import type { ResumeDataV2, ThemeConfig } from '../../types'
import { safeHtml } from '../../sanitize'

/* ── static colour tokens ── */
const BODY = '#333'
const META = '#555'
const LIGHT = '#888'

/* ── default section labels ── */
const DEFAULT_LABELS: Record<string, string> = {
  summary: 'Profile',
  work: 'Experience',
  skills: 'Skills',
  education: 'Education',
  projects: 'Projects',
  interests: 'Interests',
  languages: 'Languages',
  certificates: 'Certificates',
  volunteer: 'Volunteer',
  awards: 'Awards',
  publications: 'Publications',
  references: 'References',
}

/* ── sidebar vs main assignment ── */
const SIDEBAR_SECTIONS = ['skills', 'languages', 'interests', 'certificates', 'references']
const MAIN_SECTIONS = ['summary', 'work', 'education', 'projects', 'volunteer', 'awards', 'publications']

function stripUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '')
}

/** Convert hex to rgba */
function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(26,26,26,${alpha})`
  return `rgba(${r},${g},${b},${alpha})`
}

/* ── section heading for main area ── */
function MainSectionTitle({
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
      <div style={{ width: '40px', height: '3px', backgroundColor: accentColor, marginTop: '4px' }} />
    </div>
  )
}

/* ── section heading for sidebar ── */
function SidebarSectionTitle({
  children,
  fontSize,
}: {
  children: React.ReactNode
  fontSize: string
}) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <h2
        style={{
          fontFamily: 'inherit',
          fontSize,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: '#fff',
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {children}
      </h2>
      <div style={{ width: '30px', height: '2px', backgroundColor: 'rgba(255,255,255,0.5)', marginTop: '4px' }} />
    </div>
  )
}

/* ── icons ── */
function PhoneIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function AtSignIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={LIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

/* ── props ── */
type ModernLayoutProps = {
  data: ResumeDataV2
  theme: ThemeConfig
  isEditing: boolean
  sectionOrder: string[]
  hiddenSections?: string[]
  onDataChange: (data: ResumeDataV2) => void
  onSectionOrderChange: (order: string[]) => void
  sectionLabels?: Record<string, string>
}

export function ModernLayout({
  data,
  theme,
  sectionOrder,
  hiddenSections = [],
  sectionLabels,
}: ModernLayoutProps) {
  /* ── helpers from theme ── */
  const fs = (base: number) => `${base + theme.fontSize}px`
  const sp = (base: number) => `${base * theme.spacing}px`

  const ACCENT = theme.accentColor
  const HEADING_FONT = `${theme.headingFont}, Georgia, serif`
  const BODY_FONT = `${theme.bodyFont}, system-ui, sans-serif`
  const SIDEBAR_BG = hexToRgba(ACCENT, 0.9)

  const label = (sectionId: string) =>
    sectionLabels?.[sectionId] ?? DEFAULT_LABELS[sectionId] ?? sectionId

  /* ── location string ── */
  const locationParts = [data.basics.location.city, data.basics.location.region].filter(Boolean)
  const locationStr = locationParts.join(', ')

  /* ── column partitioning ── */
  const visibleSections = sectionOrder.filter((s) => !hiddenSections.includes(s))
  const sidebarSections = visibleSections.filter((s) => SIDEBAR_SECTIONS.includes(s))
  const mainSections = visibleSections.filter((s) => MAIN_SECTIONS.includes(s))

  /* ── sidebar section renderer ── */
  const renderSidebarSection = (id: string) => {
    switch (id) {
      case 'skills': return renderSidebarSkills()
      case 'languages': return renderSidebarLanguages()
      case 'interests': return renderSidebarInterests()
      case 'certificates': return renderSidebarCertificates()
      case 'references': return renderSidebarReferences()
      default: return null
    }
  }

  /* ── main section renderer ── */
  const renderMainSection = (id: string) => {
    switch (id) {
      case 'summary': return renderSummary()
      case 'work': return renderWork()
      case 'education': return renderEducation()
      case 'projects': return renderProjects()
      case 'volunteer': return renderVolunteer()
      case 'awards': return renderAwards()
      case 'publications': return renderPublications()
      default: return null
    }
  }

  /* ──────────────────────────── Sidebar section renderers ──────────────────────────── */

  function renderSidebarContact() {
    const items: { icon: React.ReactNode; text: string }[] = []
    if (data.basics.phone) items.push({ icon: <PhoneIcon />, text: data.basics.phone })
    if (data.basics.email) items.push({ icon: <AtSignIcon />, text: data.basics.email })
    if (locationStr) items.push({ icon: <PinIcon />, text: locationStr })
    if (data.basics.url) items.push({ icon: <LinkIcon />, text: stripUrl(data.basics.url) })
    for (const profile of data.basics.profiles) {
      if (profile.url || profile.username) {
        items.push({ icon: <LinkIcon />, text: profile.url ? stripUrl(profile.url) : profile.username })
      }
    }

    if (items.length === 0) return null

    return (
      <div style={{ marginBottom: sp(20) }}>
        <SidebarSectionTitle fontSize={fs(13)}>Contact</SidebarSectionTitle>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: sp(6),
              fontSize: fs(10),
              color: 'rgba(255,255,255,0.85)',
              fontFamily: BODY_FONT,
              lineHeight: 1.4,
              wordBreak: 'break-all',
            }}
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    )
  }

  function renderSidebarSkills() {
    if (data.skills.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <SidebarSectionTitle fontSize={fs(13)}>{label('skills')}</SidebarSectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {data.skills.map((skill, i) => (
            <span
              key={i}
              style={{
                fontSize: fs(9.5),
                color: 'rgba(255,255,255,0.9)',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '3px',
                padding: '2px 6px',
                fontFamily: BODY_FONT,
                lineHeight: 1.4,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )
  }

  function renderSidebarLanguages() {
    if (data.languages.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <SidebarSectionTitle fontSize={fs(13)}>{label('languages')}</SidebarSectionTitle>
        {data.languages.map((lang, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2px 8px',
              fontSize: fs(10.5),
              color: 'rgba(255,255,255,0.85)',
              fontFamily: BODY_FONT,
              marginBottom: sp(4),
            }}
          >
            <span style={{ fontWeight: 600 }}>{lang.language}</span>
            {lang.fluency && <span style={{ color: 'rgba(255,255,255,0.6)' }}>{lang.fluency}</span>}
          </div>
        ))}
      </div>
    )
  }

  function renderSidebarInterests() {
    if (data.interests.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <SidebarSectionTitle fontSize={fs(13)}>{label('interests')}</SidebarSectionTitle>
        {data.interests.map((interest, i) => (
          <div key={i} style={{ marginBottom: i < data.interests.length - 1 ? sp(6) : 0 }}>
            <div style={{ fontSize: fs(10.5), fontWeight: 600, color: '#fff', fontFamily: BODY_FONT }}>
              {interest.name}
            </div>
            {interest.keywords.length > 0 && (
              <div style={{ fontSize: fs(9.5), color: 'rgba(255,255,255,0.65)', marginTop: '2px', fontFamily: BODY_FONT }}>
                {interest.keywords.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderSidebarCertificates() {
    if (data.certificates.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <SidebarSectionTitle fontSize={fs(13)}>{label('certificates')}</SidebarSectionTitle>
        {data.certificates.map((cert, i) => (
          <div key={i} style={{ marginBottom: i < data.certificates.length - 1 ? sp(8) : 0 }}>
            <div style={{ fontSize: fs(10.5), fontWeight: 700, color: '#fff', fontFamily: BODY_FONT }}>
              {cert.name}
            </div>
            <div style={{ fontSize: fs(9.5), color: 'rgba(255,255,255,0.65)', fontFamily: BODY_FONT }}>
              {[cert.issuer, cert.date].filter(Boolean).join(' | ')}
            </div>
          </div>
        ))}
      </div>
    )
  }

  function renderSidebarReferences() {
    if (data.references.length === 0) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <SidebarSectionTitle fontSize={fs(13)}>{label('references')}</SidebarSectionTitle>
        {data.references.map((ref, i) => (
          <div key={i} style={{ marginBottom: i < data.references.length - 1 ? sp(8) : 0 }}>
            <div style={{ fontSize: fs(10.5), fontWeight: 700, color: '#fff', fontFamily: BODY_FONT }}>
              {ref.name}
            </div>
            {ref.reference && (
              <div className="resume-rich-text" style={{ margin: `2px 0 0 0`, fontSize: fs(9.5), lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(ref.reference) }} />
            )}
          </div>
        ))}
      </div>
    )
  }

  /* ──────────────────────────── Main section renderers ──────────────────────────── */

  function renderSummary() {
    if (!data.basics.summary) return null
    return (
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <MainSectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(15)}>
          {label('summary')}
        </MainSectionTitle>
        <div className="resume-rich-text" style={{ margin: 0, fontSize: fs(11), lineHeight: 1.6, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(data.basics.summary) }} />
      </div>
    )
  }

  function renderWork() {
    if (data.work.length === 0) return null
    return (
      <div style={{ marginBottom: sp(20) }}>
        <MainSectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(15)}>
          {label('work')}
        </MainSectionTitle>
        {data.work.map((job, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.work.length - 1 ? sp(14) : 0 }}>
            {i > 0 && (
              <div style={{ borderBottom: '1px dashed #ddd', marginBottom: sp(14) }} />
            )}
            {/* Position */}
            <div style={{ fontSize: fs(13), fontWeight: 700, color: ACCENT, lineHeight: 1.3, fontFamily: BODY_FONT }}>
              {job.position}
            </div>
            {/* Company */}
            <div style={{ fontSize: fs(11), fontWeight: 600, color: '#444', marginTop: '1px', fontFamily: BODY_FONT }}>
              {job.name}
            </div>
            {/* Date + Location */}
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
              {(job.startDate || job.endDate) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <CalendarIcon /> {job.startDate}{job.endDate ? ` - ${job.endDate}` : ' - Present'}
                </span>
              )}
              {job.location && (
                <span style={{ color: '#888' }}>{job.location}</span>
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

  function renderEducation() {
    if (data.education.length === 0) return null
    return (
      <div style={{ marginBottom: sp(20) }}>
        <MainSectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(15)}>
          {label('education')}
        </MainSectionTitle>
        {data.education.map((edu, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.education.length - 1 ? sp(12) : 0 }}>
            {/* Degree */}
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, lineHeight: 1.35, fontFamily: BODY_FONT }}>
              {[edu.studyType, edu.area].filter(Boolean).join(' in ')}
            </div>
            {/* Institution */}
            <div style={{ fontSize: fs(11), fontWeight: 600, color: '#444', marginTop: sp(2), fontFamily: BODY_FONT }}>
              {edu.institution}
            </div>
            {/* Dates + Score */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '4px 12px',
                marginTop: sp(3),
                fontSize: fs(10),
                color: '#666',
                fontFamily: BODY_FONT,
              }}
            >
              {(edu.startDate || edu.endDate) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <CalendarIcon /> {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                </span>
              )}
              {edu.score && <span>GPA: {edu.score}</span>}
            </div>
            {/* Courses */}
            {edu.courses.length > 0 && (
              <div style={{ marginTop: sp(3), fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>
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
      <div style={{ marginBottom: sp(20) }}>
        <MainSectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(15)}>
          {label('projects')}
        </MainSectionTitle>
        {data.projects.map((project, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(12) : 0 }}>
            {i > 0 && (
              <div style={{ borderBottom: '1px dashed #ddd', marginBottom: sp(12) }} />
            )}
            {/* Name */}
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, lineHeight: 1.3, fontFamily: BODY_FONT }}>
              {project.name}
            </div>
            {/* Description */}
            {project.description && (
              <div className="resume-rich-text" style={{ margin: `${sp(3)} 0 0 0`, fontSize: fs(11), lineHeight: 1.5, color: BODY, fontFamily: BODY_FONT }} dangerouslySetInnerHTML={{ __html: safeHtml(project.description) }} />
            )}
            {/* Keywords */}
            {project.keywords.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: sp(4) }}>
                {project.keywords.map((kw, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: fs(9),
                      color: ACCENT,
                      fontWeight: 600,
                      backgroundColor: hexToRgba(ACCENT, 0.08),
                      borderRadius: '3px',
                      padding: '1px 6px',
                      fontFamily: BODY_FONT,
                    }}
                  >
                    {kw}
                  </span>
                ))}
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
      <div style={{ marginBottom: sp(20) }}>
        <MainSectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(15)}>
          {label('volunteer')}
        </MainSectionTitle>
        {data.volunteer.map((vol, i) => (
          <div key={i} data-break-avoid style={{ marginBottom: i < data.volunteer.length - 1 ? sp(12) : 0 }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, lineHeight: 1.3, fontFamily: BODY_FONT }}>
              {vol.position}
            </div>
            <div style={{ fontSize: fs(11), fontWeight: 600, color: '#444', marginTop: '1px', fontFamily: BODY_FONT }}>
              {vol.organization}
            </div>
            {(vol.startDate || vol.endDate) && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: sp(3), fontSize: fs(10), color: '#666', fontFamily: BODY_FONT }}>
                <CalendarIcon /> {vol.startDate}{vol.endDate ? ` - ${vol.endDate}` : ' - Present'}
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
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <MainSectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(15)}>
          {label('awards')}
        </MainSectionTitle>
        {data.awards.map((award, i) => (
          <div key={i} style={{ marginBottom: i < data.awards.length - 1 ? sp(8) : 0 }}>
            <div style={{ fontSize: fs(12), fontWeight: 700, color: ACCENT, fontFamily: BODY_FONT }}>
              {award.title}
            </div>
            <div style={{ fontSize: fs(10), color: META, fontFamily: BODY_FONT }}>
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
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <MainSectionTitle accentColor={ACCENT} headingFont={theme.headingFont} fontSize={fs(15)}>
          {label('publications')}
        </MainSectionTitle>
        {data.publications.map((pub, i) => (
          <div key={i} style={{ marginBottom: i < data.publications.length - 1 ? sp(8) : 0 }}>
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
      {/* ── Full-width header ── */}
      <div
        data-break-avoid
        style={{
          marginBottom: sp(20),
          paddingBottom: sp(16),
          borderBottom: `3px solid ${ACCENT}`,
        }}
      >
        <h1
          style={{
            fontFamily: HEADING_FONT,
            fontSize: fs(30),
            fontWeight: 700,
            color: ACCENT,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {data.basics.name}
        </h1>
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
      </div>

      {/* ── Two-column layout: sidebar + main ── */}
      <div style={{ display: 'flex', gap: '0' }}>
        {/* Left sidebar - ~35% */}
        <div
          style={{
            flex: '0 0 35%',
            minWidth: 0,
            backgroundColor: SIDEBAR_BG,
            color: '#fff',
            padding: sp(16),
            borderRadius: '4px 0 0 4px',
            fontFamily: BODY_FONT,
          }}
        >
          {/* Contact always shown in sidebar */}
          {renderSidebarContact()}

          {/* Sidebar sections from sectionOrder */}
          {sidebarSections.map((id) => (
            <div key={id}>{renderSidebarSection(id)}</div>
          ))}
        </div>

        {/* Main content - ~65% */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            paddingLeft: sp(20),
          }}
        >
          {mainSections.map((id) => (
            <div key={id}>{renderMainSection(id)}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
