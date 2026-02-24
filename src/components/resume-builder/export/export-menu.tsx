'use client'

import { Download, FileJson, ChevronDown } from 'lucide-react'
import type { ResumeDataV2 } from '../types/resume'
import { downloadJsonResume } from './json-resume-export'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type ExportMenuProps = {
  data: ResumeDataV2
  onPrint: () => void
}

export function ExportMenu({ data, onPrint }: ExportMenuProps) {
  const handleExportJson = () => {
    downloadJsonResume(data)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-sm px-3 border-zinc-600 text-zinc-300 hover:text-white hover:bg-zinc-700"
        >
          <Download className="size-3.5 mr-1.5" />
          Export
          <ChevronDown className="size-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 z-[70]">
        <DropdownMenuItem onSelect={onPrint}>
          <Download className="size-4 text-muted-foreground" />
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleExportJson}>
          <FileJson className="size-4 text-muted-foreground" />
          Export JSON Resume
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
