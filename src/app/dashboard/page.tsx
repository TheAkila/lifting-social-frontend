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
  competition?: {  // New unified schema
    id: string
    name: string
    slug: string
    date: string
    location?: string
    status?: string
    registration_open?: boolean
    preliminary_entry_open?: boolean
    final_entry_open?: boolean
    preliminary_entry_start?: string
    preliminary_entry_end?: string
    final_entry_start?: string
    final_entry_end?: string
  }
  event?: {  // Legacy compatibility
    id: string
    title: string
    slug: string
    start_date: string
    location?: string
    event_status?: string
    preliminary_entry_deadline?: string
    final_entry_deadline?: string
  }
  session?: {
    id: string
    name: string
    start_time?: string
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
      // Preliminary statuses
      preliminary_pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Prelim Pending', icon: Clock },
      preliminary_submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Prelim Submitted', icon: Clock },
      preliminary_approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Prelim Approved', icon: CheckCircle2 },
      preliminary_rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Prelim Rejected', icon: AlertCircle },
      // Final statuses
      final_pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Final Pending', icon: Clock },
      final_submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Final Submitted', icon: Clock },
      final_approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Final Approved', icon: CheckCircle2 },
      final_rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Final Rejected', icon: AlertCircle },
      // Other statuses
      payment_pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Payment Pending', icon: AlertCircle },
      confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed', icon: CheckCircle2 },
      checked_in: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Checked In', icon: CheckCircle2 },
      competing: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Competing', icon: Target },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: CheckCircle2 },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Withdrawn', icon: AlertCircle },
      disqualified: { bg: 'bg-red-100', text: 'text-red-700', label: 'Disqualified', icon: AlertCircle }
    }
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: AlertCircle }
  }

  // Helper to get event/competition data with backwards compatibility
  const getEventData = (reg: EventRegistration) => {
    const comp = reg.competition
    const evt = reg.event
    return {
      id: comp?.id || evt?.id || '',
      title: comp?.name || evt?.title || 'Unknown Event',
      slug: comp?.slug || evt?.slug || '',
      date: comp?.date || evt?.start_date || '',
      location: comp?.location || evt?.location,
      preliminaryEntryOpen: comp?.preliminary_entry_open || false,
      finalEntryOpen: comp?.final_entry_open || false
    }
  }

  // Helper to determine what action is needed
  const getRequiredAction = (reg: EventRegistration) => {
    const eventData = getEventData(reg)
    
    // Check if preliminary entry is open and user needs to submit
    if (eventData.preliminaryEntryOpen && ['registered', 'preliminary_pending'].includes(reg.status)) {
      return { action: 'preliminary', message: 'Submit preliminary entry' }
    }
    
    // Check if final entry is open and user needs to submit
    if (eventData.finalEntryOpen && ['preliminary_approved', 'final_pending'].includes(reg.status)) {
      return { action: 'final', message: 'Submit final entry' }
    }
    
    // Fallback for waiting states
    if (reg.status === 'preliminary_pending') {
      return { action: 'wait', message: 'Waiting for preliminary approval' }
    }
    if (reg.status === 'final_pending') {
      return { action: 'wait', message: 'Waiting for final approval' }
    }
    
    return null
  }

  const activeRegistrations = registrations.filter(r => r.status !== 'withdrawn')
  const confirmedCount = registrations.filter(r => r.status === 'confirmed').length
  const pendingCount = registrations.filter(r => ['registered', 'preliminary_submitted', 'final_submitted', 'payment_pending'].includes(r.status)).length

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
            My Events
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">Manage your weightlifting competition registrations</p>
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
            {activeRegistrations.map((reg, index) => (
              <EventCard
                key={reg.id}
                reg={reg}
                index={index}
                getRegistrationStatusBadge={getRegistrationStatusBadge}
                getEventData={getEventData}
                getRequiredAction={getRequiredAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EventCard({ reg, index, getRegistrationStatusBadge, getEventData, getRequiredAction }: {
  reg: EventRegistration
  index: number
  getRegistrationStatusBadge: (status: string) => { bg: string, text: string, label: string, icon: any }
  getEventData: (reg: EventRegistration) => { id: string, title: string, slug: string, date: string, location?: string, preliminaryEntryOpen: boolean, finalEntryOpen: boolean }
  getRequiredAction: (reg: EventRegistration) => { action: string, message: string } | null
}) {
  const statusBadge = getRegistrationStatusBadge(reg.status)
  const StatusIcon = statusBadge.icon
  const eventData = getEventData(reg)
  const eventDate = new Date(eventData.date)
  const isUpcoming = eventDate > new Date()
  const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const requiredAction = getRequiredAction(reg)

  return (
    <motion.div
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
                {eventData.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  {isUpcoming && daysUntil <= 30 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {daysUntil} days
                    </span>
                  )}
                </div>
                {eventData.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{eventData.location}</span>
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
          <Link href={`/events/${eventData.slug}`} className="flex-1 lg:flex-initial">
            <button className="w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              View Event
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          {requiredAction && requiredAction.action !== 'wait' && (
            <div className="text-xs text-gray-500 text-right">
              <p className="font-medium text-yellow-700">Action Required</p>
              <p>{requiredAction.message}</p>
            </div>
          )}
          {requiredAction && requiredAction.action === 'wait' && (
            <div className="text-xs text-gray-500 text-right">
              <p className="font-medium text-blue-600">Pending</p>
              <p>{requiredAction.message}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
