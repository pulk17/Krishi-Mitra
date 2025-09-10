'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MultiFileUpload } from './MultiFileUpload';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/stores/appStore';
import { YieldPredictionRequest } from '@krishi-mitra/types';
import { AlertTriangle, BrainCircuit, HelpCircle, Info, Leaf, Sparkles, UploadCloud } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type FeatureField = {
  label: string;
  key: keyof YieldPredictionRequest;
  min: number;
  max: number;
  step: number;
  info: string;
};

const initialFormState: YieldPredictionRequest = {
  Temperature_Celsius: 28,
  Rainfall_mm: 900,
  Days_to_Harvest: 120,
  Agricultural_Input_Score: 0.5,
  Temperature_Stress_Index: 0.8,
  Rainfall_Intensity: 7.0,
  Growing_Degree_Days: 1500,
  Temp_Rainfall_Interaction: 20,
};

export function YieldPredictor() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState<YieldPredictionRequest>(initialFormState);
  const [showAiEstimator, setShowAiEstimator] = useState(false);
  const [estimatorFiles, setEstimatorFiles] = useState<File[]>([]);
  const [location, setLocation] = useState('');

  const isEstimating = useAppStore(state => state.isEstimating);
  const estimationError = useAppStore(state => state.estimationError);
  const estimateInputs = useAppStore(state => state.estimateInputs);
  const isPredicting = useAppStore(state => state.isPredicting);
  const predictionError = useAppStore(state => state.predictionError);
  const predictedYield = useAppStore(state => state.predictedYield);
  const predictYield = useAppStore(state => state.predictYield);
  const resetPrediction = useAppStore(state => state.resetPrediction);
  
  const featureFields: FeatureField[] = [
    { label: t.featureLabelTemperature, key: "Temperature_Celsius", min: 0, max: 45, step: 0.5, info: t.featureInfoTemperature },
    { label: t.featureLabelRainfall, key: "Rainfall_mm", min: 50, max: 2000, step: 10, info: t.featureInfoRainfall },
    { label: t.featureLabelHarvestDays, key: "Days_to_Harvest", min: 60, max: 180, step: 1, info: t.featureInfoHarvestDays },
    { label: t.featureLabelAgriInput, key: "Agricultural_Input_Score", min: 0, max: 1, step: 0.1, info: t.featureInfoAgriInput },
    { label: t.featureLabelTempStress, key: "Temperature_Stress_Index", min: 0, max: 1, step: 0.1, info: t.featureInfoTempStress },
    { label: t.featureLabelRainIntensity, key: "Rainfall_Intensity", min: 0, max: 15, step: 0.5, info: t.featureInfoRainIntensity },
    { label: t.featureLabelGDD, key: "Growing_Degree_Days", min: 500, max: 3500, step: 50, info: t.featureInfoGDD },
    { label: t.featureLabelTempRainInteraction, key: "Temp_Rainfall_Interaction", min: 0, max: 40, step: 1, info: t.featureInfoTempRainInteraction },
  ];
  
  const handleSliderChange = (key: keyof YieldPredictionRequest, value: number[]) => {
    setFormState(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleInputChange = (key: keyof YieldPredictionRequest, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setFormState(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleEstimate = async () => {
    if (estimatorFiles.length === 0 || !location) return;
    const estimatedValues = await estimateInputs(estimatorFiles, location);
    if (estimatedValues) {
      setFormState(prev => ({ ...prev, ...estimatedValues }));
      setShowAiEstimator(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predictYield(formState);
  };

  if (predictedYield !== null) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <Leaf className="h-16 w-16 text-green-600 mx-auto" />
          <h3 className="text-2xl font-bold">{t.predictionResult}</h3>
          <p className="text-5xl font-bold text-green-700">
            {predictedYield.toFixed(2)}
          </p>
          <p className="text-lg text-muted-foreground">{t.tonsPerHectare}</p>
          <Button onClick={resetPrediction} size="lg">{t.startNewPrediction}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {featureFields.map(field => (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-60 text-sm">
                      {field.info}
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    id={field.key}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={[formState[field.key]]}
                    onValueChange={(val) => handleSliderChange(field.key, val)}
                    className="flex-1"
                    disabled={isPredicting || isEstimating}
                  />
                  <Input
                    type="number"
                    value={formState[field.key]}
                    onChange={(e) => handleInputChange(field.key, e)}
                    className="w-24"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    disabled={isPredicting || isEstimating}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-6 space-y-4">
            {!showAiEstimator && (
               <Button type="button" variant="outline" className="w-full" onClick={() => setShowAiEstimator(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                {t.notSureButton}
              </Button>
            )}
           
            <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700" disabled={isPredicting || isEstimating}>
              {isPredicting ? (
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              {isPredicting ? t.calculating : t.predictYieldButton}
            </Button>
            {predictionError && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>{predictionError}</AlertDescription></Alert>}
          </div>
        </form>

        {showAiEstimator && (
          <div className="border-t pt-6 mt-6 space-y-4 animate-in fade-in">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>{t.aiEstimatorTitle}</AlertTitle>
              <AlertDescription>{t.aiEstimatorDescription}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>{t.fieldImagesLabel}</Label>
              <MultiFileUpload onFilesSelected={setEstimatorFiles} disabled={isEstimating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t.locationLabel}</Label>
              <Input 
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.locationPlaceholder}
                disabled={isEstimating}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleEstimate} className="w-full" disabled={isEstimating || estimatorFiles.length === 0 || !location}>
                {isEstimating ? (
                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                {isEstimating ? t.estimating : t.getAIEstimatesButton}
              </Button>
               <Button variant="ghost" onClick={() => setShowAiEstimator(false)} disabled={isEstimating}>
                {t.cancel}
              </Button>
            </div>
            {estimationError && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>{estimationError}</AlertDescription></Alert>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}