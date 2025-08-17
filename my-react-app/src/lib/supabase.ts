import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('🔍 Environment Variables Check:')
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing')
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing')

// Validate URL format
if (supabaseUrl) {
  try {
    new URL(supabaseUrl)
    console.log('✅ Supabase URL is valid')
  } catch (error) {
    console.error('❌ Invalid Supabase URL:', supabaseUrl)
    throw new Error(`Invalid Supabase URL: ${supabaseUrl}`)
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Ensure URL ends with trailing slash for Supabase
const normalizedUrl = supabaseUrl.endsWith('/') ? supabaseUrl : `${supabaseUrl}/`

export const supabase = createClient(normalizedUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web/2.55.0'
    }
  }
})
