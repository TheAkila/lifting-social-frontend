'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'

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
  age_category?: string
  entry_total?: number
  best_snatch?: number
  best_clean_jerk?: number
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
  male: ['60', '65', '71', '79', '88', '94', '110', '110+'],
  female: ['48', '53', '58', '63', '69', '77', '86', '86+']
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
  
  const [regForm, setRegForm] = useState({
    // Team registration fields
    teamName: '',
    teamCode: '',
    teamManagerName: '',
    teamManagerPhone: '',
    ageCategory: ''
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
          confirmedWeightCategory: reg.confirmed_weight_category || reg.weight_category || ''
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

    // Validate team registration fields
    if (!regForm.teamName) {
      alert('Please enter your team name')
      return
    }
    if (!regForm.teamCode) {
      alert('Please enter team code')
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
    if (!regForm.ageCategory) {
      alert('Please select age category')
      return
    }

    setSubmitting(true)
    try {
      const requestData: any = {
        competitionId: event?.id,
        isTeamRegistration: true,
        teamName: regForm.teamName,
        teamCode: regForm.teamCode,
        teamManagerName: regForm.teamManagerName,
        teamManagerPhone: regForm.teamManagerPhone,
        ageCategory: regForm.ageCategory
      }

      console.log('Submitting registration with data:', requestData)
      const response = await api.post('/registrations', requestData)
      setRegistration(response.data)
      setShowRegisterModal(false)
      alert('Team registration submitted! Awaiting admin approval.')
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
    setSubmitting(true)
    try {
      const response = await api.post(`/registrations/${registration?.id}/final`, {
        confirmedWeightCategory: finalForm.confirmedWeightCategory || registration?.weight_category,
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

  const canRegister = () => !registration && event && (event.registration_open || event.is_registration_open || getEventPhase() === 'registration')
  const canSubmitPreliminary = () => getEventPhase() === 'preliminary_entries' && registration && ['registered', 'preliminary_submitted'].includes(registration.status)
  const canSubmitFinal = () => getEventPhase() === 'final_entries' && registration && ['preliminary_approved', 'final_submitted'].includes(registration.status)
  const isLiveEvent = () => {
    if (!event) return false
    const status = (event.event_status || event.status || '').toLowerCase()
    return ['in_progress', 'live', 'active', 'ongoing'].includes(status)
  }

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
  const currentGender = registration?.gender || 'male'

  return (
    <div className="min-h-screen pt-12 sm:pt-16 bg-zinc-50">
      <div className="container-custom py-2 sm:py-4 px-4 sm:px-6 lg:px-8">
        <Link href="/events" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-6 sm:mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            {event.cover_image && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full rounded-card overflow-hidden mb-3 sm:mb-4 bg-zinc-200" style={{ paddingBottom: '50%' }}>
                <Image src={event.cover_image} alt={event.title} fill className="object-cover" />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-3 sm:mb-4">
              <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                <span className={`px-3 py-1 rounded-badge text-xs font-medium ${phase === 'closed' ? 'bg-zinc-200 text-zinc-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {getPhaseLabel(phase)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-zinc-900 mb-2 sm:mb-3">{event.title}</h1>
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">{event.description}</p>
            </motion.div>

            {(event.registration_start_date || event.preliminary_entry_start || event.final_entry_start) && (
              <div className="bg-white border border-zinc-200 rounded-card p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
                <h3 className="text-base font-display font-semibold text-zinc-900 mb-3">Important Dates</h3>
                <div className="space-y-2">
                  {event.registration_start_date && (
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${phase === 'registration' ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                      <div><div className="font-semibold text-zinc-900 text-xs">Registration</div><div className="text-xs text-zinc-600 mt-0.5">{formatDateTime(event.registration_start_date)}{event.registration_end_date && ` - ${formatDateTime(event.registration_end_date)}`}</div></div>
                    </div>
                  )}
                  {event.preliminary_entry_start && (
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${phase === 'preliminary_entries' ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                      <div><div className="font-semibold text-zinc-900 text-xs">Preliminary Entries</div><div className="text-xs text-zinc-600 mt-0.5">{formatDateTime(event.preliminary_entry_start)}{event.preliminary_entry_deadline && ` - ${formatDateTime(event.preliminary_entry_deadline)}`}</div></div>
                    </div>
                  )}
                  {event.final_entry_start && (
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${phase === 'final_entries' ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                      <div><div className="font-semibold text-zinc-900 text-xs">Final Entries</div><div className="text-xs text-zinc-600 mt-0.5">{formatDateTime(event.final_entry_start)}{event.final_entry_deadline && ` - ${formatDateTime(event.final_entry_deadline)}`}</div></div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1 bg-zinc-300 flex-shrink-0"></div>
                    <div><div className="font-semibold text-zinc-900 text-xs">Competition</div><div className="text-xs text-zinc-600 mt-0.5">{formatDate(event.start_date)}</div></div>
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
                  <div>
                    <div className="font-semibold text-black text-sm mb-1">Date</div>
                    <div className="text-sm text-gray-600">{formatDate(event.start_date)}{event.end_date && event.end_date !== event.start_date && ` to ${formatDate(event.end_date)}`}</div>
                  </div>
                  {event.location && (
                    <div>
                      <div className="font-semibold text-black text-sm mb-1">Location</div>
                      <div className="text-sm text-gray-600">{event.location}</div>
                    </div>
                  )}
                  {event.organizer && (
                    <div>
                      <div className="font-semibold text-black text-sm mb-1">Organizer</div>
                      <div className="text-sm text-gray-600">{event.organizer}</div>
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
                {isLiveEvent() && (
                  <div className="mt-3">
                    <Link
                      href={`/events/${params.slug}/live`}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors text-xs sm:text-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Watch Live Scoreboard
                    </Link>
                  </div>
                )}
                {!canRegister() && !registration && phase === 'upcoming' && event.registration_start_date && (
                  <div className="mt-6 text-center text-sm text-zinc-500">Registration opens {formatDateTime(event.registration_start_date)}</div>
                )}
              </motion.div>

              {registration && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-50 border border-blue-200 rounded-card p-5 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-900 text-sm">
                        {registration.is_team_registration ? 'Team Registered' : 'Registered'}
                      </h3>
                      <p className="text-xs text-zinc-600 mt-0.5">{statusBadge?.label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full px-3 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors text-xs sm:text-sm"
                  >
                    View in Dashboard
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-card p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-zinc-900 mb-4 sm:mb-6">Team Registration</h2>
            
            <div className="space-y-4 sm:space-y-5">
                  {/* Team Registration Fields */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-zinc-700 mb-2">Team Name *</label>
                    <input 
                      type="text" 
                      value={regForm.teamName} 
                      onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })} 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400 text-sm" 
                      placeholder="e.g., University of Colombo Weightlifting" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-zinc-700 mb-2">Team Code *</label>
                    <input 
                      type="text" 
                      value={regForm.teamCode} 
                      onChange={(e) => setRegForm({ ...regForm, teamCode: e.target.value.toUpperCase() })} 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400 text-sm" 
                      placeholder="e.g., LKA, USA, TEAM01" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-zinc-700 mb-2">Team Manager Name *</label>
                    <input 
                      type="text" 
                      value={regForm.teamManagerName} 
                      onChange={(e) => setRegForm({ ...regForm, teamManagerName: e.target.value })} 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400 text-sm" 
                      placeholder="Manager/Coach/Captain name" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-zinc-700 mb-2">Manager Phone Number *</label>
                    <input 
                      type="tel" 
                      value={regForm.teamManagerPhone} 
                      onChange={(e) => setRegForm({ ...regForm, teamManagerPhone: e.target.value })} 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 placeholder:text-zinc-400 text-sm" 
                      placeholder="+94771234567" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-zinc-700 mb-2">Age Category *</label>
                    <select 
                      title="Select age category" 
                      value={regForm.ageCategory} 
                      onChange={(e) => setRegForm({ ...regForm, ageCategory: e.target.value })} 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-300 rounded-input focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-zinc-900 text-sm"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Youth">Youth</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Note:</strong> You will be able to add individual athletes during the preliminary entry period.
                    </p>
                  </div>

            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button onClick={handleRegister} disabled={submitting} className="flex-1 btn-primary disabled:opacity-50 text-sm sm:text-base py-2 sm:py-2.5">
                {submitting ? 'Registering...' : 'Register Team'}
              </button>
              <button onClick={() => setShowRegisterModal(false)} className="btn-secondary text-sm sm:text-base py-2 sm:py-2.5">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Preliminary Entry Modal */}
      {showPreliminaryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Preliminary Entry</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Weight Category *</label>
                <select title="Select weight category" value={prelimForm.weightCategory} onChange={(e) => setPrelimForm({ ...prelimForm, weightCategory: e.target.value })} className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm">
                  <option value="">Select category</option>
                  {WEIGHT_CATEGORIES[currentGender as keyof typeof WEIGHT_CATEGORIES].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Entry Total (kg) *</label>
                <input type="number" value={prelimForm.entryTotal} onChange={(e) => setPrelimForm({ ...prelimForm, entryTotal: e.target.value })} className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm" placeholder="Your planned total" />
                <p className="text-xs text-gray-500 mt-1">This determines your competition session/group</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Best Snatch (kg)</label>
                  <input type="number" value={prelimForm.bestSnatch} onChange={(e) => setPrelimForm({ ...prelimForm, bestSnatch: e.target.value })} className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm" placeholder="Best snatch" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Best C&J (kg)</label>
                  <input type="number" value={prelimForm.bestCleanJerk} onChange={(e) => setPrelimForm({ ...prelimForm, bestCleanJerk: e.target.value })} className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm" placeholder="Best C&J" />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <input type="text" value={prelimForm.clubName} onChange={(e) => setPrelimForm({ ...prelimForm, clubName: e.target.value })} className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm" placeholder="Your club name" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Coach Name</label>
                <input type="text" value={prelimForm.coachName} onChange={(e) => setPrelimForm({ ...prelimForm, coachName: e.target.value })} className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm" placeholder="Your coach name" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button onClick={handlePreliminarySubmit} disabled={submitting} className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base">{submitting ? 'Submitting...' : 'Submit Preliminary Entry'}</button>
              <button onClick={() => setShowPreliminaryModal(false)} className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm sm:text-base">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Final Entry Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Final Entry</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Confirmed Weight Category</label>
                <select title="Select confirmed weight category" value={finalForm.confirmedWeightCategory} onChange={(e) => setFinalForm({ ...finalForm, confirmedWeightCategory: e.target.value })} className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm">
                  <option value="">Same as preliminary ({registration?.weight_category})</option>
                  {WEIGHT_CATEGORIES[currentGender as keyof typeof WEIGHT_CATEGORIES].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              {event.require_medical_clearance && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <input type="checkbox" id="medical" checked={finalForm.medicalClearance} onChange={(e) => setFinalForm({ ...finalForm, medicalClearance: e.target.checked })} className="w-5 h-5 border-2 border-gray-300 rounded" />
                  <label htmlFor="medical" className="text-xs sm:text-sm text-gray-700">I confirm I have medical clearance to compete</label>
                </div>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800"><strong>Note:</strong> Opening attempts will be collected at weigh-in on competition day.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button onClick={handleFinalSubmit} disabled={submitting} className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base">{submitting ? 'Submitting...' : 'Submit Final Entry'}</button>
              <button onClick={() => setShowFinalModal(false)} className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-sm sm:text-base">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  )
}
