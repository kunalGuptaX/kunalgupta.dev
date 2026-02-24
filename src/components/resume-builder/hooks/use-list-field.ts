import { useCallback } from 'react'

/**
 * Reusable hook for CRUD operations on an array field.
 * Replaces the repeated updateEntry/addEntry/removeEntry pattern in section forms.
 */
export function useListField<T>(
  data: T[],
  onChange: (data: T[]) => void,
  emptyItem: T,
) {
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
      onChange(data.filter((_, i) => i !== index))
    },
    [data, onChange],
  )

  return { updateEntry, addEntry, removeEntry }
}
