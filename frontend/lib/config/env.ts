export interface EnvironmentConfig {
  supabaseUrl: string
  supabaseAnonKey: string
}

export function validateEnvironment(): EnvironmentConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }

  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }

  return {
    supabaseUrl,
    supabaseAnonKey
  }
}

export const env = validateEnvironment()