import { useAuth } from '@/lib/auth/AuthProvider';
import type { DiagnosisHistoryItem } from '@krishi-mitra/types';

// Re-export useAuth so all auth-related hooks are in one place
export { useAuth };

// Re-export the shared type for convenience in other components.
// It was previously aliased as `Diagnosis`.
export type Diagnosis = DiagnosisHistoryItem;