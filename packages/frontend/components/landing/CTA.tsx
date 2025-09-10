'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useAuth } from '@/hooks/useSupabase'
import { useRouter } from 'next/navigation'

export function CTA() {
  const [supabase, setSupabase] = useState<any>(null)
  const { t } = useLanguage()
  const { continueAsGuest } = useAuth()
  const router = useRouter()

  useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
    } catch (err) {
      console.error('Failed to initialize Supabase in CTA:', err)
    }
  }, [])

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      alert('Authentication not available. Please check configuration.')
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (err) {
      console.error('Sign in failed:', err)
      alert('Sign in failed. Please try again.')
    }
  }

  const handleContinueAsGuest = () => {
    continueAsGuest()
    router.push('/dashboard')
  }

  return (
    <section className="bg-green-50 py-24 sm:py-32">
      <div className="container text-center">
        <div className="max-w-3xl mx-auto">
          <Leaf className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t.ctaDescription}
          </p>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGoogleSignIn} 
                size="lg" 
                className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700"
                disabled={!supabase}
              >
                {t.signInWithGoogle}
              </Button>
              <Button 
                onClick={handleContinueAsGuest}
                variant="outline"
                size="lg" 
                className="text-lg px-8 py-6"
              >
                Continue as Guest
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.ctaDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}