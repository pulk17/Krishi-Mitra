'use client'

import { AlertTriangle, CheckCircle, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { DiagnosisResult } from '@krishi-mitra/types';

interface ResultsDisplayProps {
  results: DiagnosisResult[];
  onReset: () => void;
}

const SingleResult = ({ result }: { result: DiagnosisResult }) => {
  const { t } = useLanguage();
  const diseaseName = result.disease_name || 'Unknown';
  const isHealthy = diseaseName.toLowerCase().includes('healthy');
  const confidence = result.confidence || 0;
  const treatment = result.treatment || '';
  const symptoms = result.symptoms || [];
  const prevention = result.prevention || '';

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-4">
      <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
        <Leaf className="h-5 w-5" />
        {diseaseName}
      </h3>
      {!isHealthy && confidence > 0 && (
          <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t.confidence}:</span>
          <Progress value={confidence * 100} className="flex-1 max-w-32" />
          <span className="text-sm font-medium">
            {Math.round(confidence * 100)}%
          </span>
        </div>
      )}
      {symptoms.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">{t.symptoms}</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
        </div>
      )}
      {!isHealthy && treatment && (
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">{t.treatment}</h4>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {treatment}
            </p>
          </div>
        </div>
      )}
      {prevention && (
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">{t.prevention}</h4>
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {prevention}
            </p>
          </div>
        </div>
      )}
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
            <SingleResult key={index} result={result} />
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