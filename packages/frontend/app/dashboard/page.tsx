'use client'

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabase'
import Link from 'next/link';
import { useAppStore } from '@/lib/stores/appStore';
import { Header } from '@/components/Header'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import { DiagnosisFlow } from '@/components/DiagnosisFlow'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Stethoscope, History, Trash2 } from 'lucide-react';
import { YieldPredictor } from '@/components/YieldPredictor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const dynamic = 'force-dynamic'

function RecentDiagnosesList() {
  const { t } = useLanguage();
  const diagnoses = useAppStore(state => state.diagnoses);
  const isLoadingHistory = useAppStore(state => state.isLoadingHistory);
  const clearAllDiagnoses = useAppStore(state => state.clearAllDiagnoses);
  
  const recentDiagnoses = diagnoses.slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6" />
          {t.recentDiagnoses}
        </h2>
        {diagnoses.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                {t.clearAll}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.areYouSureTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.areYouSureDescription.replace('all', `all ${diagnoses.length}`)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={() => clearAllDiagnoses()}>
                  {t.confirmDelete}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      {isLoadingHistory ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : recentDiagnoses.length > 0 ? (
        <div className="space-y-4">
          {recentDiagnoses.map((diagnosis) => (
            <Link href={`/dashboard/diagnosis/${diagnosis.id}`} key={diagnosis.id}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="pt-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {diagnosis.disease_name || 'Analysis Pending'}
                    </h3>
                    {diagnosis.confidence != null && (
                      <p className="text-sm text-muted-foreground">
                        {t.confidence}: {Math.round(Number(diagnosis.confidence) * 100)}%
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(diagnosis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (diagnosis.disease_name === 'Healthy' || diagnosis.disease_name === 'Healthy Plant')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {(diagnosis.disease_name === 'Healthy' || diagnosis.disease_name === 'Healthy Plant') ? 'Healthy' : 'Issue Detected'}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold">{t.noHistoryTitle}</h3>
          <p className="text-muted-foreground">{t.noHistoryDescription}</p>
        </div>
      )}
    </div>
  );
}


export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const fetchDiagnoses = useAppStore((state) => state.fetchDiagnoses);
  
  useEffect(() => {
    if (user) {
      fetchDiagnoses();
    }
  }, [user, fetchDiagnoses]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <WelcomeBanner userName={profile?.full_name || user.email || ''} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Tabs defaultValue="diagnosis" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="diagnosis">
                <Stethoscope className="mr-2 h-4 w-4" />
                {t.diseaseDiagnosis}
              </TabsTrigger>
              <TabsTrigger value="prediction">
                <BrainCircuit className="mr-2 h-4 w-4" />
                {t.yieldPrediction}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="diagnosis">
              <DiagnosisFlow />
            </TabsContent>
            <TabsContent value="prediction">
              <YieldPredictor />
            </TabsContent>
          </Tabs>
          <RecentDiagnosesList />
        </div>
      </main>
    </div>
  )
}