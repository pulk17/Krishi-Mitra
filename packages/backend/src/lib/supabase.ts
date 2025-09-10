import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * An admin client that uses the service_role_key.
 * Use this ONLY for server-side operations that require admin privileges,
 * such as interacting with Supabase Storage.
 *
 * IMPORTANT: DO NOT use this client for database queries. All database
 * operations should go through the Prisma client for type safety and
 * consistency.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Creates a new Supabase client for a specific user, using their JWT.
 * This client is used ONLY for JWT validation in middleware.
 *
 * IMPORTANT: DO NOT use this client for database queries.
 *
 * @param jwt The user's JWT.
 * @returns A Supabase client authenticated for the user.
 */
export const createSupabaseClient = (jwt: string): SupabaseClient => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};