/**
 * @jest-environment jsdom
 */

import { LocalStorageService } from '../localStorage'
import { Diagnosis, UserPreferences } from '../types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('LocalStorageService', () => {
  let service: LocalStorageService

  beforeEach(() => {
    service = new LocalStorageService()
    localStorage.clear()
  })

  describe('saveDiagnosis', () => {
    it('should save diagnosis to localStorage', async () => {
      const diagnosis: Diagnosis = {
        id: 'test-1',
        image_url: 'test-image.jpg',
        result: { disease_name: 'Test Disease' },
        confidence: 0.95,
        created_at: new Date().toISOString()
      }

      await service.saveDiagnosis(diagnosis)
      const saved = await service.getDiagnoses()
      
      expect(saved).toHaveLength(1)
      expect(saved[0].id).toBe('test-1')
      expect(saved[0].session_id).toBeDefined()
    })
  })

  describe('getUserPreferences', () => {
    it('should return default preferences when none exist', async () => {
      const prefs = await service.getUserPreferences()
      expect(prefs.language).toBe('en')
    })

    it('should save and retrieve preferences', async () => {
      const preferences: UserPreferences = {
        language: 'hi',
        theme: 'dark'
      }

      await service.saveUserPreferences(preferences)
      const retrieved = await service.getUserPreferences()
      
      expect(retrieved.language).toBe('hi')
      expect(retrieved.theme).toBe('dark')
    })
  })
})