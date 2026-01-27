'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Trophy,
  Calendar,
  MapPin,
  ArrowRight,
  Plus,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

interface EventRegistration {
  id: string
  status: string
  weight_category?: string
  entry_total?: number
  snatch_opener?: number
  cnj_opener?: number
  registered_at: string
  event: {
    id: string
    title: string
    slug: string
    start_date: string
    location?: string
    event_status?: string
    preliminary_entry_deadline?: string
    final_entry_deadline?: string
  }
}

export default function UserDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && user.role === 'admin') {
      router.push('/admin')
      return
    }

    if (user) {
      loadRegistrations()
    }
  }, [user, authLoading, router])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      const response = await api.get('/registrations')
      setRegistrations(response.data)
    } catch (err) {
      console.error('Error loading registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your events...</p>
        </div>
      </div>
    )
  }

  const getRegistrationStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string, text: string, label: string, icon: any }> = {
      registered: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Registered', icon: CheckCircle2 },
      preliminary_submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Prelim Submitted', icon: Clock },
      preliminary_approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Prelim Approved', icon: CheckCircle2 },
      final_submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Final Submitted', icon: Clock },
      final_approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Final Approved', icon: CheckCircle2 },
      payment_pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Payment Pending', icon: AlertCircle },
      confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed', icon: CheckCircle2 },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Withdrawn', icon: AlertCircle }
    }
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: AlertCircle }
  }

  const activeRegistrations = registrations.filter(r => r.status !== 'withdrawn')
  const confirmedCount = registrations.filter(r => r.status === 'confirmed').length
  const pendingCount = registrations.filter(r => ['registered', 'preliminary_submitted', 'final_submitted', 'payment_pending'].includes(r.status)).length

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
            My Events
          </h1>
          <p className="text-gray-500 text-lg">Manage your weightlifting competition registrations</p>
        </motion.div>

        {/* Events List */}
        {activeRegistrations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-2 border-gray-200 rounded-lg p-16 text-center"
          >
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-black mb-2">No Event Registrations</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't registered for any weightlifting competitions yet.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {activeRegistrations.map((reg, index) => {
              const statusBadge = getRegistrationStatusBadge(reg.status)
              const StatusIcon = statusBadge.icon
              const eventDate = new Date(reg.event.start_date)
              const isUpcoming = eventDate > new Date()
              const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

              return (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="border-2 border-black rounded-lg p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-black mb-1 group-hover:underline">
                            {reg.event.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                              {isUpcoming && daysUntil <= 30 && (
                                <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                  {daysUntil} days
                                </span>
                              )}
                            </div>
                            {reg.event.location && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{reg.event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Registration Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-16">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusBadge.label}
                          </div>
                        </div>
                        {reg.weight_category && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Category</p>
                            <p className="text-sm font-semibold text-black">{reg.weight_category}</p>
                          </div>
                        )}
                        {reg.entry_total && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Entry Total</p>
                            <p className="text-sm font-semibold text-black">{reg.entry_total}kg</p>
                          </div>
                        )}
                        {reg.snatch_opener && reg.cnj_opener && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Openers</p>
                            <p className="text-sm font-semibold text-black">{reg.snatch_opener}kg / {reg.cnj_opener}kg</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                      <Link href={`/events/${reg.event.slug}`} className="flex-1 lg:flex-initial">
                        <button className="w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                          View Event
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                      {reg.status === 'registered' && (
                        <div className="text-xs text-gray-500 text-right">
                          <p className="font-medium text-yellow-700">Action Required</p>
                          <p>Submit preliminary entry</p>
                        </div>
                      )}
                      {reg.status === 'preliminary_approved' && (
                        <div className="text-xs text-gray-500 text-right">
                          <p className="font-medium text-yellow-700">Action Required</p>
                          <p>Submit final entry</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
