import { useCallback, useRef } from 'react'

/**
 * Reusable hook for CRUD operations on an array field.
 * Also provides stable drag-and-drop IDs that move with the data.
 */
export function useListField<T>(
  data: T[],
  onChange: (data: T[]) => void,
  emptyItem: T,
) {
  /* ── Stable IDs for dnd-kit ── */
  const counterRef = useRef(0)
  const idsRef = useRef<string[]>([])

  // Grow: assign new IDs for entries added since last render
  while (idsRef.current.length < data.length) {
    idsRef.current.push(`e-${counterRef.current++}`)
  }
  // Shrink safety-net (external data reduction)
  if (idsRef.current.length > data.length) {
    idsRef.current = idsRef.current.slice(0, data.length)
  }

  const updateEntry = useCallback(
    (index: number, partial: Partial<T>) => {
      const updated = [...data]
      updated[index] = { ...updated[index], ...partial }
      onChange(updated)
    },
    [data, onChange],
  )

  const addEntry = useCallback(() => {
    onChange([...data, { ...emptyItem }])
  }, [data, onChange, emptyItem])

  const removeEntry = useCallback(
    (index: number) => {
      idsRef.current = idsRef.current.filter((_, i) => i !== index)
      onChange(data.filter((_, i) => i !== index))
    },
    [data, onChange],
  )

  const reorderEntry = useCallback(
    (fromIndex: number, toIndex: number) => {
      const nextData = [...data]
      const [movedData] = nextData.splice(fromIndex, 1)
      nextData.splice(toIndex, 0, movedData)

      const nextIds = [...idsRef.current]
      const [movedId] = nextIds.splice(fromIndex, 1)
      nextIds.splice(toIndex, 0, movedId)
      idsRef.current = nextIds

      onChange(nextData)
    },
    [data, onChange],
  )

  return { updateEntry, addEntry, removeEntry, reorderEntry, entryIds: idsRef.current }
}
