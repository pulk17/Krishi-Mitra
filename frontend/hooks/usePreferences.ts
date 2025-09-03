'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useSupabase'
import { UserPreferences } from '@/lib/storage/types'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function usePreferences() {
  const { storageService } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [preferences, setPreferences] = useState<UserPreferences>({ language: 'en' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPreferences()
  }, [storageService])

  const loadPreferences = async () => {
    try {
      setLoading(true)
      const prefs = await storageService.getUserPreferences()
      setPreferences(prefs)
      
      // Sync language with context if different
      if (prefs.language !== language) {
        setLanguage(prefs.language)
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updated = { ...preferences, ...newPreferences }
      await storageService.saveUserPreferences(updated)
      setPreferences(updated)
      
      // Update language context if language changed
      if (newPreferences.language && newPreferences.language !== language) {
        setLanguage(newPreferences.language)
      }
    } catch (error) {
      console.error('Failed to save preferences:', error)
      throw error
    }
  }

  return {
    preferences,
    loading,
    updatePreferences,
    refreshPreferences: loadPreferences
  }
}