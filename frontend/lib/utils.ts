import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Centralized type definition for the diagnosis result.
 * This now matches the backend API response exactly.
 */
export interface DiagnosisResult {
  id: string;
  disease_name: string;
  description: string;
  symptoms: string[];
  treatment: string;
  prevention: string;
  confidence: number;
  timestamp: string;
}