import { create } from 'zustand';
import { apiClient, ApiClientError } from '@/lib/apiClient';
import { DiagnosisResult, DiagnosisRequest, DiagnosisHistoryItem } from '@krishi-mitra/types';

// --- STATE AND ACTIONS INTERFACES ---

interface DiagnosisHistorySlice {
  diagnoses: DiagnosisHistoryItem[];
  isLoadingHistory: boolean;
  historyError: string | null;
  fetchDiagnoses: () => Promise<void>;
}

interface DiagnosisFlowSlice {
  analysisResults: DiagnosisResult[] | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  analyzeMultiplePlants: (files: File[], language: DiagnosisRequest['language']) => Promise<void>;
  resetDiagnosis: () => void;
}

// Combined state
type AppState = DiagnosisHistorySlice & DiagnosisFlowSlice;

// --- ZUSTAND STORE CREATION ---

export const useAppStore = create<AppState>((set, get) => ({
  // --- Diagnosis History Slice ---
  diagnoses: [],
  isLoadingHistory: true,
  historyError: null,
  fetchDiagnoses: async () => {
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

  // --- Diagnosis Flow Slice ---
  analysisResults: null,
  isAnalyzing: false,
  analysisError: null,
  analyzeMultiplePlants: async (files, language) => {
    set({ isAnalyzing: true, analysisError: null, analysisResults: null });
    try {
      const analysisPromises = files.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('language', language);
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
        throw new Error("All analyses failed. Please try again or check the server logs.");
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
}));