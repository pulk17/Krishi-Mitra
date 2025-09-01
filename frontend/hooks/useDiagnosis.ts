"use client";

import { useState } from "react";
import { DiagnosisResult } from "@/lib/utils";

/**
 * Custom hook to manage the plant diagnosis API call and related state.
 * This encapsulates the logic for loading, error handling, and storing results,
 * keeping our components clean and focused on the UI.
 */
export function useDiagnosis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePlant = async (imageData: string, language: string) => {
    // Reset state before a new analysis
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: imageData,
          language: language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Analysis failed: ${response.statusText}`
        );
      }

      const data: DiagnosisResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to clear the result and error state to allow a new diagnosis
  const resetDiagnosis = () => {
    setResult(null);
    setError(null);
  };

  return {
    loading,
    result,
    error,
    analyzePlant,
    resetDiagnosis,
  };
}
