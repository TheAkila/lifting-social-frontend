'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaStar, FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa'

interface Event {
  _id: string
  title: string
  slug: string
  description: string
  eventType: 'competition' | 'meet' | 'training' | 'seminar' | 'news' | 'announcement'
  location: string
  venue?: string
  startDate: string
  endDate?: string
  registrationDeadline?: string
  registrationLink?: string
  coverImage?: string
  organizer: string
  contactEmail?: string
  contactPhone?: string
  isFeatured: boolean
  isPublished: boolean
  maxParticipants?: number
  currentParticipants?: number
  entryFee?: number
  categories?: string[]
  rules?: string
  schedule?: string
}

export default function AdminEventsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'competition' as Event['eventType'],
    location: '',
    venue: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    registrationLink: '',
    coverImage: '',
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    isFeatured: false,
    isPublished: true,
    maxParticipants: '',
    entryFee: '',
    categories: '',
    rules: '',
    schedule: '',
  })

  useEffect(() => {
    if (user === null) {
      router.push('/login?redirect=/admin/events')
    } else if (user && user.role !== 'admin') {
      alert('Access denied. Admin privileges required.')
      router.push('/')
    } else if (user) {
      loadEvents()
    }
  }, [user, router])

  const loadEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load events', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        eventType: formData.eventType,
        location: formData.location,
        venue: formData.venue || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        registrationDeadline: formData.registrationDeadline || undefined,
        registrationLink: formData.registrationLink || undefined,
        coverImage: formData.coverImage || undefined,
        organizer: formData.organizer,
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
        entryFee: formData.entryFee ? Number(formData.entryFee) : undefined,
        categories: formData.categories ? formData.categories.split(',').map(c => c.trim()).filter(c => c) : undefined,
        rules: formData.rules || undefined,
        schedule: formData.schedule || undefined,
      }

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, payload)
      } else {
        await api.post('/events', payload)
      }

      setShowForm(false)
      setEditingEvent(null)
      resetForm()
      loadEvents()
      alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save event')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      loadEvents()
      alert('Event deleted successfully!')
    } catch (err) {
      alert('Failed to delete event')
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      location: event.location,
      venue: event.venue || '',
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate ? event.endDate.split('T')[0] : '',
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.split('T')[0] : '',
      registrationLink: event.registrationLink || '',
      coverImage: event.coverImage || '',
      organizer: event.organizer,
      contactEmail: event.contactEmail || '',
      contactPhone: event.contactPhone || '',
      isFeatured: event.isFeatured,
      isPublished: event.isPublished,
      maxParticipants: event.maxParticipants?.toString() || '',
      entryFee: event.entryFee?.toString() || '',
      categories: event.categories?.join(', ') || '',
      rules: event.rules || '',
      schedule: event.schedule || '',
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'competition',
      location: '',
      venue: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      registrationLink: '',
      coverImage: '',
      organizer: '',
      contactEmail: '',
      contactPhone: '',
      isFeatured: false,
      isPublished: true,
      maxParticipants: '',
      entryFee: '',
      categories: '',
      rules: '',
      schedule: '',
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <div className="min-h-screen bg-brand-dark pt-28 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-brand-accent hover:text-brand-primary">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-display font-bold">Manage Events</h1>
              <p className="text-brand-light/70">Create and manage meets, competitions, and announcements</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingEvent(null)
              resetForm()
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Event</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Type *</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="competition">Competition</option>
                    <option value="meet">Meet</option>
                    <option value="training">Training Camp</option>
                    <option value="seminar">Seminar/Workshop</option>
                    <option value="news">News</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Organizer *</label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Sri Lanka Weightlifting Federation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Colombo, Sri Lanka"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Sugathadasa Indoor Stadium"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input"
                  rows={4}
                  required
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Registration Deadline</label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>

              {/* Registration & Fees */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Link</label>
                  <input
                    type="url"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Entry Fee (LKR)</label>
                  <input
                    type="number"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Cover Image URL</label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="/images/events/event-name.jpg"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium mb-2">Categories (comma separated)</label>
                <input
                  type="text"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Men 73kg, Women 64kg, Youth"
                />
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium mb-2">Schedule</label>
                <textarea
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  placeholder="e.g., Day 1: Women categories | Day 2: Men categories"
                />
              </div>

              {/* Rules */}
              <div>
                <label className="block text-sm font-medium mb-2">Rules</label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  placeholder="e.g., IWF rules apply. Medical certificates required."
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium">Featured Event</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium">Published</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingEvent(null)
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

        {/* Events List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Events ({events.length})</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-brand-light/70">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-brand-light/70 mb-4">No events found</p>
              <button
                onClick={() => {
                  setShowForm(true)
                  resetForm()
                }}
                className="btn-primary"
              >
                Create First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {events.map((event) => (
                <div key={event._id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{event.title}</h3>
                        {event.isFeatured && (
                          <FaStar className="text-brand-accent" title="Featured" />
                        )}
                        {!event.isPublished && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-xs font-semibold">
                          {event.eventType}
                        </span>
                        <span className="text-sm text-brand-light/60">by {event.organizer}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="btn-outline p-2"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="btn-outline p-2 text-red-500 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <p className="text-brand-light/80 mb-4">{event.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-brand-accent" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString()}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-brand-accent" />
                      <span>{event.location}</span>
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-brand-accent" />
                        <span>
                          {event.currentParticipants || 0} / {event.maxParticipants} participants
                        </span>
                      </div>
                    )}
                  </div>

                  {event.registrationDeadline && (
                    <div className="mt-3 text-sm">
                      <span className="text-brand-light/60">Registration Deadline: </span>
                      <span className="font-semibold">
                        {new Date(event.registrationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
