'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  signup: (email: string, password: string, name: string) => Promise<User>
  googleLogin: (email: string, name: string, picture: string, googleId: string) => Promise<User>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize user from storage immediately (synchronously)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    
    console.log('🔍 AuthContext initializing...')
    
    // Try sessionStorage first
    let userData = sessionStorage.getItem('userData')
    console.log('  sessionStorage userData:', userData ? 'FOUND' : 'NOT FOUND')
    
    // Fall back to localStorage
    if (!userData) {
      userData = localStorage.getItem('userData')
      console.log('  localStorage userData:', userData ? 'FOUND' : 'NOT FOUND')
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('✅ User initialized from storage:', parsedUser.email)
        return parsedUser
      } catch (err) {
        console.error('Failed to parse user data on init', err)
        return null
      }
    }
    console.log('⚠️ No user data found in storage')
    return null
  })
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mark as loaded after a short delay to ensure user is initialized
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Restore session in background if needed
    const restoreSession = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
        const refreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken')
        
        console.log('Restoring session... token exists:', !!token, 'refreshToken exists:', !!refreshToken)
        
        // If we have a refresh token, restore Supabase session
        if (token && refreshToken) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: refreshToken,
            })
            if (error) {
              console.log('Could not restore Supabase session:', error.message)
            } else {
              console.log('✅ Supabase session restored successfully')
            }
          } catch (err) {
            console.log('Could not restore Supabase session:', err)
          }
        }
      } catch (err) {
        console.error('Session restore error:', err)
      }
    }

    restoreSession()

    // Listen for auth state changes (handles Google OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if we already have user data in storage
          const storedUserData = sessionStorage.getItem('userData') || localStorage.getItem('userData')
          if (storedUserData && !user) {
            try {
              const userData = JSON.parse(storedUserData)
              console.log('✅ Setting user from storage after SIGNED_IN:', userData.email)
              setUser(userData)
            } catch (err) {
              console.error('Failed to parse stored user data:', err)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          sessionStorage.removeItem('authToken')
          sessionStorage.removeItem('userData')
          sessionStorage.removeItem('refreshToken')
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      console.log('Login attempt to:', `${API_URL}/auth/login`)
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Login failed with error:', errorData)
        throw new Error(errorData.error?.message || errorData.message || 'Login failed')
      }

      const data = await response.json()
      console.log('Login successful, user data:', { email: data.data.user.email, role: data.data.user.role })
      
      const userData = {
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role || 'user',
        avatar: data.data.user.avatar,
      }
      setUser(userData)
      localStorage.setItem('authToken', data.data.token)
      localStorage.setItem('userData', JSON.stringify(userData))
      sessionStorage.setItem('authToken', data.data.token)
      sessionStorage.setItem('userData', JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<User> => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || errorData.message || 'Signup failed')
      }

      const data = await response.json()
      const userData = {
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role || 'user',
        avatar: data.data.user.avatar,
      }
      setUser(userData)
      localStorage.setItem('authToken', data.data.token)
      localStorage.setItem('userData', JSON.stringify(userData))
      sessionStorage.setItem('authToken', data.data.token)
      sessionStorage.setItem('userData', JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const googleLogin = async (email: string, name: string, picture: string, googleId: string): Promise<User> => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/auth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, picture, googleId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || errorData.message || 'Google login failed')
      }

      const data = await response.json()
      const userData = {
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role || 'user',
        avatar: data.data.user.avatar,
      }
      setUser(userData)
      // Store in both localStorage and sessionStorage for consistency
      localStorage.setItem('authToken', data.data.token)
      localStorage.setItem('userData', JSON.stringify(userData))
      sessionStorage.setItem('authToken', data.data.token)
      sessionStorage.setItem('userData', JSON.stringify(userData))
      console.log('✅ Google login successful, tokens stored in both storages')
      return userData
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('userData')
    sessionStorage.removeItem('refreshToken')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
