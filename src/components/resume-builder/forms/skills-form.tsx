'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

/* ── SkillsForm — flat list of skill strings ── */
export type SkillsFormProps = {
  data: string[]
  onChange: (data: string[]) => void
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [inputValue, setInputValue] = useState('')

  const addSkill = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !data.includes(trimmed)) {
      onChange([...data, trimmed])
    }
    setInputValue('')
  }

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    } else if (e.key === 'Backspace' && inputValue === '' && data.length > 0) {
      removeSkill(data.length - 1)
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground/70">
        Type a skill and press Enter to add it.
      </p>
      <div className="flex flex-wrap gap-1.5 min-h-[40px] rounded-md border border-border bg-transparent px-2 py-1.5 text-sm focus-within:ring-1 focus-within:ring-ring">
        {data.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-0.5 rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(i)}
              className="ml-0.5 hover:text-red-400 transition-colors"
            >
              <X className="size-2.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          placeholder={data.length === 0 ? 'TypeScript, React, Node.js...' : ''}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}
