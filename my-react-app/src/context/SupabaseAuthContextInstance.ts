import { createContext } from 'react'
import type { SupabaseAuthContextType } from './SupabaseAuthContextTypes'

export const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)
