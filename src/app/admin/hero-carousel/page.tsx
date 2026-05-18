'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

interface HeroSlide {
  id: string
  image_url: string
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at?: string
}

const apiBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const getToken = () =>
  (typeof window !== 'undefined' &&
    (sessionStorage.getItem('authToken') || localStorage.getItem('authToken'))) ||
  ''

export default function HeroCarouselAdminPage() {
  const router = useRouter()

  const [authChecked, setAuthChecked] = useState(false)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [linkDrafts, setLinkDrafts] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const storedUserData =
      sessionStorage.getItem('userData') || localStorage.getItem('userData')
    const storedToken =
      sessionStorage.getItem('authToken') || localStorage.getItem('authToken')

    if (!storedUserData || !storedToken) {
      router.push('/login?redirect=/admin/hero-carousel')
      return
    }
    try {
      const parsed = JSON.parse(storedUserData)
      if (parsed.role !== 'admin') {
        router.push('/')
        return
      }
      setAuthChecked(true)
    } catch {
      router.push('/login?redirect=/admin/hero-carousel')
    }
  }, [router])

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiBase()}/hero-carousel?all=true`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error('Failed to load slides')
      const json = await res.json()
      const items: HeroSlide[] = Array.isArray(json?.data) ? json.data : []
      setSlides(items)
      setLinkDrafts(
        items.reduce<Record<string, string>>((acc, s) => {
          acc[s.id] = s.link_url ?? ''
          return acc
        }, {})
      )
    } catch (err: any) {
      setError(err?.message || 'Failed to load slides')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authChecked) fetchSlides()
  }, [authChecked, fetchSlides])

  const flashSuccess = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleUpload = async (file: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, GIF, WebP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    try {
      setError('')
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)
      if (newLinkUrl.trim()) formData.append('link_url', newLinkUrl.trim())

      const res = await fetch(`${apiBase()}/hero-carousel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Upload failed: ${txt || res.statusText}`)
      }

      setNewLinkUrl('')
      flashSuccess('Slide uploaded')
      await fetchSlides()
    } catch (err: any) {
      setError(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const persistOrder = async (next: HeroSlide[]) => {
    const payload = next.map((s, idx) => ({ id: s.id, display_order: idx }))
    try {
      const res = await fetch(`${apiBase()}/hero-carousel/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ slides: payload }),
      })
      if (!res.ok) throw new Error('Reorder failed')
      flashSuccess('Order saved')
    } catch (err: any) {
      setError(err?.message || 'Reorder failed')
      await fetchSlides()
    }
  }

  const moveSlide = (id: string, dir: -1 | 1) => {
    const idx = slides.findIndex((s) => s.id === id)
    if (idx < 0) return
    const target = idx + dir
    if (target < 0 || target >= slides.length) return

    const next = [...slides]
    const [moved] = next.splice(idx, 1)
    next.splice(target, 0, moved)
    const reindexed = next.map((s, i) => ({ ...s, display_order: i }))
    setSlides(reindexed)
    persistOrder(reindexed)
  }

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      setSavingId(slide.id)
      const res = await fetch(`${apiBase()}/hero-carousel/${slide.id}/active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ is_active: !slide.is_active }),
      })
      if (!res.ok) throw new Error('Toggle failed')
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, is_active: !slide.is_active } : s))
      )
    } catch (err: any) {
      setError(err?.message || 'Toggle failed')
    } finally {
      setSavingId(null)
    }
  }

  const handleSaveLink = async (slide: HeroSlide) => {
    const draft = (linkDrafts[slide.id] ?? '').trim()
    try {
      setSavingId(slide.id)
      const res = await fetch(`${apiBase()}/hero-carousel/${slide.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ link_url: draft }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, link_url: draft || null } : s))
      )
      flashSuccess('Link updated')
    } catch (err: any) {
      setError(err?.message || 'Save failed')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setSavingId(id)
      const res = await fetch(`${apiBase()}/hero-carousel/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      setDeleteConfirmId(null)
      flashSuccess('Slide deleted')
      await fetchSlides()
    } catch (err: any) {
      setError(err?.message || 'Delete failed')
    } finally {
      setSavingId(null)
    }
  }

  const activeCount = useMemo(() => slides.filter((s) => s.is_active).length, [slides])

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Checking access…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Hero Carousel</h1>
          <p className="text-gray-600">
            Manage the rotating posters shown in the home page hero. {activeCount} active /{' '}
            {slides.length} total.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start justify-between gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Upload card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a new slide</h2>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Optional link URL
          </label>
          <div className="relative mb-4">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://example.com or /events/jothi-unplugged"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleUpload(f)
                e.target.value = ''
              }}
              disabled={uploading}
              className="hidden"
              id="hero-upload"
            />
            <label htmlFor="hero-upload" className="cursor-pointer block">
              {uploading ? (
                <div className="flex flex-col items-center gap-3 text-blue-700">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <span className="font-medium">Uploading…</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-600">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="font-semibold text-gray-900">Drop image here or click to select</span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF, WebP · max 10MB · portrait poster recommended (3:4)
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Slides list */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Slides</h2>

          {loading ? (
            <div className="text-center py-10">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600 text-sm">Loading slides…</p>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No slides yet. Upload your first image above.
            </div>
          ) : (
            <ul className="space-y-3">
              {slides.map((slide, idx) => {
                const isFirst = idx === 0
                const isLast = idx === slides.length - 1
                const isSaving = savingId === slide.id

                return (
                  <li
                    key={slide.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50"
                  >
                    <div className="relative w-full md:w-32 aspect-[3/4] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src={slide.image_url}
                        alt={`Slide ${idx + 1}`}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                      {!slide.is_active && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold">
                          Hidden
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                          #{idx + 1}
                        </span>
                        <span className="truncate">ID: {slide.id.slice(0, 8)}…</span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Link URL (optional)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={linkDrafts[slide.id] ?? ''}
                            onChange={(e) =>
                              setLinkDrafts((prev) => ({ ...prev, [slide.id]: e.target.value }))
                            }
                            placeholder="https://… or /events/…"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveLink(slide)}
                            disabled={isSaving || (linkDrafts[slide.id] ?? '') === (slide.link_url ?? '')}
                            className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center gap-2 md:gap-1">
                      <button
                        type="button"
                        onClick={() => moveSlide(slide.id, -1)}
                        disabled={isFirst}
                        title="Move up"
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSlide(slide.id, 1)}
                        disabled={isLast}
                        title="Move down"
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(slide)}
                        disabled={isSaving}
                        title={slide.is_active ? 'Hide from carousel' : 'Show in carousel'}
                        className={`p-2 rounded-lg border ${
                          slide.is_active
                            ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                        } disabled:opacity-50`}
                      >
                        {slide.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(slide.id)}
                        title="Delete slide"
                        className="p-2 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete slide?</h3>
              <p className="text-gray-600 mb-6">
                This will permanently remove the image from Cloudinary and the carousel. This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={savingId === deleteConfirmId}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg font-semibold"
                >
                  {savingId === deleteConfirmId ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
