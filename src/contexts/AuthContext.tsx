'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token and user data
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (err) {
        console.error('Failed to parse user data', err)
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      }
    }
    setIsLoading(false)
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
      localStorage.setItem('authToken', data.data.token)
      localStorage.setItem('userData', JSON.stringify(userData))
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
