// --- file: packages/backend/src/config/env.ts ---
import { z } from "zod";

const envSchema = z.object({
  // Prisma
  DATABASE_URL: z.string().url(),
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // Gemini
  GEMINI_API_KEY: z.string(),
  
  // Prediction Service
  PREDICTION_SERVICE_URL: z.string().url(),

  // Server
  PORT: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  FRONTEND_URL: z.string().optional()
});

export const env = envSchema.parse(process.env);