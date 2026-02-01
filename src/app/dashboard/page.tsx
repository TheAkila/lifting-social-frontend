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

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  avatar?: string
}

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
  const router = useRouter()
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  // Check auth on mount - read directly from storage
  useEffect(() => {
    console.log('🚀 Dashboard mounted, checking auth...')
    const storedUserData = sessionStorage.getItem('userData') || localStorage.getItem('userData')
    const storedToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    const storedSupabaseToken = sessionStorage.getItem('supabaseToken') || localStorage.getItem('supabaseToken')
    
    console.log('📦 Storage check:')
    console.log('  - userData:', storedUserData ? 'EXISTS' : 'MISSING')
    console.log('  - authToken:', storedToken ? 'EXISTS (length: ' + storedToken?.length + ')' : 'MISSING')
    console.log('  - supabaseToken:', storedSupabaseToken ? 'EXISTS (length: ' + storedSupabaseToken?.length + ')' : 'MISSING')
    
    // Token analysis and cleanup
    if (storedToken) {
      console.log('  - authToken preview:', storedToken.substring(0, 50) + '...')
      // Check if it's a Supabase token (starts with eyJ and is very long)
      if (storedToken.length > 500) {
        console.error('❌ DETECTED SUPABASE TOKEN STORED AS BACKEND TOKEN!')
        console.error('   This WILL cause 401 errors on all API calls.')
        console.error('   Auto-clearing wrong token type...')
        // Clear the wrong token
        localStorage.removeItem('authToken')
        sessionStorage.removeItem('authToken')
        console.log('✅ Cleared invalid token. User needs to re-login.')
        // Clear user data too since token is invalid
        localStorage.removeItem('userData')
        sessionStorage.removeItem('userData')
        router.push('/login?error=invalid_token')
        return
      } else {
        console.log('✅ Token appears to be backend JWT (normal length)')
      }
    }
    console.log('  - userData value:', storedUserData)
    console.log('  - authToken value:', storedToken)
    
    // Only require userData - token is needed for API calls but not for page access
    if (!storedUserData) {
      console.log('❌ Missing user data, redirecting to login')
      router.push('/login')
      return
    }
    
    // Warn if token is missing but allow access
    if (!storedToken) {
      console.warn('⚠️ Auth token missing - API calls may fail. User should re-authenticate.')
    }
    
    try {
      const parsedUser = JSON.parse(storedUserData)
      console.log('✅ Parsed user:', parsedUser.email, '| Role:', parsedUser.role)
      
      if (parsedUser.role === 'admin') {
        console.log('👑 Admin detected, redirecting to admin panel')
        router.push('/admin')
        return
      }
      
      console.log('✅ Setting user and marking auth as checked')
      setUser(parsedUser)
    } catch (err) {
      console.error('Error parsing user data:', err)
      router.push('/login')
    } finally {
      setAuthChecked(true)
    }
  }, [router])

  // Load registrations after auth check
  useEffect(() => {
    if (authChecked && user) {
      loadRegistrations()
    }
  }, [authChecked, user])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      const response = await api.get('/registrations')
      setRegistrations(response.data)
    } catch (err: any) {
      console.error('Error loading registrations:', err)
      // If unauthorized, show a message but don't redirect (user can still see the page)
      if (err.response?.status === 401) {
        console.warn('Authentication expired. User should re-login for full functionality.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked || loading) {
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
    const comp = reg.competition
    
    // Check dates for phase determination
    const now = new Date()
    const prelimStart = comp?.preliminary_entry_start ? new Date(comp.preliminary_entry_start) : null
    const prelimEnd = comp?.preliminary_entry_end ? new Date(comp.preliminary_entry_end) : null
    const finalStart = comp?.final_entry_start ? new Date(comp.final_entry_start) : null
    const finalEnd = comp?.final_entry_end ? new Date(comp.final_entry_end) : null
    
    // Status: registered - waiting for admin approval OR waiting for preliminary entry to open
    if (reg.status === 'registered') {
      if (eventData.preliminaryEntryOpen) {
        return { 
          action: 'action', 
          actionType: 'preliminary',
          message: 'Submit preliminary entry now',
          phase: 'preliminary-open',
          color: 'bg-green-100 text-green-700'
        }
      }
      if (prelimStart && prelimStart > now) {
        const daysUntil = Math.ceil((prelimStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return { 
          action: 'wait', 
          message: `Preliminary entries open in ${daysUntil} days`,
          phase: 'awaiting-preliminary',
          color: 'bg-blue-100 text-blue-700'
        }
      }
      return { 
        action: 'wait', 
        message: 'Waiting for preliminary entries to open',
        phase: 'awaiting-preliminary',
        color: 'bg-blue-100 text-blue-700'
      }
    }
    
    // Status: preliminary_pending or preliminary_submitted - admin needs to approve
    if (['preliminary_pending', 'preliminary_submitted'].includes(reg.status)) {
      return { 
        action: 'wait', 
        message: 'Admin reviewing your preliminary entry',
        phase: 'admin-review',
        color: 'bg-yellow-100 text-yellow-700'
      }
    }
    
    // Status: preliminary_approved - can submit final OR waiting for final to open
    if (reg.status === 'preliminary_approved') {
      if (eventData.finalEntryOpen) {
        return { 
          action: 'action', 
          actionType: 'final',
          message: 'Submit final entry now',
          phase: 'final-open',
          color: 'bg-green-100 text-green-700'
        }
      }
      if (finalStart && finalStart > now) {
        const daysUntil = Math.ceil((finalStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return { 
          action: 'wait', 
          message: `Final entries open in ${daysUntil} days`,
          phase: 'awaiting-final',
          color: 'bg-blue-100 text-blue-700'
        }
      }
      return { 
        action: 'wait', 
        message: 'Waiting for final entries to open',
        phase: 'awaiting-final',
        color: 'bg-blue-100 text-blue-700'
      }
    }
    
    // Status: final_pending or final_submitted - admin needs to approve
    if (['final_pending', 'final_submitted'].includes(reg.status)) {
      return { 
        action: 'wait', 
        message: 'Admin reviewing your final entry',
        phase: 'admin-review',
        color: 'bg-yellow-100 text-yellow-700'
      }
    }
    
    // Status: final_approved - waiting for payment or competition
    if (reg.status === 'final_approved') {
      return { 
        action: 'info', 
        message: 'Entry approved! Prepare for competition',
        phase: 'approved',
        color: 'bg-green-100 text-green-700'
      }
    }
    
    // Status: payment_pending
    if (reg.status === 'payment_pending') {
      return { 
        action: 'action', 
        actionType: 'payment',
        message: 'Complete payment',
        phase: 'payment',
        color: 'bg-orange-100 text-orange-700'
      }
    }
    
    // Status: confirmed - all set
    if (reg.status === 'confirmed') {
      return { 
        action: 'info', 
        message: 'All set! See you at the competition',
        phase: 'confirmed',
        color: 'bg-green-100 text-green-700'
      }
    }
    
    return null
  }

  const activeRegistrations = registrations.filter(r => r.status !== 'withdrawn')
  const confirmedCount = registrations.filter(r => r.status === 'confirmed').length
  const pendingCount = registrations.filter(r => 
    ['registered', 'preliminary_pending', 'preliminary_submitted', 'final_pending', 'final_submitted', 'payment_pending'].includes(r.status)
  ).length
  const actionRequiredCount = activeRegistrations.filter(reg => {
    const action = getRequiredAction(reg)
    return action?.action === 'action'
  }).length

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

        {/* Summary Cards */}
        {activeRegistrations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            {/* Total Events */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Events</p>
                  <p className="text-2xl font-bold text-blue-900">{activeRegistrations.length}</p>
                </div>
              </div>
            </div>

            {/* Actions Required */}
            <div className={`border-2 rounded-lg p-5 ${actionRequiredCount > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${actionRequiredCount > 0 ? 'bg-red-600' : 'bg-gray-400'}`}>
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${actionRequiredCount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    Actions Required
                  </p>
                  <p className={`text-2xl font-bold ${actionRequiredCount > 0 ? 'text-red-900' : 'text-gray-900'}`}>
                    {actionRequiredCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmed */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Confirmed</p>
                  <p className="text-2xl font-bold text-green-900">{confirmedCount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't registered for any weightlifting competitions yet. Browse upcoming events and register to get started!
            </p>
            <Link href="/events">
              <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Browse Events
              </button>
            </Link>
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
  getRequiredAction: (reg: EventRegistration) => { action: string, actionType?: string, message: string, phase: string, color: string } | null
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
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-black mb-1 group-hover:underline">
                  {eventData.title}
                </h3>
                {/* Action Badge - Prominent */}
                {requiredAction && requiredAction.action === 'action' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    ACTION NEEDED
                  </span>
                )}
              </div>
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

          {/* Action Status Box */}
          {requiredAction && (
            <div className={`mt-4 ml-16 p-4 rounded-lg border-2 ${requiredAction.color} border-current`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1">
                    {requiredAction.action === 'action' ? '⚡ Action Required' : 
                     requiredAction.action === 'wait' ? '⏳ Waiting' : 
                     '✓ Status Update'}
                  </p>
                  <p className="text-sm">{requiredAction.message}</p>
                </div>
                {requiredAction.action === 'action' && (
                  <Link href={`/events/${eventData.slug}`}>
                    <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm whitespace-nowrap">
                      Take Action
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Event Button */}
        <div className="flex lg:flex-col lg:items-end">
          <Link href={`/events/${eventData.slug}`} className="flex-1 lg:flex-initial">
            <button className="w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
