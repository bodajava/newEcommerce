"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { Toast } from "./toast"

interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "destructive"
}

interface ToastContextType {
  toast: (data: Omit<ToastData, "id">) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Global toast function for use outside of Toaster
let globalToastHandler: ((data: Omit<ToastData, "id">) => void) | null = null

export function Toaster() {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toast = useCallback((data: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: ToastData = { ...data, id }
    
    setToasts((prev) => [...prev, newToast])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    globalToastHandler = toast
    return () => {
      globalToastHandler = null
    }
  }, [toast])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ToastContext.Provider value={{ toast }}>
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm" />
      </ToastContext.Provider>
    )
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((toastItem) => (
          <Toast
            key={toastItem.id}
            title={toastItem.title}
            description={toastItem.description}
            variant={toastItem.variant}
            onClose={() => removeToast(toastItem.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    // Fallback to global handler if context not available
    return { 
      toast: (data: Omit<ToastData, "id">) => {
        if (globalToastHandler) {
          globalToastHandler(data)
        }
      }
    }
  }
  return context
}

