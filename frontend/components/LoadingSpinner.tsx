'use client'

import { Loader2 } from 'lucide-react'
import { useLoading } from '@/hooks/useLoading'

interface LoadingSpinnerProps {
  operation?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ 
  operation, 
  size = 'md', 
  text, 
  className = '' 
}: LoadingSpinnerProps) {
  const { isLoading } = useLoading(operation)

  if (!isLoading) return null

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

export function LoadingOverlay({ 
  operation, 
  text = 'Loading...' 
}: { 
  operation?: string
  text?: string 
}) {
  const { isLoading } = useLoading(operation)

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        <span className="text-lg font-medium">{text}</span>
      </div>
    </div>
  )
}