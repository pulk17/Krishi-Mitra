'use client'

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DiagnosisResult } from '@krishi-mitra/types';

export default function DiagnosisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const diagnoses = useAppStore((state) => state.diagnoses);
  const fetchDiagnoses = useAppStore((state) => state.fetchDiagnoses);
  const isLoadingHistory = useAppStore((state) => state.isLoadingHistory);

  const diagnosis = diagnoses.find((d) => d.id === id);

  useEffect(() => {
    if (diagnoses.length === 0) {
      fetchDiagnoses();
    }
  }, [diagnoses, fetchDiagnoses]);

  const resultsToDisplay: DiagnosisResult[] = [];
  if (diagnosis) {
    if (diagnosis.details && typeof diagnosis.details === 'object' && 'en' in diagnosis.details) {
      resultsToDisplay.push(diagnosis.details as DiagnosisResult);
    } else {
      // CORRECTED: The fallback logic now correctly builds the full DiagnosisResult type
      const fallbackResult: DiagnosisResult = {
        is_healthy: diagnosis.disease_name?.toLowerCase().includes('healthy') ?? false,
        confidence: diagnosis.confidence || 0,
        en: {
          disease_name: diagnosis.disease_name || 'N/A',
          symptoms: Array.isArray(diagnosis.symptoms) ? diagnosis.symptoms : [],
          treatment: diagnosis.treatment || 'No treatment information available.',
          prevention: diagnosis.prevention || 'No prevention information available.',
        },
        hi: {
          disease_name: 'जानकारी उपलब्ध नहीं है',
          symptoms: [],
          treatment: 'जानकारी उपलब्ध नहीं है',
          prevention: 'जानकारी उपलब्ध नहीं है',
          advice: 'जानकारी उपलब्ध नहीं है',
        },
      };
      resultsToDisplay.push(fallbackResult);
    }
  }

  if (isLoadingHistory && !diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isLoadingHistory && !diagnosis) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Diagnosis Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We could not find a diagnosis with the ID: {id}
          </p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          {resultsToDisplay.length > 0 && (
            <ResultsDisplay 
              results={resultsToDisplay} 
              onReset={() => router.push('/dashboard')} 
            />
          )}
        </div>
      </main>
    </div>
  );
}