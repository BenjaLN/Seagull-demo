import { createClient } from '@supabase/supabase-js'

const isMockMode = process.env.USE_MOCK === 'true'

// Only initialize Supabase if not in mock mode
export const supabase = isMockMode ? null : createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// For server-side operations
export const supabaseAdmin = isMockMode ? null : createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
