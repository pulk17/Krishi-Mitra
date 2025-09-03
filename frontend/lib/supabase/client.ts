import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { env } from '@/lib/config/env'

export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey)
}