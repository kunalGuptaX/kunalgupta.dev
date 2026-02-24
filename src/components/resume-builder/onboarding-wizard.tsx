'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { ArrowLeft, FileUp, FilePlus2 } from 'lucide-react'
import { templateRegistry, getRecommendedTemplates } from './templates/registry'
import { getJobCategory } from './config/job-categories'
import { getSeniorityLevel } from './config/seniority-levels'
import { countryList } from './config/countries'
import { jobCategoryList } from './config/job-categories'
import { seniorityLevelList } from './config/seniority-levels'
import { importJsonResume } from './import/json-resume-import'
import { TemplateThumbnail } from './template-thumbnail'
import type { ResumeDataV2 } from './types/resume'
import { Button } from '@/components/ui/button'

// ── Types ──

type OnboardingWizardProps = {
  open: boolean
  onClose: () => void
  onComplete: (settings: {
    countryCode: string
    jobCategory: string
    seniority: string
    templateId: string
    importedData?: ResumeDataV2
  }) => void
}

type Step = 'country' | 'category' | 'seniority' | 'template' | 'import'

const STEPS: Step[] = ['country', 'category', 'seniority', 'template', 'import']

const STEP_LABELS: Record<Step, string> = {
  country: 'Country',
  category: 'Industry',
  seniority: 'Level',
  template: 'Template',
  import: 'Get Started',
}

// ── Job category icon map ──

const categoryIcons: Record<string, string> = {
  Monitor: '\u{1F4BB}',
  GraduationCap: '\u{1F393}',
  Stethoscope: '\u{1FA7A}',
  Palette: '\u{1F3A8}',
  Scale: '\u{2696}\u{FE0F}',
  TrendingUp: '\u{1F4C8}',
  Landmark: '\u{1F3DB}\u{FE0F}',
  Briefcase: '\u{1F4BC}',
  Megaphone: '\u{1F4E3}',
  Handshake: '\u{1F91D}',
  Users: '\u{1F465}',
  Lightbulb: '\u{1F4A1}',
  Wrench: '\u{1F527}',
  BookOpen: '\u{1F4D6}',
  Heart: '\u{2764}\u{FE0F}',
  BarChart: '\u{1F4CA}',
  Layers: '\u{1F5C2}\u{FE0F}',
  Settings: '\u{2699}\u{FE0F}',
}

// ── Component ──

