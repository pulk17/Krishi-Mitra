'use client'

import { useState } from 'react';
import { Brain, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ResultsDisplay } from './ResultsDisplay';
import { MultiFileUpload } from './MultiFileUpload';
import { Button } from '@/components/ui/button';

/**
 * This component orchestrates the main user workflow:
 * 1. Upload one or more image files
 * 2. Trigger the useDiagnosis hook which handles upload and analysis
 * 3. View loading state
 * 4. View results or error
 */
export function DiagnosisFlow() {
  const { t } = useLanguage();
  const { loading, results, error, analyzeMultiplePlants, resetDiagnosis } = useDiagnosis();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) return;
    // CORRECTED: The function now only takes one argument (files).
    // The language is handled automatically by the backend.
    await analyzeMultiplePlants(selectedFiles);
    setSelectedFiles([]);
  };

  const handleReset = () => {
    resetDiagnosis();
    setSelectedFiles([]);
  }

  if (results) {
    return <ResultsDisplay results={results} onReset={handleReset} />;
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
           <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <ImageIcon className="h-4 w-4" />
            {t.uploadImage}
          </label>
          <MultiFileUpload 
            onFilesSelected={setSelectedFiles} 
            disabled={loading} 
          />
        </div>
        
        {selectedFiles.length > 0 && !loading && (
          <div className="flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              size="lg"
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              <Brain className="mr-2 h-4 w-4" />
              {t.analyzeImage} ({selectedFiles.length})
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center space-y-3 pt-4">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-lg font-medium">{t.analyzing}</span>
            </div>
             <p className="text-sm text-muted-foreground">Uploading and analyzing your plant image(s)...</p>
          </div>
        )}

        {error && !loading && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
         )}
      </CardContent>
    </Card>
  );
}