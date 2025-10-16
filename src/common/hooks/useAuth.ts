import { useAuth as useSupabaseAuth } from '@/lib/providers/SupabaseProvider'

export function useAuth() {
  return useSupabaseAuth()
}

export function useUser() {
  const { user, loading } = useAuth()
  return { user, loading }
}

export function useProfile() {
  const { profile, loading } = useAuth()
  return { profile, loading }
}

export function useSignOut() {
  const { signOut } = useAuth()
  return signOut
}
