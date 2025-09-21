import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext(null)

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const show = useCallback((toast) => {
    const id = ++idSeq
    const t = { id, timeout: 3000, type: 'info', ...toast }
    setToasts((prev) => [...prev, t])
    setTimeout(() => remove(id), t.timeout)
    return id
  }, [remove])

  const api = useMemo(() => ({
    show,
    success: (msg) => show({ type: 'success', message: msg }),
    error: (msg) => show({ type: 'error', message: msg }),
    info: (msg) => show({ type: 'info', message: msg }),
  }), [show])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed z-[1000] top-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[220px] max-w-sm rounded-md shadow-lg px-4 py-2 text-white ${
              t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
            }`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.message && <div className="text-sm">{t.message}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

