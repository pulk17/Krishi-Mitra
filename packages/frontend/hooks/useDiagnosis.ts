import { useAppStore } from '@/lib/stores/appStore';

/**
 * A hook that provides a clean interface to the diagnosis flow slice of the app store.
 * It selects and returns the state and actions related to performing a new diagnosis.
 */
export function useDiagnosis() {
  const loading = useAppStore((state) => state.isAnalyzing);
  const results = useAppStore((state) => state.analysisResults);
  const error = useAppStore((state) => state.analysisError);
  const analyzeMultiplePlants = useAppStore((state) => state.analyzeMultiplePlants);
  const resetDiagnosis = useAppStore((state) => state.resetDiagnosis);

  return {
    loading,
    results,
    error,
    analyzeMultiplePlants,
    resetDiagnosis,
  };
}