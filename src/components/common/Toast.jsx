import { useState, useCallback } from 'react'

let toastTimeout

export function Toast({ message, type = 'default', onClose }) {
  if (!message) return null

  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`}>
      {type === 'success' && '✅ '}
      {type === 'error' && '❌ '}
      {message}
    </div>
  )
}

// Hook to use toast
export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'default', duration = 3000) => {
    setToast({ message, type })
    clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => setToast(null), duration)
  }, [])

  const hideToast = useCallback(() => setToast(null), [])

  return { toast, showToast, hideToast, Toast }
}
