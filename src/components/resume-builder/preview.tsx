'use client'

import { useFormContext } from 'react-hook-form'
import type { ResumeData } from './types'

/* ── fonts ── */
const DISPLAY = 'var(--font-bitter), Georgia, serif'

/* ── colour tokens ── */
const ACCENT = '#1a1a1a'
const HEADING = '#1a1a1a'
const BODY = '#333'
const MUTED = '#555'
const LIGHT = '#888'
const RULE = '#ddd'
const BADGE_BORDER = '#444'
const ICON = '#555'

/* ── icons ── */
function PhoneIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function AtSignIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function PinIcon({ color = ICON }: { color?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
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

/* ── two-part section heading: thick accent bar + thin rule ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: HEADING,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {children}
      </h2>
      <div style={{ width: '100%', height: '3px', backgroundColor: ACCENT, marginTop: '2px' }} />
    </div>
  )
}

function stripUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '')
}

type PreviewProps = {
  fontSizeOffset?: number
  spacingScale?: number
}

export function ResumePreview({ fontSizeOffset = 0, spacingScale = 1.0 }: PreviewProps) {
  const { watch } = useFormContext<ResumeData>()
  const data = watch()

  /** Apply font-size offset (px) */
  const fs = (base: number) => `${base + fontSizeOffset}px`
  /** Apply spacing scale (px) */
  const sp = (base: number) => `${base * spacingScale}px`

  const contactItems: { icon: React.ReactNode; text: string }[] = []
  if (data.phone) contactItems.push({ icon: <PhoneIcon />, text: data.phone })
  if (data.email) contactItems.push({ icon: <AtSignIcon />, text: data.email })
  if (data.linkedin) contactItems.push({ icon: <LinkIcon />, text: stripUrl(data.linkedin) })
  if (data.github) contactItems.push({ icon: <LinkIcon />, text: stripUrl(data.github) })

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#fff',
        fontFamily: 'inherit',
        color: BODY,
        fontSize: fs(11.5),
        lineHeight: 1.5,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* ── Header ── */}
      <div data-break-avoid style={{ marginBottom: sp(20) }}>
        <h1
          style={{
            fontFamily: DISPLAY,
            fontSize: fs(30),
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: HEADING,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {data.name}
        </h1>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: fs(14),
            fontWeight: 700,
            color: ACCENT,
            marginTop: sp(2),
          }}
        >
          {data.title}
        </div>

        {/* Contact row — spread across full width */}
        {contactItems.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: contactItems.length > 1 ? 'space-between' : 'flex-start',
              marginTop: sp(10),
              fontSize: fs(11),
              fontWeight: 600,
              color: '#444',
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
        {data.location && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: sp(4),
              fontSize: fs(11),
              fontWeight: 600,
              color: '#444',
            }}
          >
            <PinIcon /> {data.location}
          </div>
        )}
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'flex', gap: sp(30) }}>
        {/* Left column — 58% */}
        <div style={{ flex: '0 0 58%', minWidth: 0 }}>
          {/* Summary */}
          {data.summary && (
            <div data-break-avoid style={{ marginBottom: sp(20) }}>
              <SectionTitle>Summary</SectionTitle>
              <p style={{ margin: 0, fontSize: fs(11.5), lineHeight: 1.6, color: BODY }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <SectionTitle>Experience</SectionTitle>
              {data.experience.map((exp, i) => (
                <div key={i} data-break-avoid>
                  {i > 0 && (
                    <div style={{ borderBottom: '1px dashed #ccc', margin: `${sp(12)} 0` }} />
                  )}
                  <div style={{ marginBottom: sp(4) }}>
                    <div
                      style={{
                        fontSize: fs(14),
                        fontWeight: 700,
                        color: HEADING,
                        lineHeight: 1.3,
                      }}
                    >
                      {exp.role}
                    </div>
                    <div
                      style={{
                        fontSize: fs(11.5),
                        fontWeight: 600,
                        color: '#444',
                        marginTop: '1px',
                      }}
                    >
                      {exp.company}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginTop: sp(4),
                        fontSize: fs(10),
                        color: '#666',
                      }}
                    >
                      {(exp.startDate || exp.endDate) && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <CalendarIcon /> {exp.startDate} - {exp.endDate}
                        </span>
                      )}
                      {exp.location && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <PinIcon /> {exp.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul
                      style={{
                        margin: `${sp(6)} 0 0 0`,
                        paddingLeft: '14px',
                        listStyleType: 'disc',
                      }}
                    >
                      {exp.bullets
                        .filter((b) => b.trim())
                        .map((bullet, j) => (
                          <li
                            key={j}
                            style={{
                              fontSize: fs(11),
                              lineHeight: 1.55,
                              color: BODY,
                              marginBottom: sp(2),
                            }}
                          >
                            {bullet}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column — 42% */}
        <div style={{ flex: '0 0 calc(42% - 30px)', minWidth: 0 }}>
          {/* Skills */}
          {data.skills.length > 0 && (
            <div data-break-avoid style={{ marginBottom: sp(24) }}>
              <SectionTitle>Skills</SectionTitle>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: sp(7),
                }}
              >
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
                      color: HEADING,
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div style={{ marginBottom: sp(24) }}>
              <SectionTitle>Education</SectionTitle>
              {data.education.map((edu, i) => (
                <div key={i} data-break-avoid style={{ marginBottom: i < data.education.length - 1 ? sp(12) : 0 }}>
                  <div
                    style={{
                      fontSize: fs(13),
                      fontWeight: 700,
                      color: HEADING,
                      lineHeight: 1.35,
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      fontSize: fs(11.5),
                      fontWeight: 600,
                      color: '#444',
                      marginTop: sp(2),
                    }}
                  >
                    {edu.school}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginTop: sp(4),
                      fontSize: fs(10),
                      color: '#666',
                    }}
                  >
                    {(edu.startDate || edu.endDate) && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CalendarIcon /> {edu.startDate} - {edu.endDate}
                      </span>
                    )}
                    {edu.location && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <PinIcon /> {edu.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div style={{ marginBottom: sp(24) }}>
              <SectionTitle>Projects</SectionTitle>
              {data.projects.map((project, i) => (
                <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(10) : 0 }}>
                  {i > 0 && (
                    <div style={{ borderBottom: '1px dashed #ccc', marginBottom: sp(10) }} />
                  )}
                  <div
                    style={{
                      fontSize: fs(12),
                      fontWeight: 700,
                      color: HEADING,
                      lineHeight: 1.3,
                    }}
                  >
                    {project.name}
                  </div>
                  <p
                    style={{
                      margin: `${sp(3)} 0 0 0`,
                      fontSize: fs(11),
                      lineHeight: 1.5,
                      color: BODY,
                    }}
                  >
                    {project.description}
                  </p>
                  {project.techStack.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        marginTop: sp(4),
                      }}
                    >
                      {project.techStack.map((tech, j) => (
                        <span
                          key={j}
                          style={{
                            fontSize: fs(9),
                            color: MUTED,
                            fontWeight: 600,
                            backgroundColor: '#f5f5f5',
                            borderRadius: '2px',
                            padding: '1px 5px',
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
          )}

          {/* Strengths */}
          {data.strengths.length > 0 && (
            <div data-break-avoid>
              <SectionTitle>Strengths</SectionTitle>
              {data.strengths.map((strength, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div style={{ borderBottom: '1px dashed #ddd', margin: `${sp(6)} 0` }} />
                  )}
                  <div
                    style={{
                      fontSize: fs(11.5),
                      fontWeight: 700,
                      color: HEADING,
                      lineHeight: 1.4,
                    }}
                  >
                    {strength}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
