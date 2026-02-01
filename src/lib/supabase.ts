import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axhbgtkdvghjxtrcvbkc.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_xnUzm6KXwue9mOknruojcQ_HpDC2dGM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    })

    if (authError) throw authError

    // Update user profile in website_users table
    if (authData.user) {
      const { error: updateError } = await supabase
        .from('website_users')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            auth_provider: 'email',
            is_active: true,
          },
        ])

      if (updateError && updateError.code !== 'PGRST116') {
        // Ignore duplicate key error
        throw updateError
      }
    }

    return {
      user: authData.user,
      session: authData.session,
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    throw error
  }
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return {
      user: data.user,
      session: data.session,
    }
  } catch (error: any) {
    console.error('Sign in error:', error)
    throw error
  }
}

/**
 * Sign in with Google via Supabase
 */
export const signInWithGoogle = async () => {
  try {
    // Get the correct redirect URL
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3001/auth/callback'
    
    console.log('Initiating OAuth with redirect URL:', redirectUrl)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) throw error

    console.log('OAuth redirect initiated:', data)
    return data
  } catch (error: any) {
    console.error('Google sign in error:', error)
    throw error
  }
}

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) throw error

    if (data.user) {
      // Get user profile from website_users table
      const { data: profile, error: profileError } = await supabase
        .from('website_users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      return {
        user: data.user,
        profile,
      }
    }

    return null
  } catch (error: any) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error: any) {
    console.error('Sign out error:', error)
    throw error
  }
}

/**
 * Listen for auth state changes
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      // Get user profile
      const { data: profile } = await supabase
        .from('website_users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      callback({
        ...session.user,
        ...profile,
      })
    } else {
      callback(null)
    }
  })

  return () => {
    subscription?.unsubscribe()
  }
}
