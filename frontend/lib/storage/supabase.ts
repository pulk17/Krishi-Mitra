import { DataStorageService, Diagnosis, UserPreferences } from './types'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/database.types'

export class SupabaseStorageService implements DataStorageService {
  constructor(
    private supabase: SupabaseClient<Database>,
    private userId: string
  ) {}

  async saveDiagnosis(diagnosis: Diagnosis): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('diagnoses')
        .insert({
          id: diagnosis.id,
          user_id: diagnosis.user_id,
          image_url: diagnosis.image_url,
          disease_name: diagnosis.disease_name,
          confidence: diagnosis.confidence,
          symptoms: diagnosis.symptoms,
          treatment: diagnosis.treatment,
          prevention: diagnosis.prevention,
          language: diagnosis.language,
          created_at: diagnosis.created_at,
          updated_at: diagnosis.updated_at
        })
      
      if (error) {
        console.error('Failed to save diagnosis to Supabase:', error)
        throw new Error('Failed to save diagnosis')
      }
    } catch (error) {
      console.error('Failed to save diagnosis to Supabase:', error)
      throw new Error('Failed to save diagnosis')
    }
  }

  async getDiagnoses(): Promise<Diagnosis[]> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('diagnoses')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Failed to get diagnoses from Supabase:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Failed to get diagnoses from Supabase:', error)
      return []
    }
  }

  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('profiles')
        .update({
          language_preference: preferences.language,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.userId)
      
      if (error) {
        console.error('Failed to save preferences to Supabase:', error)
        throw new Error('Failed to save preferences')
      }
    } catch (error) {
      console.error('Failed to save preferences to Supabase:', error)
      throw new Error('Failed to save preferences')
    }
  }

  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('profiles')
        .select('language_preference')
        .eq('id', this.userId)
        .single()
      
      if (error) {
        console.error('Failed to get preferences from Supabase:', error)
        return { language: 'en' }
      }
      
      return {
        language: (data?.language_preference as 'en' | 'hi') || 'en'
      }
    } catch (error) {
      console.error('Failed to get preferences from Supabase:', error)
      return { language: 'en' }
    }
  }
}