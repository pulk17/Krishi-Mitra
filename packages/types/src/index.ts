/**
 * ----------------------------------------------------------------
 * > THE SINGLE SOURCE OF TRUTH FOR API CONTRACT TYPES <
 * ----------------------------------------------------------------
 */

// --- DISEASE DIAGNOSIS TYPES ---

/**
 * The bilingual output for a single diagnosis.
 */
export interface DiagnosisContent {
  disease_name: string;
  symptoms: string[];
  treatment: string;
  prevention: string;
  advice?: string; // For healthy plants
}

/**
 * The new, enhanced structure of the analysis result returned by the backend API.
 */
export interface DiagnosisResult {
  is_healthy: boolean;
  confidence: number;
  en: DiagnosisContent;
  hi: DiagnosisContent;
}

/**
 * Defines the structure for the metadata sent with a new disease diagnosis request.
 */
export interface DiagnosisRequest {
  language: 'en' | 'hi';
}

/**
 * Defines the structure of a single diagnosis record as returned from the database.
 * It now includes the 'details' JSON field for the full bilingual data.
 */
export interface DiagnosisHistoryItem {
  id: string;
  user_id: string;
  image_url: string | null;
  disease_name: string | null; // Legacy/display name (in English)
  confidence: number | null;
  symptoms: string[]; // Legacy symptoms (in English)
  treatment: string | null; // Legacy treatment (in English)
  prevention: string | null; // Legacy prevention (in English)
  language: string | null; // Legacy field
  created_at: string;
  updated_at: string;
  details: DiagnosisResult | null; // The new field for rich bilingual data
}


// --- YIELD PREDICTION TYPES ---

export interface YieldPredictionRequest {
  Rainfall_mm: number;
  Rainfall_Intensity: number;
  Agricultural_Input_Score: number;
  Temp_Rainfall_Interaction: number;
  Temperature_Celsius: number;
  Days_to_Harvest: number;
  Growing_Degree_Days: number;
  Temperature_Stress_Index: number;
}

export interface YieldPredictionResponse {
  predicted_yield: number;
}

export type EstimatedInputsResponse = Partial<YieldPredictionRequest>;