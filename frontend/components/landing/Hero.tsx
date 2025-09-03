'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Leaf, Camera } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function LandingHero() {
  const [supabase, setSupabase] = useState<any>(null)
  const { t } = useLanguage()

  useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
    } catch (err) {
      console.error('Failed to initialize Supabase in Hero:', err)
    }
  }, [])

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      alert(t.authNotAvailable || 'Authentication not available. Please check configuration.')
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (err) {
      console.error('Sign in failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      alert(`${t.signInFailed || 'Sign in failed'}: ${errorMessage}`)
    }
  }
  
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="mb-4">{t.heroHeadline}</h1>
          <h2 className="text-green-600">{t.heroSubheadline}</h2>
        </main>
        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          {t.heroDescription}
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button 
            onClick={handleGoogleSignIn} 
            className="w-full md:w-auto text-lg px-8 py-6 bg-green-600 hover:bg-green-700" 
            size="lg"
            disabled={!supabase}
          >
            {t.signInWithGoogle}
          </Button>
        </div>
        <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span>{t.instantAnalysis}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4" />
            <span>{t.expertSolutions}</span>
          </div>
        </div>
      </div>

      {/* Hero Image - Farmer with smartphone */}
      <div className="z-10 relative">
        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center shadow-2xl">
          {/* Phone mockup */}
          <div className="relative">
            <div className="w-48 h-80 bg-gray-900 rounded-3xl p-2 shadow-xl">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                {/* App interface mockup */}
                <div className="bg-green-600 h-16 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white mr-2" />
                  <span className="text-white font-semibold">{t.appName}</span>
                </div>
                <div className="p-4 space-y-4">
                  <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-green-100 h-4 rounded w-3/4"></div>
                    <div className="bg-green-100 h-4 rounded w-1/2"></div>
                    <div className="bg-green-100 h-4 rounded w-2/3"></div>
                  </div>
                  <div className="bg-green-600 h-10 rounded-lg"></div>
                </div>
              </div>
            </div>
            {/* Floating leaf elements */}
            <Leaf className="absolute -top-4 -left-4 h-8 w-8 text-green-500 animate-pulse" />
            <Leaf className="absolute -bottom-4 -right-4 h-6 w-6 text-green-400 animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  )
}