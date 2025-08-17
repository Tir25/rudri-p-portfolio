import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('🔍 Environment Variables Check:')
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing')
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Ensure URL is properly formatted
let cleanUrl = supabaseUrl.trim()
if (!cleanUrl.startsWith('https://')) {
  cleanUrl = `https://${cleanUrl}`
}
if (cleanUrl.endsWith('/')) {
  cleanUrl = cleanUrl.slice(0, -1)
}

console.log('🔧 Cleaned URL:', cleanUrl)

// Validate URL format
try {
  new URL(cleanUrl)
  console.log('✅ Supabase URL is valid')
} catch (error) {
  console.error('❌ Invalid Supabase URL:', cleanUrl)
  throw new Error(`Invalid Supabase URL: ${cleanUrl}`)
}

// Create Supabase client with explicit configuration
export const supabase = createClient(cleanUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

console.log('✅ Supabase client created successfully')
