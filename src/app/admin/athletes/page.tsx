'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa'

export default function AdminAthletes() {
  const { user } = useAuth()
  const router = useRouter()
  const [athletes, setAthletes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAthlete, setEditingAthlete] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    bio: '',
    image: '',
    category: '73kg',
    gender: 'Male',
    snatch: '',
    cleanAndJerk: '',
    total: '',
    achievements: '',
    goldMedals: '0',
    silverMedals: '0',
    bronzeMedals: '0',
    featured: false,
    instagram: '',
    facebook: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/athletes')
      return
    }
    loadAthletes()
  }, [user])

  const loadAthletes = async () => {
    try {
      const res = await api.get('/athletes')
      setAthletes(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load athletes', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        bio: formData.bio,
        image: formData.image || undefined,
        category: formData.category,
        gender: formData.gender,
        snatch: formData.snatch ? Number(formData.snatch) : undefined,
        cleanAndJerk: formData.cleanAndJerk ? Number(formData.cleanAndJerk) : undefined,
        total: formData.total ? Number(formData.total) : undefined,
        achievements: formData.achievements || undefined,
        medals: {
          gold: Number(formData.goldMedals),
          silver: Number(formData.silverMedals),
          bronze: Number(formData.bronzeMedals),
        },
        featured: formData.featured,
        socialMedia: {
          instagram: formData.instagram || undefined,
          facebook: formData.facebook || undefined,
        },
      }

      if (editingAthlete) {
        await api.put(`/athletes/${editingAthlete._id}`, payload)
      } else {
        await api.post('/athletes', payload)
      }

      setShowForm(false)
      setEditingAthlete(null)
      resetForm()
      loadAthletes()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save athlete')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this athlete?')) return
    try {
      await api.delete(`/athletes/${id}`)
      loadAthletes()
    } catch (err) {
      alert('Failed to delete athlete')
    }
  }

  const handleEdit = (athlete: any) => {
    setEditingAthlete(athlete)
    setFormData({
      name: athlete.name,
      slug: athlete.slug,
      bio: athlete.bio || '',
      image: athlete.image || '',
      category: athlete.category || '73kg',
      gender: athlete.gender || 'Male',
      snatch: athlete.snatch?.toString() || '',
      cleanAndJerk: athlete.cleanAndJerk?.toString() || '',
      total: athlete.total?.toString() || '',
      achievements: athlete.achievements || '',
      goldMedals: athlete.medals?.gold?.toString() || '0',
      silverMedals: athlete.medals?.silver?.toString() || '0',
      bronzeMedals: athlete.medals?.bronze?.toString() || '0',
      featured: athlete.featured || false,
      instagram: athlete.socialMedia?.instagram || '',
      facebook: athlete.socialMedia?.facebook || '',
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      bio: '',
      image: '',
      category: '73kg',
      gender: 'Male',
      snatch: '',
      cleanAndJerk: '',
      total: '',
      achievements: '',
      goldMedals: '0',
      silverMedals: '0',
      bronzeMedals: '0',
      featured: false,
      instagram: '',
      facebook: '',
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-brand-dark py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-brand-accent hover:text-brand-primary">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-display font-bold">Athletes</h1>
              <p className="text-brand-light/70">Manage athlete profiles</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingAthlete(null)
              resetForm()
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Athlete</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingAthlete ? 'Edit Athlete' : 'Add New Athlete'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                    placeholder="73kg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Snatch (kg)</label>
                  <input
                    type="number"
                    value={formData.snatch}
                    onChange={(e) => setFormData({ ...formData, snatch: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Clean & Jerk (kg)</label>
                  <input
                    type="number"
                    value={formData.cleanAndJerk}
                    onChange={(e) => setFormData({ ...formData, cleanAndJerk: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Total (kg)</label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Achievements</label>
                  <input
                    type="text"
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    className="input-field"
                    placeholder="National Champion 2024"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input-field"
                  placeholder="/images/athletes/example.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">🥇 Gold Medals</label>
                  <input
                    type="number"
                    value={formData.goldMedals}
                    onChange={(e) => setFormData({ ...formData, goldMedals: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">🥈 Silver Medals</label>
                  <input
                    type="number"
                    value={formData.silverMedals}
                    onChange={(e) => setFormData({ ...formData, silverMedals: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">🥉 Bronze Medals</label>
                  <input
                    type="number"
                    value={formData.bronzeMedals}
                    onChange={(e) => setFormData({ ...formData, bronzeMedals: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Instagram</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="input-field"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Facebook</label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="input-field"
                    placeholder="username"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Featured</span>
                </label>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  {editingAthlete ? 'Update Athlete' : 'Create Athlete'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAthlete(null)
                    resetForm()
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Athletes List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">All Athletes ({athletes.length})</h2>
          {loading ? (
            <p className="text-center py-8 text-brand-light/70">Loading...</p>
          ) : athletes.length === 0 ? (
            <p className="text-center py-8 text-brand-light/70">No athletes yet. Add your first one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {athletes.map((athlete) => (
                <div
                  key={athlete._id}
                  className="p-4 border border-brand-light/20 rounded-lg hover:bg-brand-light/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{athlete.name}</h3>
                      <p className="text-sm text-brand-accent">{athlete.category}</p>
                    </div>
                    {athlete.featured && <span className="text-yellow-400">⭐</span>}
                  </div>
                  <p className="text-sm text-brand-light/70 mb-3 line-clamp-2">{athlete.bio}</p>
                  <div className="flex items-center justify-between text-xs text-brand-light/50 mb-3">
                    <span>{athlete.achievements}</span>
                  </div>
                  {athlete.total && (
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                      <div>
                        <div className="font-bold text-brand-accent">{athlete.snatch}kg</div>
                        <div className="text-brand-light/50">Snatch</div>
                      </div>
                      <div>
                        <div className="font-bold text-brand-accent">{athlete.cleanAndJerk}kg</div>
                        <div className="text-brand-light/50">C&J</div>
                      </div>
                      <div>
                        <div className="font-bold text-brand-primary">{athlete.total}kg</div>
                        <div className="text-brand-light/50">Total</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-brand-light/10">
                    <div className="flex space-x-2 text-xs">
                      <span>🥇 {athlete.medals?.gold || 0}</span>
                      <span>🥈 {athlete.medals?.silver || 0}</span>
                      <span>🥉 {athlete.medals?.bronze || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(athlete)}
                        className="text-brand-accent hover:text-brand-primary p-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(athlete._id)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
