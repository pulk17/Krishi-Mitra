import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DiagnosisResult } from '@/lib/utils';

interface ResultsDisplayProps {
  result: DiagnosisResult;
  onReset: () => void;
}

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const isHealthy = result.disease_name.toLowerCase().includes('healthy');
  
  return (
    <Card className="mb-6 border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-6 w-6" />
          Diagnosis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            {result.disease_name}
          </h3>
          {!isHealthy && (
             <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <Progress value={result.confidence * 100} className="flex-1 max-w-32" />
              <span className="text-sm font-medium">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Description</h4>
          <p className="text-gray-600 leading-relaxed">
            {result.description}
          </p>
        </div>

        {!isHealthy && (
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Treatment Steps</h4>
            <div className="space-y-2">
              {result.treatment.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Disclaimer:</strong> This is AI-generated advice. For serious plant health issues, please consult a local agricultural expert or plant pathologist.
          </AlertDescription>
        </Alert>

        <div className="text-center pt-4">
          <Button onClick={onReset} size="lg">
            Start New Diagnosis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}