'use client'

import { CheckCircle, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { DiagnosisResult, DiagnosisContent } from '@krishi-mitra/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ResultsDisplayProps {
  results: DiagnosisResult[];
  onReset: () => void;
}

const SingleResultDisplay = ({ result }: { result: DiagnosisResult }) => {
  const { t, language } = useLanguage(); // Get the current language
  const isHealthy = result.is_healthy;
  const confidence = result.confidence || 0;

  const renderContent = (content: DiagnosisContent) => {
    return (
      <div className="space-y-4">
        {isHealthy && content.advice && (
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Healthy Plant Advice</h4>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content.advice}</p>
            </div>
          </div>
        )}
        {!isHealthy && content.symptoms?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">Symptoms</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {content.symptoms.map((symptom: string, index: number) => <li key={index}>{symptom}</li>)}
            </ul>
          </div>
        )}
        {!isHealthy && content.treatment && (
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Treatment</h4>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content.treatment}</p>
            </div>
          </div>
        )}
        {!isHealthy && content.prevention && (
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Prevention</h4>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content.prevention}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-green-50/50 p-4 rounded-lg border border-green-200 space-y-4">
      {/* CORRECTED: defaultValue is now set by the global language context */}
      <Tabs defaultValue={language}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            {result.en.disease_name}
          </h3>
          <TabsList>
            <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
            <TabsTrigger value="hi">🇮🇳 हिंदी</TabsTrigger>
          </TabsList>
        </div>
        
        {!isHealthy && confidence > 0 && (
            <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">{t.confidence}:</span>
            <Progress value={confidence * 100} className="flex-1 max-w-32" />
            <span className="text-sm font-medium">{Math.round(confidence * 100)}%</span>
          </div>
        )}
        
        <TabsContent value="en" className="pt-2">
          {renderContent(result.en)}
        </TabsContent>
        <TabsContent value="hi" className="pt-2">
          {renderContent(result.hi)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {
  const { t } = useLanguage();

  return (
    <Card className="mb-6 border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-6 w-6" />
          {t.diagnosisResults} ({results.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {results.map((result, index) => (
            <SingleResultDisplay key={index} result={result} />
          ))}
        </div>
        <div className="text-center pt-4">
          <Button onClick={onReset} size="lg">
            {t.startNewDiagnosis}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}