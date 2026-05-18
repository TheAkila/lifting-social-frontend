'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Edit2,
  Loader2,
  Plus,
  Star,
  Trash2,
  User2,
  X,
} from 'lucide-react'
import api from '@/lib/api'

interface Coach {
  id: string
  name: string
  title: string
  bio: string
  specializations: string[]
  certifications: string[]
  experience: number
  availability: string
  email: string
  phone: string
  image?: string
  featured: boolean
  champions_count: number
}

export default function AdminCoachesPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const userData =
      sessionStorage.getItem('userData') || localStorage.getItem('userData')
    const token =
      sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    if (!userData || !token) {
      router.push('/login?redirect=/admin/coaches')
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
  }, [router])

  const loadCoaches = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/coaches')
      setCoaches(Array.isArray(res.data) ? res.data : [])
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load coaches')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authChecked) loadCoaches()
  }, [authChecked, loadCoaches])

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      await api.delete(`/coaches/${id}`)
      setDeleteId(null)
      setSuccess('Coach deleted')
      setTimeout(() => setSuccess(''), 2500)
      await loadCoaches()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete coach')
    } finally {
      setDeleting(false)
    }
  }

  const orderedCoaches = useMemo(() => {
    return [...coaches].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return a.name.localeCompare(b.name)
    })
  }, [coaches])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking access…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              aria-label="Back to admin"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coaches</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage the public coaching team displayed on /coaching.
              </p>
            </div>
          </div>
          <Link
            href="/admin/coaches/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            New coach
          </Link>
        </div>

        {error && (
          <Toast tone="error" message={error} onDismiss={() => setError('')} />
        )}
        {success && (
          <Toast tone="success" message={success} onDismiss={() => setSuccess('')} />
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          </div>
        ) : orderedCoaches.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-14 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <User2 className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No coaches yet</h3>
            <p className="mt-1 text-sm text-gray-500">Add your first coach to get started.</p>
            <Link
              href="/admin/coaches/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add coach
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {orderedCoaches.map((coach) => (
              <li
                key={coach.id}
                className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
                  {coach.image ? (
                    <Image
                      src={coach.image}
                      alt={coach.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <User2 className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {coach.name}
                    </h3>
                    {coach.featured && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{coach.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                    {coach.champions_count ?? 0} champions · {coach.experience ?? 0} yrs ·{' '}
                    {coach.email}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/coaches/${coach.id}/edit`}
                    aria-label="Edit coach"
                    className="p-1.5 rounded text-gray-500 hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteId(coach.id)}
                    aria-label="Delete coach"
                    className="p-1.5 rounded text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete coach?</h3>
            <p className="text-sm text-gray-600 mb-5">
              This permanently removes the coach profile. Cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg font-medium"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Toast({
  tone,
  message,
  onDismiss,
}: {
  tone: 'error' | 'success'
  message: string
  onDismiss: () => void
}) {
  const cls =
    tone === 'error'
      ? 'bg-red-50 border-red-200 text-red-700'
      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 p-3 border rounded-lg ${cls}`}
    >
      <p className="text-sm">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="opacity-60 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
