'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Loader2, Save, Trash2, Upload, X } from 'lucide-react'

interface HeroSlide {
  id: string
  image_url: string
  link_url: string | null
  display_order: number
  is_active: boolean
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
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const userData =
      sessionStorage.getItem('userData') || localStorage.getItem('userData')
    const token =
      sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    if (!userData || !token) {
      router.push('/login?redirect=/admin/hero-carousel')
      return
    }
    try {
      if (JSON.parse(userData).role !== 'admin') {
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

  const handleUpload = async (file: File) => {
    if (!file?.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB')
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
      await fetchSlides()
    } catch (err: any) {
      setError(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const moveSlide = async (id: string, dir: -1 | 1) => {
    const idx = slides.findIndex((s) => s.id === id)
    const target = idx + dir
    if (idx < 0 || target < 0 || target >= slides.length) return

    const next = [...slides]
    const [moved] = next.splice(idx, 1)
    next.splice(target, 0, moved)
    const reindexed = next.map((s, i) => ({ ...s, display_order: i }))
    setSlides(reindexed)

    try {
      const res = await fetch(`${apiBase()}/hero-carousel/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          slides: reindexed.map((s, i) => ({ id: s.id, display_order: i })),
        }),
      })
      if (!res.ok) throw new Error('Reorder failed')
    } catch (err: any) {
      setError(err?.message || 'Reorder failed')
      await fetchSlides()
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
        prev.map((s) =>
          s.id === slide.id ? { ...s, link_url: draft || null } : s
        )
      )
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
      setDeleteId(null)
      await fetchSlides()
    } catch (err: any) {
      setError(err?.message || 'Delete failed')
    } finally {
      setSavingId(null)
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking access…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Hero Carousel</h1>
          <p className="text-sm text-gray-500 mt-1">
            Slides on the homepage hero. Optional link makes each slide clickable.
          </p>
        </header>

        {error && (
          <div className="mb-4 flex items-start justify-between gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => setError('')}
              aria-label="Dismiss error"
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <input
            type="text"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder="Optional link URL (e.g. /events/jothi-unplugged)"
            className="w-full mb-3 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onDragEnter={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setDragActive(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleUpload(file)
            }}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
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
            <label htmlFor="hero-upload" className="block cursor-pointer">
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Uploading…</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gray-600">
                  <Upload className="w-7 h-7 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    Drop image or click to upload
                  </span>
                  <span className="text-xs text-gray-500">1080×1080 recommended · max 10MB</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Slides list */}
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          </div>
        ) : slides.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            No slides yet — upload your first above.
          </div>
        ) : (
          <ul className="space-y-2">
            {slides.map((slide, idx) => {
              const isFirst = idx === 0
              const isLast = idx === slides.length - 1
              const isSaving = savingId === slide.id
              const hasChanges =
                (linkDrafts[slide.id] ?? '') !== (slide.link_url ?? '')

              return (
                <li
                  key={slide.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
                    <Image
                      src={slide.image_url}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <input
                      type="text"
                      value={linkDrafts[slide.id] ?? ''}
                      onChange={(e) =>
                        setLinkDrafts((prev) => ({
                          ...prev,
                          [slide.id]: e.target.value,
                        }))
                      }
                      placeholder="Optional link…"
                      className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {hasChanges && (
                      <button
                        type="button"
                        onClick={() => handleSaveLink(slide)}
                        disabled={isSaving}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded font-medium"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveSlide(slide.id, -1)}
                      disabled={isFirst}
                      aria-label="Move up"
                      className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSlide(slide.id, 1)}
                      disabled={isLast}
                      aria-label="Move down"
                      className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(slide.id)}
                      aria-label="Delete slide"
                      className="p-1.5 rounded text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* Delete confirm */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-sm w-full p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete slide?</h3>
              <p className="text-sm text-gray-600 mb-5">
                This permanently removes the image. Cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={savingId === deleteId}
                  className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg font-medium"
                >
                  {savingId === deleteId ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
