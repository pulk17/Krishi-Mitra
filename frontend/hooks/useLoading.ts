'use client'

import { useState, useEffect } from 'react'
import { loadingManager } from '@/lib/loading/LoadingManager'

export function useLoading(operation?: string) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkLoading = () => {
      setIsLoading(loadingManager.isLoading(operation))
    }

    // Check initial state
    checkLoading()

    // Set up polling for loading state changes
    const interval = setInterval(checkLoading, 50)

    return () => {
      clearInterval(interval)
    }
  }, [operation])

  const showLoading = (op?: string) => {
    loadingManager.showLoading(op || operation || 'default')
  }

  const hideLoading = (op?: string) => {
    loadingManager.hideLoading(op || operation || 'default')
  }

  return {
    isLoading,
    showLoading,
    hideLoading
  }
}