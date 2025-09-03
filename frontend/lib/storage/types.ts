export interface Diagnosis {
  id: string
  user_id: string
  image_url: string | null
  disease_name: string | null
  confidence: number | null
  symptoms: string[] | null
  treatment: string | null
  prevention: string | null
  language: string
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  language: 'en' | 'hi'
  theme?: 'light' | 'dark'
}

export interface DataStorageService {
  saveDiagnosis(diagnosis: Diagnosis): Promise<void>
  getDiagnoses(): Promise<Diagnosis[]>
  saveUserPreferences(preferences: UserPreferences): Promise<void>
  getUserPreferences(): Promise<UserPreferences>
}