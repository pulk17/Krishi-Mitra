'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/database.types'
import { createStorageService, DataStorageService } from '@/lib/storage'
import { DataMigrator } from '@/lib/migration/migrator'
import { useLanguage } from '../i18n/LanguageContext'
import { Language } from '../i18n/translations'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  isGuest: boolean
  supabase: SupabaseClient<Database>
  storageService: DataStorageService
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
  continueAsGuest: () => void
  updateLanguagePreference: (lang: Language) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const [supabase] = useState(() => createClient())
  const [storageService, setStorageService] = useState<DataStorageService>(() => createStorageService())
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const fetchProfileAndPreferences = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error;
        setProfile(data);

        // Set language from profile
        if (data?.language_preference) {
          setLanguage(data.language_preference as Language);
        }

      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      }
    }

    const getInitialSession = async () => {
      try {
        await DataMigrator.checkAndMigrate();
        const guestMode = localStorage.getItem('krishi_mitra_guest_mode');

        if (guestMode === 'true') {
          setIsGuest(true)
          setStorageService(createStorageService())
          setLoading(false)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          setStorageService(createStorageService(supabase, currentUser.id))
          await fetchProfileAndPreferences(currentUser.id)
        } else {
          setStorageService(createStorageService())
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setIsGuest(false)
        localStorage.removeItem('krishi_mitra_guest_mode')
        
        if (currentUser) {
          setStorageService(createStorageService(supabase, currentUser.id))
          await fetchProfileAndPreferences(currentUser.id)
        } else {
          setStorageService(createStorageService())
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, setLanguage])

  const refreshProfile = async () => {
    if (user) {
       const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error refreshing profile:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }
    }
  }

  const updateLanguagePreference = async (lang: Language) => {
    // 1. Update the language context immediately for instant UI change
    setLanguage(lang);
    
    // 2. Persist the change
    const newPrefs = { language: lang };
    await storageService.saveUserPreferences(newPrefs);
  };

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setIsGuest(false)
    localStorage.removeItem('krishi_mitra_guest_mode')
    setStorageService(createStorageService())
  }

  const continueAsGuest = () => {
    setIsGuest(true)
    localStorage.setItem('krishi_mitra_guest_mode', 'true')
    setStorageService(createStorageService())
    setLoading(false)
  }

  const value = {
    user,
    profile,
    loading,
    isGuest,
    supabase,
    storageService,
    refreshProfile,
    signOut,
    continueAsGuest,
    updateLanguagePreference,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}