'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

type UseUndoOptions = {
  maxHistory?: number
  debounceMs?: number
  bindKeyboard?: boolean
}

export function useUndo<T>(initialValue: T, options: UseUndoOptions = {}) {
  const { maxHistory = 30, debounceMs = 500, bindKeyboard = true } = options

  const [value, setValue] = useState<T>(initialValue)
  const historyRef = useRef<T[]>([initialValue])
  const pointerRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isUndoRedoRef = useRef(false)

  const pushToHistory = useCallback(
    (newValue: T) => {
      // Trim future entries when we diverge
      historyRef.current = historyRef.current.slice(0, pointerRef.current + 1)
      historyRef.current.push(newValue)
      if (historyRef.current.length > maxHistory) {
        historyRef.current.shift()
      }
      pointerRef.current = historyRef.current.length - 1
    },
    [maxHistory],
  )

  const set = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue

        if (isUndoRedoRef.current) {
          isUndoRedoRef.current = false
          return resolved
        }

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          pushToHistory(resolved)
        }, debounceMs)

        return resolved
      })
    },
    [pushToHistory, debounceMs],
  )

  const undo = useCallback(() => {
    if (pointerRef.current <= 0) return
    // Flush any pending debounced push
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      pushToHistory(value)
    }
    pointerRef.current--
    isUndoRedoRef.current = true
    setValue(historyRef.current[pointerRef.current])
  }, [pushToHistory, value])

  const redo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return
    pointerRef.current++
    isUndoRedoRef.current = true
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const canUndo = pointerRef.current > 0 || timerRef.current !== null
  const canRedo = pointerRef.current < historyRef.current.length - 1

  // Keyboard shortcuts: Cmd+Z / Cmd+Shift+Z (Mac), Ctrl+Z / Ctrl+Y (Win)
  useEffect(() => {
    if (!bindKeyboard) return
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, bindKeyboard])

  // Reset history (used when loading data from storage)
  const reset = useCallback((newValue: T) => {
    historyRef.current = [newValue]
    pointerRef.current = 0
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setValue(newValue)
  }, [])

  return { value, set, undo, redo, canUndo, canRedo, reset }
}
