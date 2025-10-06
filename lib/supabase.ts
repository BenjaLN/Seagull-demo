import { createClient } from '@supabase/supabase-js'

const isMockMode = process.env.USE_MOCK === 'true'

// Check if we have the required environment variables
const hasSupabaseConfig = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const hasSupabaseAdminConfig = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.SUPABASE_SERVICE_ROLE_KEY

// Only initialize Supabase if not in mock mode and config is available
export const supabase = (isMockMode || !hasSupabaseConfig) ? null : createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// For server-side operations
export const supabaseAdmin = (isMockMode || !hasSupabaseAdminConfig) ? null : createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
