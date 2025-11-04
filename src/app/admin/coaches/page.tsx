'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaStar, FaMedal, FaEnvelope, FaPhone } from 'react-icons/fa'

interface Coach {
  _id: string
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
  championsCount: number
}

export default function AdminCoachesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    specializations: '',
    certifications: '',
    experience: '',
    availability: '',
    email: '',
    phone: '',
    image: '',
    featured: false,
    championsCount: '',
  })

  useEffect(() => {
    if (user === null) {
      router.push('/login?redirect=/admin/coaches')
    } else if (user && user.role !== 'admin') {
      alert('Access denied. Admin privileges required.')
      router.push('/')
    } else if (user) {
      loadCoaches()
    }
  }, [user, router])

  const loadCoaches = async () => {
    try {
      const res = await api.get('/coaches')
      setCoaches(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load coaches', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
        certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c),
        experience: Number(formData.experience),
        availability: formData.availability,
        email: formData.email,
        phone: formData.phone,
        image: formData.image || undefined,
        featured: formData.featured,
        championsCount: Number(formData.championsCount) || 0,
      }

      if (editingCoach) {
        await api.put(`/coaches/${editingCoach._id}`, payload)
      } else {
        await api.post('/coaches', payload)
      }

      setShowForm(false)
      setEditingCoach(null)
      resetForm()
      loadCoaches()
      alert(editingCoach ? 'Coach updated successfully!' : 'Coach created successfully!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save coach')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coach?')) return
    try {
      await api.delete(`/coaches/${id}`)
      loadCoaches()
      alert('Coach deleted successfully!')
    } catch (err) {
      alert('Failed to delete coach')
    }
  }

  const handleEdit = (coach: Coach) => {
    setEditingCoach(coach)
    setFormData({
      name: coach.name,
      title: coach.title,
      bio: coach.bio,
      specializations: coach.specializations.join(', '),
      certifications: coach.certifications.join(', '),
      experience: coach.experience.toString(),
      availability: coach.availability,
      email: coach.email,
      phone: coach.phone,
      image: coach.image || '',
      featured: coach.featured,
      championsCount: coach.championsCount.toString(),
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      bio: '',
      specializations: '',
      certifications: '',
      experience: '',
      availability: '',
      email: '',
      phone: '',
      image: '',
      featured: false,
      championsCount: '',
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-brand-light/70">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-brand-accent hover:text-brand-primary">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-display font-bold">Manage Coaches</h1>
              <p className="text-brand-light/70">Add, edit, or remove coaching staff</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingCoach(null)
              resetForm()
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Coach</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingCoach ? 'Edit Coach' : 'Add New Coach'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Head Coach & Technical Director"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="+94 77 123 4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Champions Trained</label>
                  <input
                    type="number"
                    name="championsCount"
                    value={formData.championsCount}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Availability *</label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Mon-Fri: 6AM-9AM, 4PM-8PM | Sat: 7AM-12PM"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="/images/coaches/name.jpg"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">Bio *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="input"
                  rows={4}
                  required
                />
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Specializations (comma separated)
                </label>
                <input
                  type="text"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Olympic Weightlifting, Strength & Conditioning, Competition Preparation"
                />
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Certifications (comma separated)
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="IWF Level 3 Coach, NSCA-CSCS, Sports Nutrition Specialist"
                />
              </div>

              {/* Featured */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium">Featured Coach</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  {editingCoach ? 'Update Coach' : 'Add Coach'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCoach(null)
                    resetForm()
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coaches List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Current Coaches ({coaches.length})</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-brand-light/70">Loading coaches...</p>
            </div>
          ) : coaches.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-brand-light/70 mb-4">No coaches found</p>
              <button
                onClick={() => {
                  setShowForm(true)
                  resetForm()
                }}
                className="btn-primary"
              >
                Add First Coach
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {coaches.map((coach) => (
                <div key={coach._id} className="card">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Coach Image */}
                    <div className="w-full md:w-48 h-48 bg-brand-secondary/20 rounded-lg overflow-hidden flex-shrink-0">
                      {coach.image ? (
                        <img
                          src={coach.image}
                          alt={coach.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-light/30 text-6xl font-bold">
                          {coach.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>

                    {/* Coach Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-bold">{coach.name}</h3>
                            {coach.featured && (
                              <FaStar className="text-brand-accent" title="Featured Coach" />
                            )}
                          </div>
                          <p className="text-brand-accent">{coach.title}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(coach)}
                            className="btn-outline p-2"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(coach._id)}
                            className="btn-outline p-2 text-red-500 hover:bg-red-500/10"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <p className="text-brand-light/80">{coach.bio}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaMedal className="text-brand-accent flex-shrink-0" />
                          <span>{coach.championsCount} Champions Trained</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-brand-accent flex-shrink-0" />
                          <span className="truncate">{coach.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-brand-accent flex-shrink-0" />
                          <span>{coach.phone}</span>
                        </div>
                        <div>
                          <span className="text-brand-light/60">Experience: </span>
                          <span className="font-semibold">{coach.experience} years</span>
                        </div>
                      </div>

                      {coach.specializations.length > 0 && (
                        <div>
                          <span className="text-brand-light/60 text-sm">Specializations: </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {coach.specializations.map((spec, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-xs"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {coach.certifications.length > 0 && (
                        <div>
                          <span className="text-brand-light/60 text-sm">Certifications: </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {coach.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-brand-accent/20 text-brand-accent rounded-full text-xs"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-brand-light/60">
                        <span className="font-semibold">Availability: </span>
                        {coach.availability}
                      </div>
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
