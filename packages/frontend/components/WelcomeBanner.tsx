'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useSupabase';



interface WelcomeBannerProps {
  userName?: string;
}

export function WelcomeBanner({ userName = "Farmer" }: WelcomeBannerProps) {
  const { t } = useLanguage();
  const { user, profile, isGuest, signOut } = useAuth();
  
  const displayName = isGuest 
    ? 'Guest User'
    : user?.user_metadata?.full_name || 
      profile?.full_name || 
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] || 
      'User';

  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.welcomeMessage}, {displayName}!</h2>
      <p className="text-xl text-muted-foreground mb-2">
        {t.welcomeDescription}
      </p>
      <p className="text-muted-foreground">
        {t.welcomeInstructions}
      </p>
    </div>
  );
}