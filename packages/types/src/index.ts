/**
 * ----------------------------------------------------------------
 * > THE SINGLE SOURCE OF TRUTH FOR API CONTRACT TYPES <
 * ----------------------------------------------------------------
 * This file defines the shapes of data transferred between the
 * frontend and the backend. It does not contain database types,
 * which are managed internally by the Prisma client in the backend.
 * ----------------------------------------------------------------
 */

/**
 * Defines the structure for the metadata sent with a new diagnosis request.
 * The image file is sent as `multipart/form-data`, not in the JSON body.
 */
export interface DiagnosisRequest {
  language: 'en' | 'hi';
}

/**
 * Defines the structure of the analysis result returned by the backend API
 * after a new diagnosis is performed.
 */
export interface DiagnosisResult {
  disease_name: string;
  confidence: number;
  symptoms: string[];
  treatment: string;
  prevention: string;
  language: 'en' | 'hi';
}

/**
 * Defines the structure of a single diagnosis record as returned by the
 * GET /api/user/diagnoses history endpoint.
 */
export interface DiagnosisHistoryItem {
  id: string;
  user_id: string;
  image_url: string | null;
  disease_name: string | null;
  confidence: number | null;
  symptoms: string[];
  treatment: string | null;
  prevention: string | null;
  language: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}