'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, SupabaseClient } from '@supabase/supabase-js'
import { useLanguage } from '../i18n/LanguageContext'
import { Language } from '../i18n/translations'
import { apiClient } from '../apiClient'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  isGuest: boolean
  supabase: SupabaseClient | null
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
  const { setLanguage } = useLanguage();

  const fetchProfile = async () => {
    try {
      // FIX: Specify the expected return type for the apiClient call.
      const profileData = await apiClient.get<Profile>('/api/user/profile');
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile from API:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      console.error("Supabase client failed to initialize.");
      return;
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // No need to await, let it load in the background
          fetchProfile();
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setIsGuest(false);

        if (currentUser) {
          await fetchProfile();
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile();
    }
  };

  const updateLanguagePreference = async (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('krishi-mitra-language', lang);
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    // Guest mode can be implemented here if needed in the future.
    console.warn("Guest mode is not implemented.");
  };

  const value = {
    user,
    profile,
    loading,
    isGuest,
    supabase,
    refreshProfile,
    signOut,
    continueAsGuest,
    updateLanguagePreference,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};