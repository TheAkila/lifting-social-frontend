'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'
import FinalEntryForm from '@/components/FinalEntryForm'
import PreliminaryEntryForm from '@/components/PreliminaryEntryForm'

interface Event {
  id: string
  title: string
  name?: string  // From competitions table
  slug: string
  description: string
  event_type: string
  location?: string
  venue?: string
  start_date: string
  date?: string  // From competitions table
  end_date?: string
  cover_image?: string
  organizer?: string
  max_participants?: number
  current_participants?: number
  entry_fee?: number
  event_status?: string
  status?: string  // From competitions table
  // New unified schema fields
  registration_open?: boolean
  registration_start?: string
  registration_end?: string
  registration_start_date?: string  // Legacy compatibility
  registration_end_date?: string  // Legacy compatibility
  preliminary_entry_open?: boolean
  preliminary_entry_start?: string
  preliminary_entry_end?: string
  preliminary_entry_deadline?: string  // Legacy compatibility
  final_entry_open?: boolean
  final_entry_start?: string
  final_entry_end?: string
  final_entry_deadline?: string  // Legacy compatibility
  weight_categories?: string[]
  require_qualifying_total?: boolean
  require_medical_clearance?: boolean
  is_registration_open?: boolean  // Mapped field
}

interface Registration {
  id: string
  status: string
  weight_category?: string
  gender?: string
  entry_total?: number
  best_snatch?: number
  best_clean_jerk?: number
  snatch_opener?: number
  cnj_opener?: number
  payment_status: string
  registered_at: string
  club_name?: string
  coach_name?: string
  confirmed_weight_category?: string
  // Team registration fields
  is_team_registration?: boolean
  parent_registration_id?: string
  team_manager_name?: string
  team_manager_phone?: string
  team_manager_email?: string
  team_size?: number
  registered_athletes_count?: number
  athlete_name?: string
}

