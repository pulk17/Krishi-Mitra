import { DataStorageService, Diagnosis, UserPreferences } from './types'
import { StorageUtils } from './utils'

const STORAGE_KEYS = {
  DIAGNOSES: 'krishi_mitra_diagnoses',
  PREFERENCES: 'krishi_mitra_preferences',
  SESSION_ID: 'krishi_mitra_session_id'
}

export class LocalStorageService implements DataStorageService {
  private getSessionId(): string {
    let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID)
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)
    }
    return sessionId
  }

  async saveDiagnosis(diagnosis: Diagnosis): Promise<void> {
    try {
      // Check storage availability
      if (!StorageUtils.isStorageAvailable()) {
        throw new Error('Local storage is not available')
      }

      const diagnoses = await this.getDiagnoses()
      diagnoses.push(diagnosis)
      
      localStorage.setItem(STORAGE_KEYS.DIAGNOSES, JSON.stringify(diagnoses))
      
      // Cleanup if needed
      StorageUtils.cleanupOldData()
    } catch (error) {
      console.error('Failed to save diagnosis to localStorage:', error)
      throw new Error('Failed to save diagnosis')
    }
  }

  async getDiagnoses(): Promise<Diagnosis[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DIAGNOSES)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to get diagnoses from localStorage:', error)
      return []
    }
  }

  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
    } catch (error) {
      console.error('Failed to save preferences to localStorage:', error)
      throw new Error('Failed to save preferences')
    }
  }

  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      return stored ? JSON.parse(stored) : { language: 'en' }
    } catch (error) {
      console.error('Failed to get preferences from localStorage:', error)
      return { language: 'en' }
    }
  }
}