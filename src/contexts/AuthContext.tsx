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
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function readStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem('userData') || localStorage.getItem('userData')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function storeSession(user: User, token: string) {
  localStorage.setItem('authToken', token)
  localStorage.setItem('userData', JSON.stringify(user))
  sessionStorage.setItem('authToken', token)
  sessionStorage.setItem('userData', JSON.stringify(user))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Session = our backend JWT + userData in storage (no Supabase session).
  const [user, setUser] = useState<User | null>(() => readStoredUser())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || errorData.message || 'Login failed')
    }

    const data = await response.json()
    const payload = data.data || data
    const userData: User = {
      id: payload.user.id,
      email: payload.user.email,
      name: payload.user.name,
      role: payload.user.role || 'user',
      avatar: payload.user.avatar,
    }
    storeSession(userData, payload.token)
    setUser(userData)
    return userData
  }

  const signup = async (email: string, password: string, name: string): Promise<User> => {
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
    const payload = data.data || data
    const userData: User = {
      id: payload.user.id,
      email: payload.user.email,
      name: payload.user.name,
      role: payload.user.role || 'user',
      avatar: payload.user.avatar,
    }
    storeSession(userData, payload.token)
    setUser(userData)
    return userData
  }

  const logout = () => {
    setUser(null)
    for (const key of ['authToken', 'userData', 'refreshToken', 'supabaseToken']) {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