const WEIGHT_CATEGORIES = {
  male: ['55kg', '61kg', '67kg', '73kg', '81kg', '89kg', '96kg', '102kg', '109kg', '+109kg'],
  female: ['45kg', '49kg', '55kg', '59kg', '64kg', '71kg', '76kg', '81kg', '87kg', '+87kg']
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showPreliminaryModal, setShowPreliminaryModal] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isTeamRegistration, setIsTeamRegistration] = useState(true) // Default to team registration
  
  const [regForm, setRegForm] = useState({
    // Team registration fields
    teamName: '',
    teamManagerName: '',
    teamManagerPhone: '',
    teamManagerEmail: '',
    teamSize: '',
    notes: '',
    // Individual registration fields (kept for backwards compatibility)
    gender: 'male',
    weightCategory: '',
    clubName: '',
    federationId: '',
    coachName: '',
    coachPhone: '',
    coachEmail: '',
    athleteNotes: ''
  })

  const [prelimForm, setPrelimForm] = useState({
    weightCategory: '',
    entryTotal: '',
    bestSnatch: '',
    bestCleanJerk: '',
    clubName: '',
    federationId: '',
    coachName: '',
    coachPhone: '',
    coachEmail: ''
  })

  const [finalForm, setFinalForm] = useState({
    confirmedWeightCategory: '',
    snatchOpener: '',
    cnjOpener: '',
    medicalClearance: false
  })

  useEffect(() => {
    if (params.slug) {
      loadEvent()
    }
  }, [params.slug])

  useEffect(() => {
    if (event && user) {
      checkRegistration()
    }
  }, [event, user])

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

  const checkRegistration = async () => {
    if (!event) return
    try {
      const response = await api.get(`/registrations/check/${event.id}`)
      if (response.data.registered) {
        setRegistration(response.data.registration)
        const reg = response.data.registration
        setRegForm(prev => ({ ...prev, gender: reg.gender || 'male' }))
        setPrelimForm(prev => ({
          ...prev,
          weightCategory: reg.weight_category || '',
          entryTotal: reg.entry_total?.toString() || '',
          bestSnatch: reg.best_snatch?.toString() || '',
          bestCleanJerk: reg.best_clean_jerk?.toString() || '',
          clubName: reg.club_name || '',
          coachName: reg.coach_name || ''
        }))
        setFinalForm(prev => ({
          ...prev,
          confirmedWeightCategory: reg.confirmed_weight_category || reg.weight_category || '',
          snatchOpener: reg.snatch_opener?.toString() || '',
          cnjOpener: reg.cnj_opener?.toString() || ''
        }))
      }
    } catch (err) {
      console.error('Failed to check registration', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    })
  }

  const getEventPhase = () => {
    if (!event) return 'unknown'
    const now = new Date()
    
    // Use boolean flags from unified schema (primary method)
    if (event.final_entry_open) {
      return 'final_entries'
    }
    if (event.preliminary_entry_open) {
      return 'preliminary_entries'
    }
    if (event.registration_open || event.is_registration_open) {
      return 'registration'
    }
    
    // Fallback to date-based checks for backwards compatibility
    const regStart = event.registration_start || event.registration_start_date
    const regEnd = event.registration_end || event.registration_end_date
    const prelimStart = event.preliminary_entry_start
    const prelimEnd = event.preliminary_entry_end || event.preliminary_entry_deadline
    const finalStart = event.final_entry_start
    const finalEnd = event.final_entry_end || event.final_entry_deadline
    
    if (finalStart && new Date(finalStart) <= now && 
        (!finalEnd || new Date(finalEnd) > now)) {
      return 'final_entries'
    }
    if (prelimStart && new Date(prelimStart) <= now && 
        (!prelimEnd || new Date(prelimEnd) > now)) {
      return 'preliminary_entries'
    }
    if (regStart && new Date(regStart) <= now && 
        (!regEnd || new Date(regEnd) > now)) {
      return 'registration'
    }
    if (regStart && new Date(regStart) > now) {
      return 'upcoming'
    }
    return 'closed'
  }

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      'upcoming': 'Registration Opens Soon',
      'registration': 'Registration Open',
      'preliminary_entries': 'Preliminary Entries Open',
      'final_entries': 'Final Entries Open',
      'closed': 'Entries Closed'
    }
    return labels[phase] || phase
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string, label: string }> = {
      'pending': { color: 'bg-yellow-100 text-yellow-700', label: 'Pending Approval' },
      'registered': { color: 'bg-blue-100 text-blue-700', label: 'Registered' },
      // Preliminary entry statuses
      'preliminary_pending': { color: 'bg-yellow-100 text-yellow-700', label: 'Preliminary Pending' },
      'preliminary_submitted': { color: 'bg-yellow-100 text-yellow-700', label: 'Preliminary Submitted' },
      'preliminary_approved': { color: 'bg-green-100 text-green-700', label: 'Preliminary Approved' },
      'preliminary_rejected': { color: 'bg-red-100 text-red-700', label: 'Preliminary Rejected' },
      // Final entry statuses
      'final_pending': { color: 'bg-yellow-100 text-yellow-700', label: 'Final Entry Pending' },
      'final_submitted': { color: 'bg-yellow-100 text-yellow-700', label: 'Final Entry Submitted' },
      'final_approved': { color: 'bg-green-100 text-green-700', label: 'Final Entry Approved' },
      'final_rejected': { color: 'bg-red-100 text-red-700', label: 'Final Entry Rejected' },
      // Other statuses
      'payment_pending': { color: 'bg-orange-100 text-orange-700', label: 'Payment Pending' },
      'confirmed': { color: 'bg-green-100 text-green-700', label: 'Confirmed' },
      'checked_in': { color: 'bg-purple-100 text-purple-700', label: 'Checked In' },
      'competing': { color: 'bg-indigo-100 text-indigo-700', label: 'Competing' },
      'completed': { color: 'bg-green-100 text-green-700', label: 'Completed' },
      'withdrawn': { color: 'bg-gray-100 text-gray-700', label: 'Withdrawn' },
      'disqualified': { color: 'bg-red-100 text-red-700', label: 'Disqualified' }
    }
    return badges[status] || { color: 'bg-gray-100 text-gray-700', label: status }
  }

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${params.slug}`)
      return
    }

    // Check if auth token exists
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    if (!token) {
      alert('Your session has expired. Please log in again.')
      router.push(`/login?redirect=/events/${params.slug}`)
      return
    }

    // Validate based on registration type
    if (isTeamRegistration) {
      if (!regForm.teamName) {
        alert('Please enter your team name')
        return
      }
      if (!regForm.teamManagerName) {
        alert('Please enter team manager name')
        return
      }
      if (!regForm.teamManagerPhone) {
        alert('Please enter team manager phone')
        return
      }
    } else {
      // Individual registration validation
      if (!regForm.gender) {
        alert('Please select gender')
        return
      }
      if (!regForm.weightCategory) {
        alert('Please select weight category')
        return
      }
    }

    setSubmitting(true)
    try {
      const requestData: any = {
        competitionId: event?.id,
        isTeamRegistration: isTeamRegistration
      }

      if (isTeamRegistration) {
        // Team registration data
        requestData.teamName = regForm.teamName
        requestData.teamManagerName = regForm.teamManagerName
        requestData.teamManagerPhone = regForm.teamManagerPhone
        requestData.teamManagerEmail = regForm.teamManagerEmail || undefined
        requestData.teamSize = regForm.teamSize ? parseInt(regForm.teamSize) : 0
        requestData.notes = regForm.notes || undefined
      } else {
        // Individual registration data
        requestData.gender = regForm.gender
        requestData.weightCategory = regForm.weightCategory
        requestData.clubName = regForm.clubName || undefined
        requestData.coachName = regForm.coachName || undefined
        requestData.coachPhone = regForm.coachPhone || undefined
        requestData.coachEmail = regForm.coachEmail || undefined
        requestData.athleteNotes = regForm.athleteNotes || undefined
        requestData.federationId = regForm.federationId || undefined
      }

      console.log('Submitting registration with data:', requestData)
      const response = await api.post('/registrations', requestData)
      setRegistration(response.data)
      setShowRegisterModal(false)
      alert(isTeamRegistration ? 'Team registration submitted! Awaiting admin approval.' : 'Registration submitted! Awaiting admin approval.')
      // Reload registration data
      await checkRegistration()
    } catch (err: any) {
      console.error('Registration error:', err)
      console.error('Error response:', err.response)
      console.error('Error status:', err.response?.status)
      console.error('Error data:', err.response?.data)
      
      // Check if it's an authentication error
      if (err.response?.status === 401 || err.authError) {
        // Clear storage and force re-login
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        sessionStorage.removeItem('authToken')
        sessionStorage.removeItem('userData')
        
        alert('Your session has expired. Please log in again.')
        router.push(`/login?redirect=/events/${params.slug}`)
      } else if (err.response?.status === 400) {
        // Handle bad request errors (validation, already registered, etc.)
        alert(err.response?.data?.message || 'Invalid registration data. Please check your information.')
      } else if (err.response?.status === 404) {
        alert('Event not found. Please refresh the page and try again.')
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to register. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handlePreliminarySubmit = async () => {
    if (!prelimForm.weightCategory || !prelimForm.entryTotal) {
      alert('Weight category and entry total are required')
      return
    }
    setSubmitting(true)
    try {
      const response = await api.post(`/registrations/${registration?.id}/preliminary`, {
        weightCategory: prelimForm.weightCategory,
        entryTotal: parseInt(prelimForm.entryTotal),
        bestSnatch: prelimForm.bestSnatch ? parseInt(prelimForm.bestSnatch) : null,
        bestCleanJerk: prelimForm.bestCleanJerk ? parseInt(prelimForm.bestCleanJerk) : null,
        clubName: prelimForm.clubName,
        federationId: prelimForm.federationId,
        coachName: prelimForm.coachName,
        coachPhone: prelimForm.coachPhone,
        coachEmail: prelimForm.coachEmail
      })
      setRegistration(response.data)
      setShowPreliminaryModal(false)
      alert('Preliminary entry submitted!')
    } catch (err: any) {
      console.error('Preliminary submission error:', err)
      
      if (err.response?.status === 401 || err.authError) {
        alert('Your session has expired. Please log in again.')
        router.push(`/login?redirect=/events/${params.slug}`)
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to submit')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleFinalSubmit = async () => {
    if (!finalForm.snatchOpener || !finalForm.cnjOpener) {
      alert('Opening attempts are required')
      return
    }
    setSubmitting(true)
    try {
      const response = await api.post(`/registrations/${registration?.id}/final`, {
        confirmedWeightCategory: finalForm.confirmedWeightCategory || registration?.weight_category,
        snatchOpener: parseInt(finalForm.snatchOpener),
        cnjOpener: parseInt(finalForm.cnjOpener),
        medicalClearance: finalForm.medicalClearance
      })
      setRegistration(response.data)
      setShowFinalModal(false)
      alert('Final entry submitted!')
    } catch (err: any) {
      console.error('Final submission error:', err)
      
      if (err.response?.status === 401 || err.authError) {
        alert('Your session has expired. Please log in again.')
        router.push(`/login?redirect=/events/${params.slug}`)
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to submit')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const canRegister = () => getEventPhase() === 'registration' && !registration
  const canSubmitPreliminary = () => getEventPhase() === 'preliminary_entries' && registration && ['registered', 'preliminary_submitted'].includes(registration.status)
  const canSubmitFinal = () => getEventPhase() === 'final_entries' && registration && ['preliminary_approved', 'final_submitted'].includes(registration.status)

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-zinc-50 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading event...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-zinc-900 mb-3">Event Not Found</h1>
          <Link href="/events" className="inline-block px-6 py-3 btn-primary">Back to Events</Link>
        </div>
      </div>
    )
  }

  const phase = getEventPhase()
  const statusBadge = registration ? getStatusBadge(registration.status) : null
  const currentGender = registration?.gender || regForm.gender

  return (
    <div className="min-h-screen pt-20 bg-zinc-50">
      <div className="container-custom py-8">
        <Link href="/events" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {event.cover_image && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full rounded-card overflow-hidden mb-6 bg-zinc-200" style={{ paddingBottom: '56.25%' }}>
                <Image src={event.cover_image} alt={event.title} fill className="object-cover" />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-badge text-xs font-medium bg-zinc-900 text-white">{event.event_type}</span>
                <span className={`px-3 py-1.5 rounded-badge text-xs font-medium ${phase === 'closed' ? 'bg-zinc-200 text-zinc-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {getPhaseLabel(phase)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-zinc-900 mb-4">{event.title}</h1>
              <p className="text-base text-zinc-600 leading-relaxed">{event.description}</p>
            </motion.div>

            {registration && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-zinc-200 rounded-card p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-display font-semibold text-zinc-900 mb-2">
                      {registration.is_team_registration ? 'Team Registered' : 'Registered'}
                    </h3>
                    <p className="text-zinc-600">
                      Manage your registration, preliminary entries, and final entries from your dashboard.
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-badge text-xs font-medium ${statusBadge?.color}`}>{statusBadge?.label}</span>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 px-6 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                >
                  Go to Dashboard →
                </button>
              </motion.div>
            )}

            {(event.registration_start_date || event.preliminary_entry_start || event.final_entry_start) && (
              <div className="bg-white border border-zinc-200 rounded-card p-6 mb-8 shadow-sm">
                <h3 className="text-lg font-display font-semibold text-zinc-900 mb-6">Important Dates</h3>
                <div className="space-y-4">
                  {event.registration_start_date && (
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${phase === 'registration' ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                      <div><div className="font-semibold text-zinc-900">Registration</div><div className="text-sm text-zinc-600 mt-0.5">{formatDateTime(event.registration_start_date)}{event.registration_end_date && ` - ${formatDateTime(event.registration_end_date)}`}</div></div>
                    </div>
                  )}
                  {event.preliminary_entry_start && (
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${phase === 'preliminary_entries' ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                      <div><div className="font-semibold text-zinc-900">Preliminary Entries</div><div className="text-sm text-zinc-600 mt-0.5">{formatDateTime(event.preliminary_entry_start)}{event.preliminary_entry_deadline && ` - ${formatDateTime(event.preliminary_entry_deadline)}`}</div></div>
                    </div>
                  )}
                  {event.final_entry_start && (
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${phase === 'final_entries' ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                      <div><div className="font-semibold text-zinc-900">Final Entries</div><div className="text-sm text-zinc-600 mt-0.5">{formatDateTime(event.final_entry_start)}{event.final_entry_deadline && ` - ${formatDateTime(event.final_entry_deadline)}`}</div></div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full mt-1.5 bg-zinc-300 flex-shrink-0"></div>
                    <div><div className="font-semibold text-zinc-900">Competition</div><div className="text-sm text-zinc-600 mt-0.5">{formatDate(event.start_date)}</div></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-zinc-200 rounded-card p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-display font-semibold text-zinc-900 mb-6">Event Details</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <div><div className="font-semibold text-black text-sm mb-1">Date</div><div className="text-sm text-gray-600">{formatDate(event.start_date)}{event.end_date && event.end_date !== event.start_date && ` to ${formatDate(event.end_date)}`}</div></div>
                  </div>
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                      <div><div className="font-semibold text-black text-sm mb-1">Location</div><div className="text-sm text-gray-600">{event.location}</div>{event.venue && <div className="text-sm text-gray-500">{event.venue}</div>}</div>
                    </div>
                  )}
                  {event.max_participants && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-black text-sm mb-1">Participants</div>
                        <div className="text-sm text-gray-600">{event.current_participants || 0} / {event.max_participants}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-black rounded-full h-2" style={{ width: `${Math.min(100, ((event.current_participants || 0) / event.max_participants) * 100)}%` }}></div></div>
                      </div>
                    </div>
                  )}
                  {event.entry_fee && (
                    <div className="flex items-start gap-3">
                      <div><div className="font-semibold text-black text-sm mb-1">Entry Fee</div><div className="text-sm text-gray-600">Rs. {event.entry_fee.toLocaleString()}</div></div>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex items-start gap-3">
                      <div><div className="font-semibold text-black text-sm mb-1">Organizer</div><div className="text-sm text-gray-600">{event.organizer}</div></div>
                    </div>
                  )}
                </div>
                {canRegister() && (
                  <div className="mt-6">
                    <button onClick={() => user ? setShowRegisterModal(true) : router.push(`/login?redirect=/events/${params.slug}`)} className="w-full btn-primary">
                      Register for Event
                    </button>
                  </div>
                )}
                {!canRegister() && !registration && phase === 'upcoming' && event.registration_start_date && (
                  <div className="mt-6 text-center text-sm text-zinc-500">Registration opens {formatDateTime(event.registration_start_date)}</div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Preliminary Entry Form Display */}
        {phase === 'preliminary_entries' && event.preliminary_entry_open && (
          <div className="mt-12">
            <PreliminaryEntryForm eventId={event.id} eventTitle={event.title || event.name || 'Preliminary Entry Form'} />
          </div>
        )}

        {/* Final Entry Form Display */}
        {phase === 'final_entries' && event.final_entry_open && (
          <div className="mt-12">
            <FinalEntryForm eventId={event.id} eventTitle={event.title || event.name || 'Final Entry Form'} />
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-display font-semibold text-zinc-900 mb-6">Register for Event</h2>
            
            {/* Registration Type Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 mb-3">Registration Type</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsTeamRegistration(true)}
                  className={`flex-1 px-4 py-3 rounded-input border-2 font-medium transition-colors ${
                    isTeamRegistration
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  Team Registration
                </button>
                <button
                  onClick={() => setIsTeamRegistration(false)}
                  className={`flex-1 px-4 py-3 rounded-input border-2 font-medium transition-colors ${
                    !isTeamRegistration
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  Individual Registration
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {isTeamRegistration ? (
                <>
                  {/* Team Registration Fields */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Team Name *</label>
                    <input 
                      type="text" 
                      value={regForm.teamName} 
                      onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      placeholder="e.g., University of Colombo Weightlifting" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Team Manager Name *</label>
                    <input 
                      type="text" 
                      value={regForm.teamManagerName} 
                      onChange={(e) => setRegForm({ ...regForm, teamManagerName: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      placeholder="Manager/Coach/Captain name" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Manager Phone Number *</label>
                    <input 
                      type="tel" 
                      value={regForm.teamManagerPhone} 
                      onChange={(e) => setRegForm({ ...regForm, teamManagerPhone: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      placeholder="+94771234567" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Manager Email</label>
                    <input 
                      type="email" 
                      value={regForm.teamManagerEmail} 
                      onChange={(e) => setRegForm({ ...regForm, teamManagerEmail: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      placeholder="manager@example.com (optional)" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Expected Team Size</label>
                    <input 
                      type="number" 
                      value={regForm.teamSize} 
                      onChange={(e) => setRegForm({ ...regForm, teamSize: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      placeholder="Number of athletes (optional)" 
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Notes</label>
                    <textarea 
                      value={regForm.notes} 
                      onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      rows={3} 
                      placeholder="Any additional notes or special requirements..." 
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> You will be able to add individual athletes during the preliminary entry period.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Individual Registration Fields */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Gender *</label>
                    <select 
                      title="Select gender" 
                      value={regForm.gender} 
                      onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Weight Category *</label>
                    <select 
                      title="Select weight category" 
                      value={regForm.weightCategory} 
                      onChange={(e) => setRegForm({ ...regForm, weightCategory: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900"
                      required
                    >
                      <option value="">Select category</option>
                      {WEIGHT_CATEGORIES[regForm.gender as keyof typeof WEIGHT_CATEGORIES].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Club/Team Name</label>
                    <input 
                      type="text" 
                      value={regForm.clubName} 
                      onChange={(e) => setRegForm({ ...regForm, clubName: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      placeholder="Your club name (optional)" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Coach Name</label>
                    <input 
                      type="text" 
                      value={regForm.coachName} 
                      onChange={(e) => setRegForm({ ...regForm, coachName: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      placeholder="Your coach name (optional)" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Notes</label>
                    <textarea 
                      value={regForm.athleteNotes} 
                      onChange={(e) => setRegForm({ ...regForm, athleteNotes: e.target.value })} 
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400" 
                      rows={3} 
                      placeholder="Any additional notes..." 
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={handleRegister} disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
                {submitting ? 'Registering...' : isTeamRegistration ? 'Register Team' : 'Register'}
              </button>
              <button onClick={() => setShowRegisterModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Preliminary Entry Modal */}
      {showPreliminaryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg p-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-black mb-6">Preliminary Entry</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight Category *</label>
                <select title="Select weight category" value={prelimForm.weightCategory} onChange={(e) => setPrelimForm({ ...prelimForm, weightCategory: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none">
                  <option value="">Select category</option>
                  {WEIGHT_CATEGORIES[currentGender as keyof typeof WEIGHT_CATEGORIES].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Total (kg) *</label>
                <input type="number" value={prelimForm.entryTotal} onChange={(e) => setPrelimForm({ ...prelimForm, entryTotal: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Your planned total" />
                <p className="text-xs text-gray-500 mt-1">This determines your competition session/group</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Best Snatch (kg)</label>
                  <input type="number" value={prelimForm.bestSnatch} onChange={(e) => setPrelimForm({ ...prelimForm, bestSnatch: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Best snatch" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Best C&J (kg)</label>
                  <input type="number" value={prelimForm.bestCleanJerk} onChange={(e) => setPrelimForm({ ...prelimForm, bestCleanJerk: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Best C&J" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <input type="text" value={prelimForm.clubName} onChange={(e) => setPrelimForm({ ...prelimForm, clubName: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Your club name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
                <input type="text" value={prelimForm.coachName} onChange={(e) => setPrelimForm({ ...prelimForm, coachName: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Your coach name" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handlePreliminarySubmit} disabled={submitting} className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Preliminary Entry'}</button>
              <button onClick={() => setShowPreliminaryModal(false)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Final Entry Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg p-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-black mb-6">Final Entry</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmed Weight Category</label>
                <select title="Select confirmed weight category" value={finalForm.confirmedWeightCategory} onChange={(e) => setFinalForm({ ...finalForm, confirmedWeightCategory: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none">
                  <option value="">Same as preliminary ({registration?.weight_category})</option>
                  {WEIGHT_CATEGORIES[currentGender as keyof typeof WEIGHT_CATEGORIES].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Snatch Opening Attempt (kg) *</label>
                <input type="number" value={finalForm.snatchOpener} onChange={(e) => setFinalForm({ ...finalForm, snatchOpener: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="First snatch attempt" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clean & Jerk Opening Attempt (kg) *</label>
                <input type="number" value={finalForm.cnjOpener} onChange={(e) => setFinalForm({ ...finalForm, cnjOpener: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="First C&J attempt" />
              </div>
              {event.require_medical_clearance && (
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="medical" checked={finalForm.medicalClearance} onChange={(e) => setFinalForm({ ...finalForm, medicalClearance: e.target.checked })} className="w-5 h-5 border-2 border-gray-300 rounded" />
                  <label htmlFor="medical" className="text-sm text-gray-700">I confirm I have medical clearance to compete</label>
                </div>
              )}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800"><strong>Note:</strong> Opening attempts can only be increased after weigh-in, not decreased. Please enter conservative opening weights.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleFinalSubmit} disabled={submitting} className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Final Entry'}</button>
              <button onClick={() => setShowFinalModal(false)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  )
}
