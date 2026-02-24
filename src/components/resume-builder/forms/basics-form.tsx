'use client'

import { useCallback } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from './rich-text-editor'
import type { ResumeBasics, ResumeProfile, ResumeLocation } from '../types/resume'

/* ── Country-specific field configuration ── */
// Countries that commonly expect photo/DOB/gender/marital status
const PHOTO_COUNTRIES = new Set(['DE', 'AT', 'CH', 'JP', 'KR', 'CN', 'TW', 'TH', 'IN', 'BD', 'PK', 'TR', 'BR', 'MX', 'FR', 'ES', 'IT', 'PT', 'RU', 'SA', 'AE', 'EG'])
const DOB_COUNTRIES = new Set(['DE', 'AT', 'CH', 'JP', 'KR', 'CN', 'TW', 'TH', 'IN', 'BD', 'PK', 'TR', 'BR', 'MX', 'RU', 'SA', 'AE', 'EG', 'ID', 'MY', 'PH', 'VN'])
const GENDER_COUNTRIES = new Set(['JP', 'KR', 'CN', 'TW', 'TH', 'IN', 'BD', 'PK', 'SA', 'AE', 'EG', 'ID', 'MY', 'PH', 'VN'])
const MARITAL_COUNTRIES = new Set(['DE', 'AT', 'IN', 'BD', 'PK', 'TR', 'SA', 'AE', 'EG', 'JP', 'CN'])
const NATIONALITY_COUNTRIES = new Set(['DE', 'AT', 'CH', 'JP', 'KR', 'CN', 'IN', 'BD', 'PK', 'TR', 'SA', 'AE', 'EG', 'BR', 'MX', 'RU'])
const FATHERS_NAME_COUNTRIES = new Set(['IN', 'BD', 'PK', 'SA', 'AE', 'EG'])
const NATIONAL_ID_COUNTRIES = new Set(['IN', 'BD', 'PK', 'SA', 'AE', 'EG', 'TR', 'BR', 'MX', 'MY', 'ID', 'TH', 'KR'])
const VISA_COUNTRIES = new Set(['US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'SG', 'AE', 'SA', 'JP'])
const MILITARY_COUNTRIES = new Set(['KR', 'TR', 'SG', 'IL', 'GR', 'TH'])
const RELIGION_COUNTRIES = new Set(['SA', 'AE', 'EG', 'BD', 'PK', 'MY', 'ID'])
const BLOOD_TYPE_COUNTRIES = new Set(['JP', 'KR', 'TH', 'ID'])

/* ── Compact field row ── */
function FieldRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className}`}>{children}</div>
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

/* ── BasicsForm ── */
export type BasicsFormProps = {
  data: ResumeBasics
  onChange: (data: ResumeBasics) => void
  countryCode: string
}

export function BasicsForm({ data, onChange, countryCode }: BasicsFormProps) {
  const cc = countryCode?.toUpperCase() || 'US'

  const update = useCallback(
    (partial: Partial<ResumeBasics>) => {
      onChange({ ...data, ...partial })
    },
    [data, onChange],
  )

  const updateLocation = useCallback(
    (partial: Partial<ResumeLocation>) => {
      onChange({ ...data, location: { ...data.location, ...partial } })
    },
    [data, onChange],
  )

  const updateProfile = useCallback(
    (index: number, partial: Partial<ResumeProfile>) => {
      const profiles = [...data.profiles]
      profiles[index] = { ...profiles[index], ...partial }
      onChange({ ...data, profiles })
    },
    [data, onChange],
  )

  const addProfile = useCallback(() => {
    onChange({
      ...data,
      profiles: [...data.profiles, { network: '', username: '', url: '' }],
    })
  }, [data, onChange])

  const removeProfile = useCallback(
    (index: number) => {
      const profiles = data.profiles.filter((_, i) => i !== index)
      onChange({ ...data, profiles })
    },
    [data, onChange],
  )

  return (
    <div className="space-y-3">
      {/* Name */}
      <FieldRow>
        <Label className="text-xs text-muted-foreground">Full Name</Label>
        <Input
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="John Doe"
          className="h-8 text-sm"
        />
      </FieldRow>

      {/* Label (job title) */}
      <FieldRow>
        <Label className="text-xs text-muted-foreground">Job Title</Label>
        <Input
          value={data.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Full Stack Developer"
          className="h-8 text-sm"
        />
      </FieldRow>

      {/* Email + Phone */}
      <FieldGrid>
        <FieldRow>
          <Label className="text-xs text-muted-foreground">Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="john@example.com"
            className="h-8 text-sm"
          />
        </FieldRow>
        <FieldRow>
          <Label className="text-xs text-muted-foreground">Phone</Label>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="h-8 text-sm"
          />
        </FieldRow>
      </FieldGrid>

      {/* URL */}
      <FieldRow>
        <Label className="text-xs text-muted-foreground">Website</Label>
        <Input
          type="url"
          value={data.url}
          onChange={(e) => update({ url: e.target.value })}
          placeholder="https://yoursite.com"
          className="h-8 text-sm"
        />
      </FieldRow>

      {/* Summary */}
      <FieldRow>
        <Label className="text-xs text-muted-foreground">Summary</Label>
        <RichTextEditor
          value={data.summary}
          onChange={(html) => update({ summary: html })}
          placeholder="Brief professional summary..."
        />
      </FieldRow>

      {/* Location */}
      <div className="pt-1">
        <Label className="text-xs text-muted-foreground font-medium mb-2 block">Location</Label>
        <div className="space-y-2">
          <FieldGrid>
            <FieldRow>
              <Label className="text-xs text-muted-foreground">City</Label>
              <Input
                value={data.location.city}
                onChange={(e) => updateLocation({ city: e.target.value })}
                placeholder="San Francisco"
                className="h-8 text-sm"
              />
            </FieldRow>
            <FieldRow>
              <Label className="text-xs text-muted-foreground">State / Region</Label>
              <Input
                value={data.location.region}
                onChange={(e) => updateLocation({ region: e.target.value })}
                placeholder="CA"
                className="h-8 text-sm"
              />
            </FieldRow>
          </FieldGrid>
          <FieldGrid>
            <FieldRow>
              <Label className="text-xs text-muted-foreground">Country Code</Label>
              <Input
                value={data.location.countryCode}
                onChange={(e) => updateLocation({ countryCode: e.target.value.toUpperCase() })}
                placeholder="US"
                maxLength={2}
                className="h-8 text-sm"
              />
            </FieldRow>
            <FieldRow>
              <Label className="text-xs text-muted-foreground">Postal Code</Label>
              <Input
                value={data.location.postalCode}
                onChange={(e) => updateLocation({ postalCode: e.target.value })}
                placeholder="94102"
                className="h-8 text-sm"
              />
            </FieldRow>
          </FieldGrid>
          <FieldRow>
            <Label className="text-xs text-muted-foreground">Address</Label>
            <Input
              value={data.location.address}
              onChange={(e) => updateLocation({ address: e.target.value })}
              placeholder="123 Main St"
              className="h-8 text-sm"
            />
          </FieldRow>
        </div>
      </div>

      {/* Country-specific fields */}
      {(PHOTO_COUNTRIES.has(cc) || DOB_COUNTRIES.has(cc) || GENDER_COUNTRIES.has(cc) ||
        MARITAL_COUNTRIES.has(cc) || NATIONALITY_COUNTRIES.has(cc) || FATHERS_NAME_COUNTRIES.has(cc) ||
        NATIONAL_ID_COUNTRIES.has(cc) || VISA_COUNTRIES.has(cc) || MILITARY_COUNTRIES.has(cc) ||
        RELIGION_COUNTRIES.has(cc) || BLOOD_TYPE_COUNTRIES.has(cc)) && (
        <div className="pt-2">
          <Label className="text-xs text-muted-foreground font-medium mb-2 block">
            Country-Specific Fields
          </Label>
          <p className="text-[11px] text-muted-foreground/70 mb-2">
            Common for resumes in {cc}. Leave blank if not needed.
          </p>
          <div className="space-y-2">
            {PHOTO_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Photo URL</Label>
                <Input
                  type="url"
                  value={data.photo || ''}
                  onChange={(e) => update({ photo: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
            {DOB_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                <Input
                  type="date"
                  value={data.dateOfBirth || ''}
                  onChange={(e) => update({ dateOfBirth: e.target.value })}
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
            <FieldGrid>
              {GENDER_COUNTRIES.has(cc) && (
                <FieldRow>
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <Input
                    value={data.gender || ''}
                    onChange={(e) => update({ gender: e.target.value })}
                    placeholder="Male / Female / Other"
                    className="h-8 text-sm"
                  />
                </FieldRow>
              )}
              {MARITAL_COUNTRIES.has(cc) && (
                <FieldRow>
                  <Label className="text-xs text-muted-foreground">Marital Status</Label>
                  <Input
                    value={data.maritalStatus || ''}
                    onChange={(e) => update({ maritalStatus: e.target.value })}
                    placeholder="Single / Married"
                    className="h-8 text-sm"
                  />
                </FieldRow>
              )}
            </FieldGrid>
            {NATIONALITY_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Nationality</Label>
                <Input
                  value={data.nationality || ''}
                  onChange={(e) => update({ nationality: e.target.value })}
                  placeholder="Indian, German, etc."
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
            {FATHERS_NAME_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Father&apos;s Name</Label>
                <Input
                  value={data.fathersName || ''}
                  onChange={(e) => update({ fathersName: e.target.value })}
                  placeholder="Father's full name"
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
            {NATIONAL_ID_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">National ID</Label>
                <Input
                  value={data.nationalId || ''}
                  onChange={(e) => update({ nationalId: e.target.value })}
                  placeholder="National ID number"
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
            {VISA_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Visa Status</Label>
                <Input
                  value={data.visaStatus || ''}
                  onChange={(e) => update({ visaStatus: e.target.value })}
                  placeholder="Citizen / H-1B / Work Permit"
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
            {MILITARY_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Military Service</Label>
                <Input
                  value={data.militaryService || ''}
                  onChange={(e) => update({ militaryService: e.target.value })}
                  placeholder="Completed / Exempt / N/A"
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
            {RELIGION_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Religion</Label>
                <Input
                  value={data.religion || ''}
                  onChange={(e) => update({ religion: e.target.value })}
                  placeholder="Religion"
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
            {BLOOD_TYPE_COUNTRIES.has(cc) && (
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Blood Type</Label>
                <Input
                  value={data.bloodType || ''}
                  onChange={(e) => update({ bloodType: e.target.value })}
                  placeholder="A / B / O / AB"
                  className="h-8 text-sm"
                />
              </FieldRow>
            )}
          </div>
        </div>
      )}

      {/* Profiles */}
      <div className="pt-2">
        <Label className="text-xs text-muted-foreground font-medium mb-2 block">Profiles</Label>
        <div className="space-y-3">
          {data.profiles.map((profile, index) => (
            <div key={index} className="relative rounded-md border border-border p-3 space-y-2">
              <button
                type="button"
                onClick={() => removeProfile(index)}
                className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Remove profile"
              >
                <Trash2 className="size-3.5" />
              </button>
              <FieldRow>
                <Label className="text-xs text-muted-foreground">Network</Label>
                <Input
                  value={profile.network}
                  onChange={(e) => updateProfile(index, { network: e.target.value })}
                  placeholder="LinkedIn, GitHub, Twitter..."
                  className="h-8 text-sm"
                />
              </FieldRow>
              <FieldGrid>
                <FieldRow>
                  <Label className="text-xs text-muted-foreground">Username</Label>
                  <Input
                    value={profile.username}
                    onChange={(e) => updateProfile(index, { username: e.target.value })}
                    placeholder="johndoe"
                    className="h-8 text-sm"
                  />
                </FieldRow>
                <FieldRow>
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <Input
                    type="url"
                    value={profile.url}
                    onChange={(e) => updateProfile(index, { url: e.target.value })}
                    placeholder="https://..."
                    className="h-8 text-sm"
                  />
                </FieldRow>
              </FieldGrid>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProfile}
            className="w-full h-8 text-xs"
          >
            <Plus className="size-3.5 mr-1" />
            Add Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
