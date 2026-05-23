'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GOOGLE_OAUTH_STATE_KEY } from '@/lib/googleAuth'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const returnedState = params.get('state')
        const oauthError = params.get('error')

        if (oauthError) {
          throw new Error(oauthError === 'access_denied' ? 'Sign in was cancelled.' : oauthError)
        }
        if (!code) {
          throw new Error('No authorization code returned. Please try signing in again.')
        }

        // CSRF check: state must match what we stored before redirecting to Google.
        const savedState = sessionStorage.getItem(GOOGLE_OAUTH_STATE_KEY)
        if (!returnedState || returnedState !== savedState) {
          throw new Error('Invalid sign-in state. Please try again.')
        }
        sessionStorage.removeItem(GOOGLE_OAUTH_STATE_KEY)

        // The backend exchanges the code with Google (using the client secret),
        // upserts the user, and returns our application JWT. It is the single
        // source of truth for the user's id and role.
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const redirectUri = `${window.location.origin}/auth/callback`

        const response = await fetch(`${API_URL}/auth/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri }),
        })

        if (!response.ok) {
          const body = await response.text().catch(() => '')
          console.error('Google sync failed:', response.status, body)
          throw new Error('Could not complete sign in. Please try again.')
        }

        const data = await response.json()
        const user = data.data?.user || data.user
        const token = data.data?.token || data.token

        if (!token || !user) {
          throw new Error('Could not complete sign in (no token returned). Please try again.')
        }

        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role || 'user',
        }

        localStorage.setItem('authToken', token)
        sessionStorage.setItem('authToken', token)
        localStorage.setItem('userData', JSON.stringify(userData))
        sessionStorage.setItem('userData', JSON.stringify(userData))

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
  }, [router])

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
