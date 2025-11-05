'use client'

import { useEffect } from 'react'

export function useFocusFirstError(fieldErrors?: Record<string, string[]> | null): void {
  useEffect(() => {
    if (!fieldErrors) {
      return
    }

    const [firstField] = Object.keys(fieldErrors)
    if (!firstField) {
      return
    }

    const element = document.getElementById(firstField)
    if (element instanceof HTMLElement) {
      element.focus()
    }
  }, [fieldErrors])
}
