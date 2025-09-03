'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider' // Import from our new AuthProvider
import { Database } from '@/lib/supabase/database.types'

type Diagnosis = Database['public']['Tables']['diagnoses']['Row']

// Re-export useAuth so all auth-related hooks are in one place
export { useAuth }

export function useDiagnoses() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
  const [loading, setLoading] = useState(true)
  const { storageService, user, isGuest } = useAuth()

  useEffect(() => {
    fetchDiagnoses()
  }, [storageService])

  const fetchDiagnoses = async () => {
    try {
      setLoading(true)
      const data = await storageService.getDiagnoses()
      setDiagnoses(data)
    } catch (error) {
      console.error('Error fetching diagnoses:', error)
      setDiagnoses([])
    } finally {
      setLoading(false)
    }
  }

  const saveDiagnosis = async (diagnosis: Omit<Diagnosis, 'id' | 'created_at' | 'user_id' | 'updated_at'>) => {
    try {
      const newDiagnosis = {
        ...diagnosis,
        id: `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: user?.id || 'guest',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      await storageService.saveDiagnosis(newDiagnosis)
      setDiagnoses(prev => [newDiagnosis, ...prev])
      return newDiagnosis
    } catch (error) {
      console.error('Error saving diagnosis:', error)
      return null
    }
  }

  return {
    diagnoses,
    loading,
    saveDiagnosis,
    refetch: fetchDiagnoses
  }
}

// ... your useConversations hook can remain here if you have one ...