import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient as createSSRClient } from '@supabase/ssr'
import type { Database } from './types'
import { getEnvConfig } from '@/common/utils/env'

const { supabaseUrl, supabaseAnonKey } = getEnvConfig()

// Client-side Supabase client (for use in client components)
export const createClientComponentClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client (for use in server components and API routes)
export const createServerClient = async () => {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  
  return createSSRClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })
}

// Admin client with service role key (for server-side operations)
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Legacy client for backward compatibility
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
