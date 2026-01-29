'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL fragment (Supabase redirects here with session data)
        const { data, error } = await supabase.auth.getSession()

        if (error) throw error

        if (data.session) {
          // Get user profile from users table
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          // Store user data
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email,
            name: profile?.name || data.session.user.user_metadata?.full_name || data.session.user.email,
            avatar: profile?.avatar || data.session.user.user_metadata?.avatar_url,
            role: profile?.role || 'user',
          }

          localStorage.setItem('authToken', data.session.access_token)
          localStorage.setItem('userData', JSON.stringify(userData))

          // Redirect to home or intended page
          const searchParams = new URLSearchParams(window.location.search)
          const redirect = searchParams.get('redirect') || '/'
          router.push(redirect)
        } else {
          // No session, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=auth_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  )
}
