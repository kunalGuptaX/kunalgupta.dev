'use client'

import { useFormContext } from 'react-hook-form'
import type { ResumeData } from './types'

const HEADING = '#1a1a1a'
const BODY = '#333'
const META = '#555'
const ICON = '#555'

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

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <h2
        style={{
          fontSize: '17px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: HEADING,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {children}
      </h2>
      <div style={{ width: '100%', height: '2px', backgroundColor: HEADING, marginTop: '4px' }} />
    </div>
  )
}

type PreviewProps = {
  fontSizeOffset?: number
  spacingScale?: number
}

export function ResumePreviewMinimal({ fontSizeOffset = 0, spacingScale = 1.0 }: PreviewProps) {
  const { watch } = useFormContext<ResumeData>()
  const data = watch()

  const fs = (base: number) => `${base + fontSizeOffset}px`
  const sp = (base: number) => `${base * spacingScale}px`

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#fff',
        fontFamily: 'inherit',
        color: BODY,
        fontSize: fs(12),
        lineHeight: 1.6,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* ── Header — centered ── */}
      <div data-break-avoid style={{ textAlign: 'center', marginBottom: sp(24) }}>
        <h1
          style={{
            fontSize: fs(32),
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: HEADING,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {data.name}
        </h1>
        <div
          style={{
            fontSize: fs(15),
            fontWeight: 400,
            color: META,
            marginTop: sp(4),
          }}
        >
          {data.title}
        </div>

        {/* Contact row — centered */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: sp(24),
            marginTop: sp(12),
            fontSize: fs(11),
            color: META,
          }}
        >
          {data.phone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <PhoneIcon /> {data.phone}
            </span>
          )}
          {data.email && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <AtSignIcon /> {data.email}
            </span>
          )}
          {data.location && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <PinIcon /> {data.location}
            </span>
          )}
        </div>

      </div>

      {/* ── About Me / Summary ── */}
      {data.summary && (
        <div data-break-avoid style={{ marginBottom: sp(22) }}>
          <SectionTitle>About Me</SectionTitle>
          <p style={{ margin: 0, fontSize: fs(12), lineHeight: 1.65, color: BODY }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* ── Education ── */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: sp(22) }}>
          <SectionTitle>Education</SectionTitle>
          {data.education.map((edu, i) => (
            <div key={i} data-break-avoid style={{ marginBottom: i < data.education.length - 1 ? sp(14) : 0 }}>
              <div style={{ fontSize: fs(11), color: META }}>
                {edu.school}
                {(edu.startDate || edu.endDate) && (
                  <span> | {edu.startDate} - {edu.endDate}</span>
                )}
              </div>
              <div
                style={{
                  fontSize: fs(13),
                  fontWeight: 700,
                  color: HEADING,
                  marginTop: sp(2),
                }}
              >
                {edu.degree}
              </div>
              {edu.location && (
                <div style={{ fontSize: fs(10), color: META, marginTop: '1px' }}>
                  {edu.location}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Work Experience ── */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: sp(22) }}>
          <SectionTitle>Work Experience</SectionTitle>
          {data.experience.map((exp, i) => (
            <div key={i} data-break-avoid style={{ marginBottom: i < data.experience.length - 1 ? sp(14) : 0 }}>
              <div style={{ fontSize: fs(11), color: META }}>
                {exp.company}
                {(exp.startDate || exp.endDate) && (
                  <span> | {exp.startDate} - {exp.endDate}</span>
                )}
              </div>
              <div
                style={{
                  fontSize: fs(13),
                  fontWeight: 700,
                  color: HEADING,
                  marginTop: sp(2),
                }}
              >
                {exp.role}
              </div>
              {exp.bullets.length > 0 && (
                <p style={{ margin: `${sp(4)} 0 0 0`, fontSize: fs(12), lineHeight: 1.6, color: BODY }}>
                  {exp.bullets.filter((b) => b.trim()).join('. ')}
                  {exp.bullets.filter((b) => b.trim()).length > 0 && '.'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Projects ── */}
      {data.projects.length > 0 && (
        <div style={{ marginBottom: sp(22) }}>
          <SectionTitle>Projects</SectionTitle>
          {data.projects.map((project, i) => (
            <div key={i} data-break-avoid style={{ marginBottom: i < data.projects.length - 1 ? sp(14) : 0 }}>
              <div
                style={{
                  fontSize: fs(13),
                  fontWeight: 700,
                  color: HEADING,
                }}
              >
                {project.name}
              </div>
              <p style={{ margin: `${sp(2)} 0 0 0`, fontSize: fs(12), lineHeight: 1.6, color: BODY }}>
                {project.description}
              </p>
              {project.techStack.length > 0 && (
                <div style={{ fontSize: fs(11), color: META, marginTop: sp(2) }}>
                  {project.techStack.join(' / ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Skills — 3-column bullet grid ── */}
      {data.skills.length > 0 && (
        <div data-break-avoid style={{ marginBottom: sp(22) }}>
          <SectionTitle>Skills</SectionTitle>
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
                }}
              >
                <span style={{ color: HEADING, fontSize: '6px' }}>&#9679;</span>
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Strengths — 3-column bullet grid ── */}
      {data.strengths.length > 0 && (
        <div data-break-avoid>
          <SectionTitle>Strengths</SectionTitle>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: `${sp(4)} ${sp(16)}`,
            }}
          >
            {data.strengths.map((strength, i) => (
              <div
                key={i}
                style={{
                  fontSize: fs(12),
                  color: BODY,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: HEADING, fontSize: '6px' }}>&#9679;</span>
                {strength}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
