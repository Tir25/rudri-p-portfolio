import type { User, Session } from '@supabase/supabase-js'

export interface SupabaseAuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  isOwner: boolean
  isAdmin: boolean
}