export function OnboardingWizard({ open, onClose, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<Step>('country')
  const [countryCode, setCountryCode] = useState('')
  const [customCountry, setCustomCountry] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [jobCategory, setJobCategory] = useState('')
  const [seniority, setSeniority] = useState('')
  const [templateId, setTemplateId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentStepIndex = STEPS.indexOf(step)

  const goBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex]!)
    }
  }, [currentStepIndex])

  const goNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex]!)
    }
  }, [currentStepIndex])

  const handleCountrySelect = (code: string) => {
    setCountryCode(code)
    setShowCustomInput(false)
    goNext()
  }

  const handleCustomCountrySelect = () => {
    setShowCustomInput(true)
  }

  const handleCustomCountrySubmit = () => {
    const code = customCountry.trim().toUpperCase()
    if (code.length >= 2) {
      setCountryCode(code)
      setShowCustomInput(false)
      goNext()
    }
  }

  const handleCategorySelect = (id: string) => {
    setJobCategory(id)
    goNext()
  }

  const handleSenioritySelect = (id: string) => {
    setSeniority(id)
    goNext()
  }

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id)
    goNext()
  }

  const handleStartFresh = () => {
    onComplete({
      countryCode: countryCode || 'US',
      jobCategory: jobCategory || 'general',
      seniority: seniority || 'mid',
      templateId: templateId || 'classic',
    })
  }

  const handleSkipToBuilder = () => {
    onComplete({
      countryCode: 'US',
      jobCategory: 'general',
      seniority: 'mid',
      templateId: 'classic',
    })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        const importedData = importJsonResume(json)
        onComplete({
          countryCode: countryCode || 'US',
          jobCategory: jobCategory || 'general',
          seniority: seniority || 'mid',
          templateId: templateId || 'classic',
          importedData,
        })
      } catch {
        alert('Could not parse JSON Resume file. Please check the format and try again.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            {currentStepIndex > 0 && (
              <button
                onClick={goBack}
                className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-zinc-100">
              New Resume
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSkipToBuilder}
              className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm underline underline-offset-2"
            >
              Skip to builder
            </button>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-zinc-800/50">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`size-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    i < currentStepIndex
                      ? 'bg-zinc-600 text-zinc-200'
                      : i === currentStepIndex
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs transition-colors hidden sm:inline ${
                    i === currentStepIndex ? 'text-zinc-200' : 'text-zinc-500'
                  }`}
                >
                  {STEP_LABELS[s]}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-4 h-px transition-colors ${
                    i < currentStepIndex ? 'bg-zinc-600' : 'bg-zinc-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 'country' && (
            <CountryStep
              onSelect={handleCountrySelect}
              onCustom={handleCustomCountrySelect}
              showCustomInput={showCustomInput}
              customCountry={customCountry}
              onCustomChange={setCustomCountry}
              onCustomSubmit={handleCustomCountrySubmit}
            />
          )}
          {step === 'category' && (
            <CategoryStep onSelect={handleCategorySelect} />
          )}
          {step === 'seniority' && (
            <SeniorityStep onSelect={handleSenioritySelect} />
          )}
          {step === 'template' && (
            <TemplateStep
              onSelect={handleTemplateSelect}
              categoryId={jobCategory}
              seniorityId={seniority}
            />
          )}
          {step === 'import' && (
            <ImportStep
              onStartFresh={handleStartFresh}
              onImport={handleImportClick}
            />
          )}
        </div>
      </div>

      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

// ── Step: Country ──

function CountryStep({
  onSelect,
  onCustom,
  showCustomInput,
  customCountry,
  onCustomChange,
  onCustomSubmit,
}: {
  onSelect: (code: string) => void
  onCustom: () => void
  showCustomInput: boolean
  customCountry: string
  onCustomChange: (value: string) => void
  onCustomSubmit: () => void
}) {
  return (
    <div>
      <p className="text-sm text-zinc-400 mb-4">
        Select your country to customize resume fields and formatting conventions.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {countryList.map((country) => (
          <button
            key={country.code}
            onClick={() => onSelect(country.code)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-600 transition-colors text-left"
          >
            <span className="text-2xl" role="img" aria-label={country.name}>
              {country.flag}
            </span>
            <div>
              <div className="text-sm font-medium text-zinc-200">{country.name}</div>
              <div className="text-xs text-zinc-500">{country.code}</div>
            </div>
          </button>
        ))}
        {/* "Other" option */}
        <button
          onClick={onCustom}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-600 transition-colors text-left"
        >
          <span className="text-2xl" role="img" aria-label="Other">
            {'\u{1F310}'}
          </span>
          <div>
            <div className="text-sm font-medium text-zinc-200">Other</div>
            <div className="text-xs text-zinc-500">Custom</div>
          </div>
        </button>
      </div>
      {showCustomInput && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={customCountry}
            onChange={(e) => onCustomChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onCustomSubmit()
            }}
            placeholder="Country code (e.g. BR, KR, NG)"
            maxLength={3}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-500"
            autoFocus
          />
          <Button
            size="sm"
            onClick={onCustomSubmit}
            disabled={customCountry.trim().length < 2}
            className="h-9"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Step: Job Category ──

function CategoryStep({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <p className="text-sm text-zinc-400 mb-4">
        Choose your industry to optimize section ordering and labels.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {jobCategoryList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-lg border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-600 transition-colors text-left"
          >
            <span className="text-xl" role="img" aria-label={cat.label}>
              {categoryIcons[cat.icon] ?? '\u{1F4BC}'}
            </span>
            <span className="text-sm font-medium text-zinc-200">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step: Seniority Level ──

function SeniorityStep({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <p className="text-sm text-zinc-400 mb-4">
        Select your experience level to adjust resume structure and emphasis.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {seniorityLevelList.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className="flex items-start gap-4 px-5 py-4 rounded-lg border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-600 transition-colors text-left"
          >
            <span className="text-2xl mt-0.5" role="img" aria-label={level.label}>
              {level.icon}
            </span>
            <div>
              <div className="text-sm font-semibold text-zinc-200">{level.label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{level.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step: Template ──

function TemplateStep({
  onSelect,
  categoryId,
  seniorityId,
}: {
  onSelect: (id: string) => void
  categoryId: string
  seniorityId: string
}) {
  const sortedTemplates = useMemo(() => {
    const category = categoryId ? getJobCategory(categoryId) : undefined
    const seniorityLevel = seniorityId ? getSeniorityLevel(seniorityId) : undefined

    return getRecommendedTemplates({
      categoryId: categoryId || undefined,
      seniorityId: seniorityId || undefined,
      categoryTags: category?.recommendedTemplateTags ?? [],
      seniorityTags: seniorityLevel?.recommendedTemplateTags ?? [],
    })
  }, [categoryId, seniorityId])

  // Split into recommended and others
  const recommendedCount = Math.min(6, Math.ceil(sortedTemplates.length / 2))
  const recommended = sortedTemplates.slice(0, recommendedCount)
  const others = sortedTemplates.slice(recommendedCount)

  return (
    <div>
      <p className="text-sm text-zinc-400 mb-4">
        Pick a template. Recommended ones are shown first based on your selections. You can change this anytime.
      </p>

      {/* Recommended section */}
      {recommended.length > 0 && (
        <>
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">
            Recommended for you
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {recommended.map((tmpl) => (
              <WizardTemplateCard
                key={tmpl.id}
                tmpl={tmpl}
                onSelect={onSelect}
                recommended
              />
            ))}
          </div>
        </>
      )}

      {/* All others */}
      {others.length > 0 && (
        <>
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">
            All templates
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {others.map((tmpl) => (
              <WizardTemplateCard
                key={tmpl.id}
                tmpl={tmpl}
                onSelect={onSelect}
              />
            ))}
          </div>
        </>
      )}

      {/* Show total count */}
      <div className="mt-4 text-center text-xs text-zinc-600">
        {templateRegistry.length} templates available
      </div>
    </div>
  )
}

// ── Wizard Template Card ──

function WizardTemplateCard({
  tmpl,
  onSelect,
  recommended,
}: {
  tmpl: import('./types').TemplateConfig
  onSelect: (id: string) => void
  recommended?: boolean
}) {
  return (
    <button
      onClick={() => onSelect(tmpl.id)}
      className={`group relative rounded-lg border overflow-hidden transition-colors text-left ${
        recommended
          ? 'border-zinc-600 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-500 ring-1 ring-zinc-700'
          : 'border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-600'
      }`}
    >
      <div className="aspect-[8.5/11] bg-zinc-800 overflow-hidden relative">
        <TemplateThumbnail template={tmpl} />
        {recommended && (
          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-zinc-100 text-zinc-900">
            REC
          </div>
        )}
      </div>
      <div className="px-3 py-2 border-t border-zinc-800">
        <div className="text-sm font-medium text-zinc-200">{tmpl.name}</div>
        <div className="text-xs text-zinc-500 truncate">{tmpl.description}</div>
      </div>
    </button>
  )
}

// ── Step: Import ──

function ImportStep({
  onStartFresh,
  onImport,
}: {
  onStartFresh: () => void
  onImport: () => void
}) {
  return (
    <div>
      <p className="text-sm text-zinc-400 mb-6">
        Start with a blank resume or import an existing one in JSON Resume format.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onStartFresh}
          className="flex flex-col items-center gap-3 px-6 py-8 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/60 hover:border-zinc-500 transition-colors"
        >
          <div className="size-12 rounded-full bg-zinc-800 flex items-center justify-center">
            <FilePlus2 className="size-6 text-zinc-300" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-zinc-200">Start Fresh</div>
            <div className="text-xs text-zinc-500 mt-1">
              Begin with an empty resume
            </div>
          </div>
        </button>

        <button
          onClick={onImport}
          className="flex flex-col items-center gap-3 px-6 py-8 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/60 hover:border-zinc-500 transition-colors"
        >
          <div className="size-12 rounded-full bg-zinc-800 flex items-center justify-center">
            <FileUp className="size-6 text-zinc-300" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-zinc-200">Import JSON Resume</div>
            <div className="text-xs text-zinc-500 mt-1">
              Upload a .json file
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
