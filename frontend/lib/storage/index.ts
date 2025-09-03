import { DataStorageService } from './types'
import { LocalStorageService } from './localStorage'
import { SupabaseStorageService } from './supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/database.types'

export function createStorageService(
  supabase?: SupabaseClient<Database>,
  userId?: string
): DataStorageService {
  if (supabase && userId) {
    return new SupabaseStorageService(supabase, userId)
  }
  return new LocalStorageService()
}

export * from './types'