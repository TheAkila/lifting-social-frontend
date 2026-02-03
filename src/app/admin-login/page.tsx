'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async () => {
    setLoading(true)
    
    try {
      // Query the admin user from database
      const { data: adminUser, error } = await supabase
        .from('website_users')
        .select('*')
        .eq('email', 'nishanakila10@gmail.com')
        .single()

      if (error || !adminUser) {
        alert('Admin user not found')
        setLoading(false)
        return
      }

      if (adminUser.role !== 'admin') {
        alert('User is not an admin')
        setLoading(false)
        return
      }

      // Set session data
      const userData = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }

      localStorage.setItem('userData', JSON.stringify(userData))
      sessionStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('authToken', 'admin-bypass-token')
      sessionStorage.setItem('authToken', 'admin-bypass-token')

      // Redirect to admin
      router.push('/admin')
      
    } catch (err: any) {
      console.error('Login error:', err)
      alert('Login failed: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
        
        <p className="text-gray-600 text-center mb-6">
          Click below to login as admin
        </p>

        <button
          onClick={handleAdminLogin}
          disabled={loading}
          className="w-full bg-zinc-900 text-white py-3 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login as Admin</span>
          )}
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Email: nishanakila10@gmail.com
        </p>
      </div>
    </div>
  )
}
