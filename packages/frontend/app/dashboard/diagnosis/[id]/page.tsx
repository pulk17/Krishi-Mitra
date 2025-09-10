'use client'

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DiagnosisHistoryItem } from '@krishi-mitra/types';

export default function DiagnosisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Select state and actions from the Zustand store
  const diagnoses = useAppStore((state) => state.diagnoses);
  const fetchDiagnoses = useAppStore((state) => state.fetchDiagnoses);
  const isLoadingHistory = useAppStore((state) => state.isLoadingHistory);
  
  // Find the specific diagnosis from the list
  const diagnosis = diagnoses.find((d) => d.id === id);

  // If the diagnoses list is empty on page load (e.g., a refresh), fetch it.
  useEffect(() => {
    if (diagnoses.length === 0) {
      fetchDiagnoses();
    }
  }, [diagnoses, fetchDiagnoses]);

  // The ResultsDisplay component expects an array, so we wrap our single diagnosis.
  // We also need to cast our DiagnosisHistoryItem to the DiagnosisResult shape.
  const resultsToDisplay = diagnosis ? [{
    disease_name: diagnosis.disease_name || 'N/A',
    confidence: diagnosis.confidence || 0,
    symptoms: diagnosis.symptoms || [],
    treatment: diagnosis.treatment || 'No treatment information available.',
    prevention: diagnosis.prevention || 'No prevention information available.',
    language: (diagnosis.language as 'en' | 'hi') || 'en',
  }] : [];

  // Handle loading state
  if (isLoadingHistory && !diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Handle case where diagnosis is not found after loading
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
          {diagnosis && (
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