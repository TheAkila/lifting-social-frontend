'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CoachForm from '@/components/admin/CoachForm'

export default function NewCoachPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const userData =
      sessionStorage.getItem('userData') || localStorage.getItem('userData')
    const token =
      sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    if (!userData || !token) {
      router.push('/login?redirect=/admin/coaches/new')
      return
    }
    try {
      if (JSON.parse(userData).role !== 'admin') {
        router.push('/')
        return
      }
      setAuthChecked(true)
    } catch {
      router.push('/login?redirect=/admin/coaches/new')
    }
  }, [router])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking access…</p>
      </div>
    )
  }

  return <CoachForm mode="create" />
}
