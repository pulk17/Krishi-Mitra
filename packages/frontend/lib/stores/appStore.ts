import { create } from 'zustand';
import { apiClient, ApiClientError } from '@/lib/apiClient';
import { 
  DiagnosisResult, 
  DiagnosisRequest, 
  DiagnosisHistoryItem,
  YieldPredictionRequest,
  YieldPredictionResponse,
  EstimatedInputsResponse
} from '@krishi-mitra/types';

// --- STATE AND ACTIONS INTERFACES ---

interface DiagnosisHistorySlice {
  diagnoses: DiagnosisHistoryItem[];
  isLoadingHistory: boolean;
  historyError: string | null;
  fetchDiagnoses: () => Promise<void>;
  clearAllDiagnoses: () => Promise<void>;
}

interface DiagnosisFlowSlice {
  analysisResults: DiagnosisResult[] | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  analyzeMultiplePlants: (files: File[]) => Promise<void>;
  resetDiagnosis: () => void;
}

interface YieldPredictionSlice {
  predictedYield: number | null;
  isPredicting: boolean;
  predictionError: string | null;
  isEstimating: boolean;
  estimationError: string | null;
  predictYield: (features: YieldPredictionRequest) => Promise<void>;
  estimateInputs: (files: File[], location: string) => Promise<EstimatedInputsResponse | null>;
  resetPrediction: () => void;
}

// Combined state
type AppState = DiagnosisHistorySlice & DiagnosisFlowSlice & YieldPredictionSlice;

// --- ZUSTAND STORE CREATION ---

export const useAppStore = create<AppState>((set, get) => ({
  // --- Diagnosis History Slice ---
  diagnoses: [],
  isLoadingHistory: false, // Start as false
  historyError: null,
  fetchDiagnoses: async () => {
    // ADDED: This check prevents multiple fetches from running at the same time.
    if (get().isLoadingHistory) return;

    set({ isLoadingHistory: true, historyError: null });
    try {
      const data = await apiClient.get<DiagnosisHistoryItem[]>('/api/user/diagnoses');
      set({ diagnoses: data, isLoadingHistory: false });
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      const errorMessage = error instanceof ApiClientError ? error.message : 'Failed to load diagnosis history.';
      set({ historyError: errorMessage, isLoadingHistory: false });
    }
  },
  clearAllDiagnoses: async () => {
    set({ isLoadingHistory: true, historyError: null });
    try {
      await apiClient.delete('/api/user/diagnoses');
      set({ diagnoses: [], isLoadingHistory: false }); // Clear local state on success
    } catch (error) {
      console.error('Error clearing diagnoses:', error);
      const errorMessage = error instanceof ApiClientError ? error.message : 'Failed to clear diagnosis history.';
      set({ historyError: errorMessage, isLoadingHistory: false });
    }
  },

  // --- Diagnosis Flow Slice ---
  analysisResults: null,
  isAnalyzing: false,
  analysisError: null,
  analyzeMultiplePlants: async (files) => {
    set({ isAnalyzing: true, analysisError: null, analysisResults: null });
    try {
      const analysisPromises = files.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        // We no longer send language, as the backend provides a bilingual response by default
        return apiClient.postMultipart<DiagnosisResult>('/api/diagnose', formData);
      });

      const settledResults = await Promise.allSettled(analysisPromises);
      const successfulResults: DiagnosisResult[] = [];
      
      settledResults.forEach(result => {
        if (result.status === 'fulfilled') {
          successfulResults.push(result.value);
        } else {
          console.error("An individual analysis failed:", result.reason);
        }
      });
      
      if (successfulResults.length === 0) {
        throw new Error("All analyses failed. Please check the server logs.");
      }
      
      set({ analysisResults: successfulResults, isAnalyzing: false });
      // CRITICAL: Refresh the history list after a successful analysis
      await get().fetchDiagnoses();
      
    } catch (err) {
      console.error("Analysis process failed:", err);
      const errorMessage = err instanceof ApiClientError ? err.message : 'An unknown error occurred during analysis.';
      set({ analysisError: errorMessage, isAnalyzing: false });
    }
  },
  resetDiagnosis: () => {
    set({ analysisResults: null, analysisError: null, isAnalyzing: false });
  },
  
  // --- Yield Prediction Slice ---
  predictedYield: null,
  isPredicting: false,
  predictionError: null,
  isEstimating: false,
  estimationError: null,
  
  predictYield: async (features) => {
    set({ isPredicting: true, predictionError: null, predictedYield: null });
    try {
      const result = await apiClient.post<YieldPredictionResponse>('/api/predict/yield', features);
      set({ predictedYield: result.predicted_yield, isPredicting: false });
    } catch (err) {
      console.error("Yield prediction failed:", err);
      const errorMessage = err instanceof ApiClientError ? err.message : 'An unknown error occurred during prediction.';
      set({ predictionError: errorMessage, isPredicting: false });
    }
  },

  estimateInputs: async (files, location) => {
    set({ isEstimating: true, estimationError: null });
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      formData.append('location', location);
      
      const result = await apiClient.postMultipart<EstimatedInputsResponse>('/api/predict/estimate-inputs', formData);
      set({ isEstimating: false });
      return result;
    } catch (err) {
      console.error("Input estimation failed:", err);
      const errorMessage = err instanceof ApiClientError ? err.message : 'An unknown error occurred during estimation.';
      set({ estimationError: errorMessage, isEstimating: false });
      return null;
    }
  },
  
  resetPrediction: () => {
    set({ predictedYield: null, predictionError: null, isPredicting: false, estimationError: null, isEstimating: false });
  },
}));