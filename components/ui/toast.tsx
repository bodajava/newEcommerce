"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "destructive"
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ title, description, variant = "default", onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 md:p-6 md:pr-8 shadow-2xl transition-all backdrop-blur-md",
          {
            "border-gray-800/50 bg-gray-900/90 text-white": variant === "default",
            "border-green-500/30 bg-green-500/10 text-green-400": variant === "success",
            "border-red-500/30 bg-red-500/10 text-red-400": variant === "destructive",
          }
        )}
        {...props}
      >
        <div className="grid gap-1">
          {title && (
            <div className="text-sm font-semibold">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-200 group-hover:opacity-100"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }

