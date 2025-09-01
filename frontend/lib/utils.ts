import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Centralized type definitions for the application.
 */
export interface DiagnosisResult {
  id: string;
  disease_name: string;
  description: string;
  treatment: string[];
  confidence: number;
  timestamp: string;
}