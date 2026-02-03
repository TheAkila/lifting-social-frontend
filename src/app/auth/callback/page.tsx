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
            
            // Check if user profile exists in website_users table (query by EMAIL, not ID)
            const { data: existingProfile } = await supabase
              .from('website_users')
              .select('*')
              .eq('email', session.user.email)
              .single()

            console.log('Existing profile check:', existingProfile)

            if (!existingProfile) {
              console.log('Creating new user profile in website_users')
              const { error: insertError } = await supabase
                .from('website_users')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email,
                    password: '', // Empty password for OAuth users
                    avatar: session.user.user_metadata?.avatar_url,
                    auth_provider: 'google',
                    google_id: session.user.user_metadata?.sub,
                    role: 'user',
                  },
                ])

              if (insertError) {
                console.warn('Profile insert error:', insertError)
              }
            }

            // Get the latest profile from website_users BY EMAIL (not ID)
            const { data: profile } = await supabase
              .from('website_users')
              .select('*')
              .eq('email', session.user.email)
              .single()

            console.log('Profile from database:', profile)
            console.log('Profile role:', profile?.role)

            // Sync user to backend database and get JWT token
            let backendToken = null
            let backendUserData = null
            
            try {
              const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
              console.log('🔄 Syncing user to backend:', session.user.email)
              console.log('   Request URL:', `${API_URL}/auth/google/callback`)
              
              const backendResponse = await fetch(`${API_URL}/auth/google/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: session.user.email,
                  name: session.user.user_metadata?.full_name || session.user.email,
                  avatar: session.user.user_metadata?.avatar_url,
                  googleId: session.user.user_metadata?.sub
                })
              })
              
              console.log('   Response status:', backendResponse.status)
              const responseText = await backendResponse.text()
              console.log('   Response text:', responseText)
              
              if (backendResponse.ok) {
                try {
                  const backendData = JSON.parse(responseText)
                  console.log('✅ Backend response parsed:', backendData)
                  
                  backendToken = backendData.data?.token || backendData.token
                  backendUserData = backendData.data?.user || backendData.user
                  
                  if (backendToken) {
                    console.log('✅ Got backend JWT token (length:', backendToken.length, ')')
                    console.log('   Token preview:', backendToken.substring(0, 50) + '...')
                  } else {
                    console.error('❌ No token in backend response - response structure:', Object.keys(backendData))
                  }
                } catch (parseErr) {
                  console.error('❌ Failed to parse backend response:', parseErr)
                }
              } else {
                console.error('❌ Backend sync failed with status:', backendResponse.status)
                console.error('   Response body:', responseText)
              }
            } catch (err) {
              console.error('❌ Network error calling backend:', err)
            }

            // Store user data - ALWAYS use Supabase profile role as source of truth
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: profile?.name || backendUserData?.name || session.user.user_metadata?.full_name || session.user.email,
              avatar: profile?.avatar || backendUserData?.avatar || session.user.user_metadata?.avatar_url,
              role: profile?.role || 'user', // Always use database role as source of truth
            }

            console.log('Storing user data:', userData)
            console.log('User role:', userData.role)
            
            // Store Supabase tokens FIRST (for session restoration)
            localStorage.setItem('supabaseToken', session.access_token)
            localStorage.setItem('refreshToken', refreshToken || '')
            sessionStorage.setItem('supabaseToken', session.access_token)
            sessionStorage.setItem('refreshToken', refreshToken || '')
            
            // Store the BACKEND JWT token for API calls
            if (backendToken) {
              // Verify it's a valid JWT (not a Supabase token)
              if (backendToken.length > 500) {
                console.error('❌ CRITICAL: Backend returned a Supabase-like token (length > 500)')
                console.error('   This will cause 401 errors. NOT storing this token.')
                console.error('   User will need to re-authenticate.')
              } else {
                localStorage.setItem('authToken', backendToken)
                sessionStorage.setItem('authToken', backendToken)
                console.log('✅ Backend JWT token stored (length:', backendToken.length, ')')
              }
            } else {
              console.error('❌ NO BACKEND TOKEN RECEIVED')
              console.error('   Backend may have failed to create user or return token')
              console.error('   NOT storing any token - user will get 401 errors on API calls')
              console.error('   User should try logging in again or contact support')
              // DO NOT store Supabase token as fallback
              // This was the root cause of 401 errors
            }
            
            // Store user data
            localStorage.setItem('userData', JSON.stringify(userData))
            sessionStorage.setItem('userData', JSON.stringify(userData))
            
            // Force a microtask to ensure storage is written
            await new Promise(resolve => setTimeout(resolve, 50))
            
            // Verify storage with detailed logging
            const storedToken = sessionStorage.getItem('authToken')
            const storedData = sessionStorage.getItem('userData')
            const storedSupabaseToken = sessionStorage.getItem('supabaseToken')
            const storedRefreshToken = sessionStorage.getItem('refreshToken')
            
            console.log('=== VERIFICATION BEFORE REDIRECT ===')
            console.log('✅ authToken stored:', storedToken ? 'YES (length: ' + storedToken.length + ')' : 'NO')
            console.log('✅ supabaseToken stored:', storedSupabaseToken ? 'YES (length: ' + storedSupabaseToken.length + ')' : 'NO')
            console.log('✅ refreshToken stored:', storedRefreshToken ? 'YES (length: ' + storedRefreshToken.length + ')' : 'NO')
            console.log('✅ userData stored:', storedData ? JSON.parse(storedData).email : 'NOT FOUND')
            console.log('===================================')
            
            // Double-check localStorage too
            console.log('=== LOCALSTORAGE CHECK ===')
            console.log('authToken:', !!localStorage.getItem('authToken'))
            console.log('supabaseToken:', !!localStorage.getItem('supabaseToken'))
            console.log('userData:', !!localStorage.getItem('userData'))
            console.log('==========================')
            
            console.log('✅ Authentication successful!')
            console.log('🚀 Checking role for redirect...')
            console.log('User role:', userData.role)
            
            // Redirect based on role
            if (userData.role === 'admin') {
              console.log('👑 Admin user - redirecting to /admin')
              window.location.href = '/admin'
            } else {
              console.log('👤 Regular user - redirecting to home page')
              window.location.href = '/'
            }
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
