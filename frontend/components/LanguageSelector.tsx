'use client'

import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { useAuth } from '@/hooks/useSupabase';

interface LanguageSelectorProps {
  variant?: 'header' | 'card'
  disabled?: boolean
}

export function LanguageSelector({ variant = 'header', disabled = false }: LanguageSelectorProps) {
  const { language, t } = useLanguage()
  const { updateLanguagePreference } = useAuth();

  const handleLanguageChange = (value: string) => {
    updateLanguagePreference(value as Language);
  }

  if (variant === 'header') {
    return (
      <Select value={language} onValueChange={handleLanguageChange} disabled={disabled}>
        <SelectTrigger className="w-auto bg-transparent border-0 text-foreground hover:bg-muted focus:ring-0 gap-2">
          {language === 'en' ? '🇺🇸' : '🇮🇳'}
          <span className="hidden md:inline">{language === 'en' ? t.english : t.hindi}</span>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200">
          <SelectItem value="en" className="hover:bg-gray-100">🇺🇸 {t.english}</SelectItem>
          <SelectItem value="hi" className="hover:bg-gray-100">🇮🇳 {t.hindi}</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  // Card variant
  return (
    <Select value={language} onValueChange={handleLanguageChange} disabled={disabled}>
      <SelectTrigger className="w-full max-w-xs">
        {language === 'en' ? '🇺🇸 English' : '🇮🇳 हिंदी'}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">🇺🇸 {t.english}</SelectItem>
        <SelectItem value="hi">🇮🇳 {t.hindi}</SelectItem>
      </SelectContent>
    </Select>
  )
}