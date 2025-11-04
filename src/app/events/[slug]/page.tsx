'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaMoneyBill,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaUserPlus,
  FaArrowLeft,
  FaTrophy,
  FaListUl,
  FaFileAlt,
  FaExternalLinkAlt,
} from 'react-icons/fa'

interface Event {
  _id: string
  title: string
  slug: string
  description: string
  eventType: string
  location?: string
  venue?: string
  startDate: string
  endDate?: string
  registrationDeadline?: string
  registrationLink?: string
  coverImage?: string
  organizer?: string
  contactEmail?: string
  contactPhone?: string
  maxParticipants?: number
  currentParticipants?: number
  entryFee?: number
  categories?: string[]
  rules?: string
  schedule?: string
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    if (params.slug) {
      loadEvent()
    }
  }, [params.slug])

  const loadEvent = async () => {
    try {
      const response = await api.get(`/events/${params.slug}`)
      setEvent(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load event', err)
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!user) {
      router.push('/login?redirect=/events/' + params.slug)
      return
    }

    if (!event) return

    setRegistering(true)
    try {
      await api.post(`/events/${event._id}/register`)
      alert('Successfully registered for the event!')
      loadEvent() // Reload to update participant count
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register')
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isPastDeadline = (deadlineString?: string) => {
    if (!deadlineString) return false
    return new Date(deadlineString) < new Date()
  }

  const isEventFull = (event: Event) => {
    return event.maxParticipants && (event.currentParticipants || 0) >= event.maxParticipants
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 hero-bg flex items-center justify-center">
        <p className="text-brand-light/70">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 hero-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <Link href="/events" className="btn-primary inline-block">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 hero-bg">
      <div className="container-custom py-12">
        {/* Back Button */}
        <Link href="/events" className="inline-flex items-center gap-2 text-brand-accent hover:underline mb-6">
          <FaArrowLeft />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cover Image */}
            {event.coverImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-96 rounded-lg overflow-hidden mb-8"
              >
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Event Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-brand-accent/20 text-brand-accent uppercase">
                  {event.eventType}
                </span>
              </div>
              <h1 className="text-4xl font-display font-bold mb-4">{event.title}</h1>
              <p className="text-xl text-brand-light/70">{event.description}</p>
            </motion.div>

            {/* Event Details Sections */}
            <div className="space-y-8">
              {/* Schedule */}
              {event.schedule && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FaClock className="text-brand-accent" />
                    Schedule
                  </h2>
                  <div className="text-brand-light/70 whitespace-pre-line">
                    {event.schedule}
                  </div>
                </motion.div>
              )}

              {/* Categories */}
              {event.categories && event.categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FaTrophy className="text-brand-accent" />
                    Categories
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {event.categories.map((category, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-brand-secondary/30 rounded-lg text-center text-sm"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Rules */}
              {event.rules && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-brand-accent" />
                    Rules & Requirements
                  </h2>
                  <div className="text-brand-light/70 whitespace-pre-line">
                    {event.rules}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-4">Event Details</h3>
                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <FaCalendar className="text-brand-accent mt-1" />
                    <div>
                      <div className="font-semibold">Date</div>
                      <div className="text-sm text-brand-light/70">
                        {formatDate(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate && (
                          <> to {formatDate(event.endDate)}</>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-brand-primary mt-1" />
                      <div>
                        <div className="font-semibold">Location</div>
                        <div className="text-sm text-brand-light/70">{event.location}</div>
                        {event.venue && (
                          <div className="text-sm text-brand-light/50">{event.venue}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Participants */}
                  {event.maxParticipants && (
                    <div className="flex items-start gap-3">
                      <FaUsers className="text-brand-secondary mt-1" />
                      <div>
                        <div className="font-semibold">Participants</div>
                        <div className="text-sm text-brand-light/70">
                          {event.currentParticipants || 0} / {event.maxParticipants}
                          {isEventFull(event) && (
                            <span className="ml-2 text-red-400 font-semibold">(FULL)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Entry Fee */}
                  {event.entryFee && (
                    <div className="flex items-start gap-3">
                      <FaMoneyBill className="text-green-400 mt-1" />
                      <div>
                        <div className="font-semibold">Entry Fee</div>
                        <div className="text-sm text-brand-light/70">
                          Rs. {event.entryFee.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registration Deadline */}
                  {event.registrationDeadline && (
                    <div className="flex items-start gap-3">
                      <FaClock className={`mt-1 ${isPastDeadline(event.registrationDeadline) ? 'text-red-400' : 'text-brand-accent'}`} />
                      <div>
                        <div className="font-semibold">Registration Deadline</div>
                        <div className={`text-sm ${isPastDeadline(event.registrationDeadline) ? 'text-red-400' : 'text-brand-light/70'}`}>
                          {formatDate(event.registrationDeadline)}
                          {isPastDeadline(event.registrationDeadline) && ' (Closed)'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Organizer */}
                  {event.organizer && (
                    <div className="flex items-start gap-3">
                      <FaListUl className="text-brand-light mt-1" />
                      <div>
                        <div className="font-semibold">Organizer</div>
                        <div className="text-sm text-brand-light/70">{event.organizer}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration Buttons */}
                <div className="mt-6 space-y-3">
                  {event.registrationLink && !isPastDeadline(event.registrationDeadline) && !isEventFull(event) && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FaExternalLinkAlt />
                      Register Now
                    </a>
                  )}
                  {!event.registrationLink && event.maxParticipants && !isPastDeadline(event.registrationDeadline) && !isEventFull(event) && (
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FaUserPlus />
                      {registering ? 'Registering...' : 'Register for Event'}
                    </button>
                  )}
                  {(isPastDeadline(event.registrationDeadline) || isEventFull(event)) && (
                    <div className="text-center py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold">
                      {isEventFull(event) ? 'Event is Full' : 'Registration Closed'}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Contact Card */}
              {(event.contactEmail || event.contactPhone) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card"
                >
                  <h3 className="text-xl font-bold mb-4">Contact</h3>
                  <div className="space-y-3">
                    {event.contactEmail && (
                      <a
                        href={`mailto:${event.contactEmail}`}
                        className="flex items-center gap-3 text-brand-accent hover:underline"
                      >
                        <FaEnvelope />
                        {event.contactEmail}
                      </a>
                    )}
                    {event.contactPhone && (
                      <a
                        href={`tel:${event.contactPhone}`}
                        className="flex items-center gap-3 text-brand-accent hover:underline"
                      >
                        <FaPhone />
                        {event.contactPhone}
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
