'use client'

import { useState } from 'react';
import { Brain, AlertTriangle } from 'lucide-react';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { LanguageSelector } from './LanguageSelector';
import { ImageUploader } from './ImageUploader';
import { ResultsDisplay } from './ResultsDisplay';

/**
 * This component orchestrates the main user workflow:
 * 1. Select language
 * 2. Upload image
 * 3. View loading state
 * 4. View results or error
 */
export function DiagnosisFlow() {
  const [language, setLanguage] = useState('English');
  const { loading, result, error, analyzePlant, resetDiagnosis } = useDiagnosis();

  const handleAnalyze = (imageData: string) => {
    analyzePlant(imageData, language);
  };

  // This function is passed to the ResultsDisplay to reset the state
  const handleReset = () => {
    resetDiagnosis();
    // We can also reset the image uploader's internal state if needed,
    // but the component-based approach handles this separation cleanly.
    // For now, starting a new diagnosis just clears the previous result.
  }

  // If we have a result, show only the result card.
  if (result) {
    return <ResultsDisplay result={result} onReset={handleReset} />;
  }

  // Otherwise, show the uploader and language selector flow.
  return (
    <>
      <LanguageSelector
        language={language}
        onLanguageChange={setLanguage}
        disabled={loading}
      />

      <ImageUploader onAnalyze={handleAnalyze} loading={loading} />
      
      {loading && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Brain className="h-6 w-6 text-green-600 animate-pulse" />
                <span className="text-lg font-medium">AI is analyzing your plant...</span>
              </div>
              <Progress value={50} className="w-full max-w-md mx-auto animate-pulse" />
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && !loading && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}