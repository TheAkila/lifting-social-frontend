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
        // Implicit OAuth flow returns tokens in the URL hash fragment.
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token') || ''

        if (!accessToken) {
          throw new Error('No authentication data found. Please try signing in again.')
        }

        // Establish the Supabase session from the URL tokens.
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) throw sessionError
        if (!session?.user) throw new Error('No user in session')

        const supabaseUser = session.user

        // Sync the user to our backend and get the application JWT.
        // The backend uses the service-role key, so it is the single source of
        // truth for the user's id and role (the anon client cannot read the
        // website_users table because RLS is enabled with no public policy).
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

        const backendResponse = await fetch(`${API_URL}/auth/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: supabaseUser.id, // align website_users.id with the Supabase auth uid
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
            avatar: supabaseUser.user_metadata?.avatar_url,
            googleId: supabaseUser.user_metadata?.sub,
          }),
        })

        if (!backendResponse.ok) {
          const body = await backendResponse.text().catch(() => '')
          console.error('Backend sync failed:', backendResponse.status, body)
          throw new Error('Could not complete sign in. Please try again.')
        }

        const backendData = await backendResponse.json()
        const backendUser = backendData.data?.user || backendData.user
        const backendToken = backendData.data?.token || backendData.token

        if (!backendToken) {
          throw new Error('Could not complete sign in (no token returned). Please try again.')
        }

        // The backend response is authoritative for id and role.
        const userData = {
          id: backendUser?.id || supabaseUser.id,
          email: supabaseUser.email,
          name: backendUser?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email,
          avatar: backendUser?.avatar || supabaseUser.user_metadata?.avatar_url,
          role: backendUser?.role || 'user',
        }

        // Supabase tokens are used to restore the Supabase session; the backend
        // JWT (authToken) is used as the Bearer token for our own API. Never
        // store the Supabase token under authToken.
        localStorage.setItem('supabaseToken', session.access_token)
        localStorage.setItem('refreshToken', session.refresh_token || '')
        sessionStorage.setItem('supabaseToken', session.access_token)
        sessionStorage.setItem('refreshToken', session.refresh_token || '')

        localStorage.setItem('authToken', backendToken)
        sessionStorage.setItem('authToken', backendToken)

        localStorage.setItem('userData', JSON.stringify(userData))
        sessionStorage.setItem('userData', JSON.stringify(userData))

        // Redirect based on the authoritative role.
        window.location.href = userData.role === 'admin' ? '/admin' : '/'
      } catch (err: any) {
        console.error('Auth callback error:', err)
        setError(err.message || 'Authentication failed')
        setTimeout(() => {
          router.push('/login?error=auth_failed')
        }, 2500)
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
