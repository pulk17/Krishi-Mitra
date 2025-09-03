import { UserPreferences } from './types'

export class StorageUtils {
  static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  static getStorageUsage(): { used: number; available: number } {
    if (!this.isStorageAvailable()) {
      return { used: 0, available: 0 }
    }

    let used = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    // Estimate available space (most browsers have ~5-10MB limit)
    const estimated = 5 * 1024 * 1024 // 5MB in bytes
    return {
      used,
      available: Math.max(0, estimated - used)
    }
  }

  static cleanupOldData(maxAge = 30): void {
    if (!this.isStorageAvailable()) return

    try {
      const diagnoses = JSON.parse(localStorage.getItem('krishi_mitra_diagnoses') || '[]')
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - maxAge)

      const filtered = diagnoses.filter((d: any) => {
        const createdAt = new Date(d.created_at)
        return createdAt > cutoffDate
      })

      localStorage.setItem('krishi_mitra_diagnoses', JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to cleanup old data:', error)
    }
  }

  static exportData(): string {
    if (!this.isStorageAvailable()) return '{}'

    try {
      const data = {
        diagnoses: JSON.parse(localStorage.getItem('krishi_mitra_diagnoses') || '[]'),
        preferences: JSON.parse(localStorage.getItem('krishi_mitra_preferences') || '{}'),
        exportedAt: new Date().toISOString()
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Failed to export data:', error)
      return '{}'
    }
  }

  static importData(jsonData: string): boolean {
    if (!this.isStorageAvailable()) return false

    try {
      const data = JSON.parse(jsonData)
      
      if (data.diagnoses) {
        localStorage.setItem('krishi_mitra_diagnoses', JSON.stringify(data.diagnoses))
      }
      
      if (data.preferences) {
        localStorage.setItem('krishi_mitra_preferences', JSON.stringify(data.preferences))
      }
      
      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }
}