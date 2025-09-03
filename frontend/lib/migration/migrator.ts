import { StorageUtils } from '@/lib/storage/utils'

interface MigrationResult {
  success: boolean
  message: string
  migratedItems?: number
}

export class DataMigrator {
  private static readonly MIGRATION_KEY = 'krishi_mitra_migration_version'
  private static readonly CURRENT_VERSION = '1.0.0'

  static async checkAndMigrate(): Promise<MigrationResult> {
    try {
      const currentVersion = localStorage.getItem(this.MIGRATION_KEY)
      
      if (!currentVersion) {
        // First time user or legacy data
        return await this.migrateLegacyData()
      }
      
      if (currentVersion !== this.CURRENT_VERSION) {
        // Future migrations would go here
        return { success: true, message: 'No migration needed' }
      }
      
      return { success: true, message: 'Data is up to date' }
    } catch (error) {
      console.error('Migration failed:', error)
      return { 
        success: false, 
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    }
  }

  private static async migrateLegacyData(): Promise<MigrationResult> {
    let migratedItems = 0
    
    try {
      // Check for old data format (if any existed)
      const oldDiagnoses = localStorage.getItem('diagnoses') // Old key without prefix
      const oldPreferences = localStorage.getItem('user_preferences') // Old key format
      
      if (oldDiagnoses) {
        try {
          const diagnoses = JSON.parse(oldDiagnoses)
          if (Array.isArray(diagnoses)) {
            // Migrate to new format
            const migratedDiagnoses = diagnoses.map((diagnosis: any) => ({
              ...diagnosis,
              id: diagnosis.id || `migrated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              created_at: diagnosis.created_at || new Date().toISOString(),
              updated_at: diagnosis.updated_at || new Date().toISOString(),
              user_id: diagnosis.user_id || 'guest'
            }))
            
            localStorage.setItem('krishi_mitra_diagnoses', JSON.stringify(migratedDiagnoses))
            localStorage.removeItem('diagnoses') // Remove old key
            migratedItems += migratedDiagnoses.length
          }
        } catch (error) {
          console.error('Failed to migrate diagnoses:', error)
        }
      }
      
      if (oldPreferences) {
        try {
          const preferences = JSON.parse(oldPreferences)
          const migratedPreferences = {
            language: preferences.language || 'en',
            theme: preferences.theme || 'light'
          }
          
          localStorage.setItem('krishi_mitra_preferences', JSON.stringify(migratedPreferences))
          localStorage.removeItem('user_preferences') // Remove old key
          migratedItems++
        } catch (error) {
          console.error('Failed to migrate preferences:', error)
        }
      }
      
      // Set migration version
      localStorage.setItem(this.MIGRATION_KEY, this.CURRENT_VERSION)
      
      return {
        success: true,
        message: migratedItems > 0 ? `Successfully migrated ${migratedItems} items` : 'No legacy data found',
        migratedItems
      }
    } catch (error) {
      console.error('Legacy migration failed:', error)
      return {
        success: false,
        message: `Legacy migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  static async rollback(): Promise<MigrationResult> {
    try {
      // Create backup before rollback
      const backupData = StorageUtils.exportData()
      localStorage.setItem('krishi_mitra_backup', backupData)
      
      // Clear current data
      localStorage.removeItem('krishi_mitra_diagnoses')
      localStorage.removeItem('krishi_mitra_preferences')
      
      // Remove migration marker
      localStorage.removeItem(this.MIGRATION_KEY)
      
      return {
        success: true,
        message: 'Rollback completed. Backup created.'
      }
    } catch (error) {
      console.error('Rollback failed:', error)
      return {
        success: false,
        message: `Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  static async restoreFromBackup(): Promise<MigrationResult> {
    try {
      const backup = localStorage.getItem('krishi_mitra_backup')
      if (!backup) {
        return {
          success: false,
          message: 'No backup found'
        }
      }
      
      const restored = StorageUtils.importData(backup)
      if (restored) {
        localStorage.setItem(this.MIGRATION_KEY, this.CURRENT_VERSION)
        return {
          success: true,
          message: 'Data restored from backup'
        }
      } else {
        return {
          success: false,
          message: 'Failed to restore from backup'
        }
      }
    } catch (error) {
      console.error('Restore failed:', error)
      return {
        success: false,
        message: `Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}