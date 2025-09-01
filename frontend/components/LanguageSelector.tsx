import { Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({ language, onLanguageChange, disabled = false }: LanguageSelectorProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Language Preference
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={language} onValueChange={onLanguageChange} disabled={disabled}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">🇺🇸 English</SelectItem>
            <SelectItem value="Hindi">🇮🇳 Hindi</SelectItem>
            <SelectItem value="Spanish">🇪🇸 Spanish</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}