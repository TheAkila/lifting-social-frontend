'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import Logo from '@/components/layout/Logo'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  
  const router = useRouter()

  // Hide navbar, announcement bar, and footer
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const navbar = document.querySelector('nav') as HTMLElement | null
    const announcement = document.querySelector('nav')?.previousElementSibling as HTMLElement | null
    const footer = document.querySelector('footer') as HTMLElement | null
    
    if (navbar) navbar.style.display = 'none'
    if (announcement) announcement.style.display = 'none'
    if (footer) footer.style.display = 'none'

    return () => {
      document.body.style.overflow = 'auto'
      if (navbar) navbar.style.display = ''
      if (announcement) announcement.style.display = ''
      if (footer) footer.style.display = ''
    }
  }, [])

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    
    try {
      // Use Supabase OAuth for Google
      await signInWithGoogle()
      // Supabase will handle the redirect to /auth/callback
    } catch (err: any) {
      console.error('Google sign in error:', err)
      setError(err.message || 'Google sign in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md my-auto"
      >
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Logo />
            </div>
            <p className="text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-700">Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm text-gray-700">Sign in with Google</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

