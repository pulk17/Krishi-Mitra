// Debug environment variables
export function debugEnv() {
  console.log('Environment Debug:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    // Show first few characters for debugging
    URL_PREVIEW: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
    KEY_PREVIEW: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
  })
}