'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, User2 } from 'lucide-react'
import api from '@/lib/api'
import CoachForm, { CoachFormInitial } from '@/components/admin/CoachForm'

export default function EditCoachPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [authChecked, setAuthChecked] = useState(false)
  const [coach, setCoach] = useState<CoachFormInitial | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Auth gate
  useEffect(() => {
    const userData =
      sessionStorage.getItem('userData') || localStorage.getItem('userData')
    const token =
      sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    if (!userData || !token) {
      router.push(`/login?redirect=/admin/coaches/${id ?? ''}/edit`)
      return
    }
    try {
      if (JSON.parse(userData).role !== 'admin') {
        router.push('/')
        return
      }
      setAuthChecked(true)
    } catch {
      router.push('/login?redirect=/admin/coaches')
    }
  }, [router, id])

  // Fetch coach
  useEffect(() => {
    if (!authChecked || !id) return
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setNotFound(false)
        const res = await api.get(`/coaches/${id}`)
        if (!cancelled) setCoach({ ...res.data, id })
      } catch (err: any) {
        if (!cancelled) {
          if (err?.response?.status === 404) setNotFound(true)
          else setNotFound(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authChecked, id])

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (notFound || !coach) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/admin/coaches"
              aria-label="Back to coaches"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Coach not found</h1>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl py-14 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <User2 className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              We couldn&apos;t find that coach. They may have been deleted.
            </p>
            <Link
              href="/admin/coaches"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
            >
              Back to all coaches
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <CoachForm mode="edit" initial={coach} />
}
