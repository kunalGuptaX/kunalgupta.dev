import { ClassicLayout } from './layouts/classic'
import { MinimalLayout } from './layouts/minimal'
import { ProfessionalLayout } from './layouts/professional'
import { ModernLayout } from './layouts/modern'
import { ExecutiveLayout } from './layouts/executive'
import { CompactLayout } from './layouts/compact'
import { BoldLayout } from './layouts/bold'
import { TimelineLayout } from './layouts/timeline'

export const layoutComponents: Record<string, typeof ClassicLayout> = {
  classic: ClassicLayout,
  minimal: MinimalLayout,
  professional: ProfessionalLayout,
  modern: ModernLayout,
  executive: ExecutiveLayout,
  compact: CompactLayout,
  bold: BoldLayout,
  timeline: TimelineLayout,
}
