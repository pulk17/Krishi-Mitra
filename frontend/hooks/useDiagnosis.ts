"use client";
import { useState } from "react";
import { DiagnosisResult } from "@/lib/utils";
import { useDiagnoses } from "./useSupabase";

/**
 * Custom hook to manage the plant diagnosis API call and related state.
 * This now uses the Next.js API route as a proxy to avoid CORS issues.
 */
export function useDiagnosis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { saveDiagnosis } = useDiagnoses();

  const analyzePlant = async (imageData: string, language: string) => {
    if (!result) {
      setLoading(true);
    }
    setError(null);

    try {
      // Call the Next.js API proxy route instead of the direct backend URL
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: imageData,
          language: language,
        }),
         cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Analysis failed: ${response.statusText}`
        );
      }

      const data: DiagnosisResult = await response.json();
      setResult(data);
      
      if (data) {
        saveDiagnosis({
          image_url: imageData.substring(0, 100) + '...', // Truncate for storage
          disease_name: data.disease_name || null,
          confidence: data.confidence || 0,
          symptoms: data.symptoms || null,
          treatment: data.treatment || null,
          prevention: data.prevention || null,
          language: language
        }).catch(console.error);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please try again."
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const analyzeMultiplePlants = async (imageDataArray: string[], language: string) => {
    setLoading(true);
    setError(null);
    
    const results: DiagnosisResult[] = [];
    try {
      for (const imageData of imageDataArray) {
        // Call the proxy for each image
        const response = await fetch("/api/diagnose", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: imageData,
            language: language,
          }),
          cache: 'no-store'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || `Analysis failed: ${response.statusText}`
          );
        }

        const data: DiagnosisResult = await response.json();
        results.push(data);
        
        if (data) {
          saveDiagnosis({
            image_url: imageData.substring(0, 100) + '...', // Truncate for storage
            disease_name: data.disease_name || null,
            confidence: data.confidence || 0,
            symptoms: data.symptoms || null,
            treatment: data.treatment || null,
            prevention: data.prevention || null,
            language: language
          }).catch(console.error);
        }
      }
      
      if (results.length > 0) {
        setResult(results[results.length - 1]);
      }
      
      return results;
    } catch (err) {
      console.error("Multi-analysis failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please try again."
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const resetDiagnosis = () => {
    setResult(null);
    setError(null);
  };

  return {
    loading,
    result,
    error,
    analyzePlant,
    analyzeMultiplePlants,
    resetDiagnosis,
  };
}