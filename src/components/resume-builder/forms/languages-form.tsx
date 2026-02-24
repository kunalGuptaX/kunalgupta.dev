'use client'

import { useCallback } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ResumeLanguage } from '../types/resume'

const FLUENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Beginner']

/* ── LanguagesForm ── */
export type LanguagesFormProps = {
  data: ResumeLanguage[]
  onChange: (data: ResumeLanguage[]) => void
}

const emptyLanguage: ResumeLanguage = {
  language: '',
  fluency: '',
}

export function LanguagesForm({ data, onChange }: LanguagesFormProps) {
  const updateEntry = useCallback(
    (index: number, partial: Partial<ResumeLanguage>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyLanguage }])
  }, [data, onChange])

  const removeEntry = useCallback(
    (index: number) => {
      onChange(data.filter((_, i) => i !== index))
    },
    [data, onChange],
  )

  return (
    <div className="space-y-3">
      {data.map((entry, index) => (
        <div key={index} className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs text-muted-foreground">Language</Label>
            <Input
              value={entry.language}
              onChange={(e) => updateEntry(index, { language: e.target.value })}
              placeholder="English, Spanish..."
              className="h-8 text-sm"
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs text-muted-foreground">Fluency</Label>
            <Select
              value={entry.fluency}
              onValueChange={(fluency) => updateEntry(index, { fluency })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {FLUENCY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            type="button"
            onClick={() => removeEntry(index)}
            className="shrink-0 p-1.5 mb-0.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Remove language"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addEntry}
        className="w-full h-8 text-xs"
      >
        <Plus className="size-3.5 mr-1" />
        Add Language
      </Button>
    </div>
  )
}
