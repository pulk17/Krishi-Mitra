'use client'

import { useAuth, useDiagnoses } from '@/hooks/useSupabase'
import { useLanguage } from '@/lib/i18n/LanguageContext'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { Header } from '@/components/Header'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import { DiagnosisFlow } from '@/components/DiagnosisFlow'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History, Leaf, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const { diagnoses, loading: diagnosesLoading } = useDiagnoses()
  const { t } = useLanguage()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null // Middleware will redirect to landing
  }

  const recentDiagnoses = diagnoses.slice(0, 5)
  const totalDiagnoses = diagnoses.length
  const healthyPlants = diagnoses.filter(d => d.disease_name === 'Healthy' || d.disease_name === 'Healthy Plant' || d.disease_name === null).length
  const diseaseDetected = totalDiagnoses - healthyPlants

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <WelcomeBanner userName={profile?.full_name || user.email || ''} />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">{t.totalDiagnoses}</CardTitle>
              </div>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDiagnoses}</div>
              <p className="text-xs text-muted-foreground">
                {t.plantsAnalyzed}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">{t.healthyPlants}</CardTitle>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{healthyPlants}</div>
              <p className="text-xs text-muted-foreground">
                {t.noIssuesDetected}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">{t.issuesFound}</CardTitle>
              </div>
              <History className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{diseaseDetected}</div>
              <p className="text-xs text-muted-foreground">
                {t.diseasesDetected}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Diagnosis Flow */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t.newDiagnosis}</h2>
            <DiagnosisFlow />
          </div>

          {/* Recent Diagnoses */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t.recentDiagnoses}</h2>
            {diagnosesLoading ? (
              <div className="flex justify-center items-center h-48">
                <LoadingSpinner />
              </div>
            ) : recentDiagnoses.length > 0 ? (
              <div className="space-y-4">
                {recentDiagnoses.map((diagnosis) => (
                  <Card key={diagnosis.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {diagnosis.disease_name || t.healthy}
                          </h3>
                          {diagnosis.confidence && (
                            <p className="text-sm text-muted-foreground">
                              {t.confidence}: {Math.round(diagnosis.confidence * 100)}%
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(diagnosis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                           diagnosis.disease_name === 'Healthy' || diagnosis.disease_name === 'Healthy Plant' || !diagnosis.disease_name
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {diagnosis.disease_name === 'Healthy' || diagnosis.disease_name === 'Healthy Plant' || !diagnosis.disease_name
                            ? t.healthy
                            : t.issueDetected
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-48 p-8 border-2 border-dashed rounded-lg text-center">
                  <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Diagnoses Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {t.noDiagnosesYet}
                  </p>
                  <Button variant="outline" onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}>
                    {t.startAnalyzing}
                  </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}