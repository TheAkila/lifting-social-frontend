'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Upload,
  User2,
  X,
} from 'lucide-react'
import api from '@/lib/api'

export interface CoachFormInitial {
  id?: string
  name?: string
  title?: string
  bio?: string
  email?: string
  phone?: string
  experience?: number | null
  champions_count?: number | null
  availability?: string
  image?: string
  specializations?: string[]
  certifications?: string[]
  featured?: boolean
}

interface CoachFormState {
  name: string
  title: string
  bio: string
  email: string
  phone: string
  experience: string
  championsCount: string
  availability: string
  image: string
  specializations: string[]
  certifications: string[]
  featured: boolean
}

function toFormState(initial?: CoachFormInitial): CoachFormState {
  return {
    name: initial?.name ?? '',
    title: initial?.title ?? '',
    bio: initial?.bio ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    experience: initial?.experience != null ? String(initial.experience) : '',
    championsCount:
      initial?.champions_count != null ? String(initial.champions_count) : '',
    availability: initial?.availability ?? '',
    image: initial?.image ?? '',
    specializations: Array.isArray(initial?.specializations)
      ? initial!.specializations!
      : [],
    certifications: Array.isArray(initial?.certifications)
      ? initial!.certifications!
      : [],
    featured: !!initial?.featured,
  }
}

export default function CoachForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit'
  initial?: CoachFormInitial
}) {
  const router = useRouter()
  const [form, setForm] = useState<CoachFormState>(() => toFormState(initial))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(toFormState(initial))
  }, [initial])

  const setField = <K extends keyof CoachFormState>(k: K, v: CoachFormState[K]) => {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB')
      return
    }
    try {
      setError('')
      setUploading(true)
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/uploads', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data?.url) {
        setField('image', res.data.url)
      } else {
        throw new Error('Upload returned no URL')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.title.trim() || !form.email.trim()) {
      setError('Name, title and email are required')
      return
    }
    try {
      setSaving(true)
      setError('')
      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        bio: form.bio.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        experience: Number(form.experience) || 0,
        championsCount: Number(form.championsCount) || 0,
        availability: form.availability.trim(),
        image: form.image.trim() || undefined,
        specializations: form.specializations,
        certifications: form.certifications,
        featured: form.featured,
      }
      if (mode === 'edit' && initial?.id) {
        await api.put(`/coaches/${initial.id}`, payload)
      } else {
        await api.post('/coaches', payload)
      }
      router.push('/admin/coaches')
      router.refresh()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save coach')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/coaches"
            aria-label="Back to coaches"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit coach' : 'New coach'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {mode === 'edit'
                ? 'Update the coach profile and save changes.'
                : 'Add a new coach to the public /coaching directory.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start justify-between gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss"
              className="opacity-60 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {/* Image */}
          <Section label="Profile image">
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                {form.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image}
                    alt="Coach"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <User2 className="w-8 h-8" />
                  </div>
                )}
              </div>
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
                  const f = e.dataTransfer.files?.[0]
                  if (f) handleImageUpload(f)
                }}
                className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center transition ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="coach-image-upload"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleImageUpload(f)
                    e.target.value = ''
                  }}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="coach-image-upload"
                  className="block cursor-pointer text-sm text-gray-600"
                >
                  {uploading ? (
                    <span className="inline-flex items-center gap-2 text-blue-700 font-medium">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-medium">
                      <Upload className="w-4 h-4 text-gray-400" />
                      Drop image or click to upload
                    </span>
                  )}
                </label>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setField('image', '')}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </Section>

          {/* Basic */}
          <Section label="Basic info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField label="Name *" value={form.name} onChange={(v) => setField('name', v)} />
              <TextField
                label="Title *"
                value={form.title}
                onChange={(v) => setField('title', v)}
                placeholder="Head Coach"
              />
              <TextField
                label="Email *"
                type="email"
                value={form.email}
                onChange={(v) => setField('email', v)}
              />
              <TextField
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(v) => setField('phone', v)}
                placeholder="+94 77 123 4567"
              />
              <TextField
                label="Years of experience"
                type="number"
                value={form.experience}
                onChange={(v) => setField('experience', v)}
              />
              <TextField
                label="Champions trained"
                type="number"
                value={form.championsCount}
                onChange={(v) => setField('championsCount', v)}
              />
            </div>
          </Section>

          {/* About */}
          <Section label="About">
            <TextAreaField
              label="Bio"
              value={form.bio}
              onChange={(v) => setField('bio', v)}
              rows={4}
              placeholder="Background, coaching philosophy, notable achievements…"
            />
          </Section>

          {/* Schedule */}
          <Section label="Schedule">
            <TextAreaField
              label="Availability"
              value={form.availability}
              onChange={(v) => setField('availability', v)}
              rows={2}
              placeholder="e.g. Mon–Fri 6am–9am · Sat 7am–12pm"
            />
          </Section>

          {/* Tags */}
          <Section label="Specializations">
            <ChipInput
              chips={form.specializations}
              onChange={(next) => setField('specializations', next)}
              placeholder="Add specialization and press Enter…"
            />
          </Section>

          <Section label="Certifications">
            <ChipInput
              chips={form.certifications}
              onChange={(next) => setField('certifications', next)}
              placeholder="Add certification and press Enter…"
            />
          </Section>

          {/* Featured */}
          <Section label="Visibility">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField('featured', e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700">
                Featured — appears in the highlighted Head Coaches section
              </span>
            </label>
          </Section>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <Link
            href="/admin/coaches"
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {mode === 'edit' ? 'Save changes' : 'Create coach'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 sm:px-6 py-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
        {label}
      </p>
      {children}
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
    </label>
  )
}

function ChipInput({
  chips,
  onChange,
  placeholder,
}: {
  chips: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const v = draft.trim()
    if (!v) return
    if (chips.includes(v)) {
      setDraft('')
      return
    }
    onChange([...chips, v])
    setDraft('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip, idx) => (
          <span
            key={`${chip}-${idx}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
          >
            {chip}
            <button
              type="button"
              onClick={() => onChange(chips.filter((_, i) => i !== idx))}
              aria-label={`Remove ${chip}`}
              className="hover:text-blue-900"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {chips.length === 0 && <span className="text-xs text-gray-400">No items yet</span>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              commit()
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={commit}
          disabled={!draft.trim()}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-800 rounded-lg font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
    </div>
  )
}
