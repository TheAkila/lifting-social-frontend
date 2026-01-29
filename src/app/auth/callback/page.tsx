'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { login: contextLogin } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback page loaded')
        console.log('Current URL:', window.location.href)
        
        // Check if there's a hash fragment with auth data
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        console.log('Hash params:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken 
        })

        if (accessToken) {
          // Set the session from the tokens in the URL
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })

          if (sessionError) {
            console.error('Session set error:', sessionError)
            throw sessionError
          }

          if (session?.user) {
            console.log('Session established, user:', session.user.email)
            
            // Create or update user profile in users table
            const { data: existingProfile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (!existingProfile) {
              console.log('Creating new user profile')
              const { error: insertError } = await supabase
                .from('users')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email,
                    avatar: session.user.user_metadata?.avatar_url,
                    auth_provider: 'google',
                    google_id: session.user.user_metadata?.sub,
                    is_active: true,
                  },
                ])

              if (insertError) {
                console.warn('Profile insert error:', insertError)
              }
            }

            // Get the latest profile
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            // Store user data in localStorage
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: profile?.name || session.user.user_metadata?.full_name || session.user.email,
              avatar: profile?.avatar || session.user.user_metadata?.avatar_url,
              role: profile?.role || 'user',
            }

            console.log('Storing user data:', userData)
            localStorage.setItem('authToken', session.access_token)
            localStorage.setItem('refreshToken', refreshToken || '')
            localStorage.setItem('userData', JSON.stringify(userData))
            
            // Also store in sessionStorage for immediate access
            sessionStorage.setItem('authToken', session.access_token)
            sessionStorage.setItem('refreshToken', refreshToken || '')
            sessionStorage.setItem('userData', JSON.stringify(userData))
            
            // Verify storage
            console.log('✅ Verified storage:')
            console.log('  sessionStorage userData:', sessionStorage.getItem('userData'))
            console.log('  localStorage userData:', localStorage.getItem('userData'))

            console.log('✅ Authentication successful! Redirecting to home...')
            
            // Redirect to home
            setTimeout(() => {
              router.push('/')
            }, 500)
          } else {
            throw new Error('No user in session')
          }
        } else {
          // Check if there's already a session (shouldn't happen but just in case)
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            console.log('Existing session found')
            localStorage.setItem('authToken', session.access_token)
            router.push('/')
          } else {
            console.log('No access token in URL and no existing session')
            throw new Error('No authentication data found')
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setError(error.message)
        setTimeout(() => {
          router.push('/login?error=auth_failed')
        }, 2000)
      }
    }

    handleCallback()
  }, [router, contextLogin])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  )
}
