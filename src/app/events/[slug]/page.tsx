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
  slug: string
  description: string
  event_type: string
  location?: string
  venue?: string
  start_date: string
  end_date?: string
  cover_image?: string
  organizer?: string
  max_participants?: number
  current_participants?: number
  entry_fee?: number
  event_status?: string
  registration_start_date?: string
  registration_end_date?: string
  preliminary_entry_start?: string
  preliminary_entry_deadline?: string
  final_entry_start?: string
  final_entry_deadline?: string
  weight_categories?: string[]
  require_qualifying_total?: boolean
  require_medical_clearance?: boolean
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
  
  const [regForm, setRegForm] = useState({
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
    
    if (event.final_entry_start && new Date(event.final_entry_start) <= now && 
        (!event.final_entry_deadline || new Date(event.final_entry_deadline) > now)) {
      return 'final_entries'
    }
    if (event.preliminary_entry_start && new Date(event.preliminary_entry_start) <= now && 
        (!event.preliminary_entry_deadline || new Date(event.preliminary_entry_deadline) > now)) {
      return 'preliminary_entries'
    }
    if (event.registration_start_date && new Date(event.registration_start_date) <= now && 
        (!event.registration_end_date || new Date(event.registration_end_date) > now)) {
      return 'registration'
    }
    if (event.registration_start_date && new Date(event.registration_start_date) > now) {
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
      'registered': { color: 'bg-blue-100 text-blue-700', label: 'Registered' },
      'preliminary_submitted': { color: 'bg-yellow-100 text-yellow-700', label: 'Preliminary Submitted' },
      'preliminary_approved': { color: 'bg-green-100 text-green-700', label: 'Preliminary Approved' },
      'final_submitted': { color: 'bg-yellow-100 text-yellow-700', label: 'Final Entry Submitted' },
      'final_approved': { color: 'bg-green-100 text-green-700', label: 'Final Entry Approved' },
      'payment_pending': { color: 'bg-orange-100 text-orange-700', label: 'Payment Pending' },
      'confirmed': { color: 'bg-green-100 text-green-700', label: 'Confirmed' },
      'withdrawn': { color: 'bg-gray-100 text-gray-700', label: 'Withdrawn' }
    }
    return badges[status] || { color: 'bg-gray-100 text-gray-700', label: status }
  }

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${params.slug}`)
      return
    }
    if (!regForm.weightCategory) {
      alert('Please select a weight category')
      return
    }
    setSubmitting(true)
    try {
      const response = await api.post('/registrations', { eventId: event?.id, ...regForm })
      setRegistration(response.data)
      setShowRegisterModal(false)
      alert('Successfully registered!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register')
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
      alert(err.response?.data?.message || 'Failed to submit')
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
      alert(err.response?.data?.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWithdraw = async () => {
    if (!confirm('Are you sure you want to withdraw?')) return
    try {
      await api.post(`/registrations/${registration?.id}/withdraw`)
      setRegistration(prev => prev ? { ...prev, status: 'withdrawn' } : null)
      alert('Successfully withdrawn')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to withdraw')
    }
  }

  const canRegister = () => getEventPhase() === 'registration' && !registration
  const canSubmitPreliminary = () => getEventPhase() === 'preliminary_entries' && registration && ['registered', 'preliminary_submitted'].includes(registration.status)
  const canSubmitFinal = () => getEventPhase() === 'final_entries' && registration && ['preliminary_approved', 'final_submitted'].includes(registration.status)

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading event...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-3">Event Not Found</h1>
          <Link href="/events" className="inline-block px-6 py-3 bg-black text-white rounded-lg">Back to Events</Link>
        </div>
      </div>
    )
  }

  const phase = getEventPhase()
  const statusBadge = registration ? getStatusBadge(registration.status) : null
  const currentGender = registration?.gender || regForm.gender

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/events" className="inline-flex items-center gap-2 text-black hover:text-gray-600 mb-3 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {event.cover_image && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full rounded-lg overflow-hidden mb-3 bg-gray-100 border-2 border-black" style={{ paddingBottom: '56.25%' }}>
                <Image src={event.cover_image} alt={event.title} fill className="object-cover" />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white">{event.event_type}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${phase === 'closed' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                  {getPhaseLabel(phase)}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">{event.title}</h1>
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            </motion.div>

            {registration && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 border-2 border-black rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-black">Your Registration</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge?.color}`}>{statusBadge?.label}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {registration.weight_category && <div><div className="text-gray-500">Category</div><div className="font-semibold text-black">{registration.weight_category}</div></div>}
                  {registration.entry_total && <div><div className="text-gray-500">Entry Total</div><div className="font-semibold text-black">{registration.entry_total}kg</div></div>}
                  {registration.snatch_opener && <div><div className="text-gray-500">Snatch Opener</div><div className="font-semibold text-black">{registration.snatch_opener}kg</div></div>}
                  {registration.cnj_opener && <div><div className="text-gray-500">C&J Opener</div><div className="font-semibold text-black">{registration.cnj_opener}kg</div></div>}
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  {canSubmitPreliminary() && <button onClick={() => setShowPreliminaryModal(true)} className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">Submit Preliminary Entry</button>}
                  {canSubmitFinal() && <button onClick={() => setShowFinalModal(true)} className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">Submit Final Entry</button>}
                  {registration.status !== 'withdrawn' && registration.status !== 'confirmed' && (
                    <button onClick={handleWithdraw} className="px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50">Withdraw</button>
                  )}
                </div>
              </motion.div>
            )}

            {(event.registration_start_date || event.preliminary_entry_start || event.final_entry_start) && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-3">
                <h3 className="text-base font-bold text-black mb-3">Important Dates</h3>
                <div className="space-y-4">
                  {event.registration_start_date && (
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${phase === 'registration' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div><div className="font-semibold text-black">Registration</div><div className="text-sm text-gray-600">{formatDateTime(event.registration_start_date)}{event.registration_end_date && ` - ${formatDateTime(event.registration_end_date)}`}</div></div>
                    </div>
                  )}
                  {event.preliminary_entry_start && (
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${phase === 'preliminary_entries' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div><div className="font-semibold text-black">Preliminary Entries</div><div className="text-sm text-gray-600">{formatDateTime(event.preliminary_entry_start)}{event.preliminary_entry_deadline && ` - ${formatDateTime(event.preliminary_entry_deadline)}`}</div></div>
                    </div>
                  )}
                  {event.final_entry_start && (
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${phase === 'final_entries' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div><div className="font-semibold text-black">Final Entries</div><div className="text-sm text-gray-600">{formatDateTime(event.final_entry_start)}{event.final_entry_deadline && ` - ${formatDateTime(event.final_entry_deadline)}`}</div></div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div><div className="font-semibold text-black">Competition</div><div className="text-sm text-gray-600">{formatDate(event.start_date)}</div></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-36">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border-2 border-black rounded-lg p-4 mb-6">
                <h3 className="text-xl font-bold text-black mb-6">Event Details</h3>
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
                    <button onClick={() => user ? setShowRegisterModal(true) : router.push(`/login?redirect=/events/${params.slug}`)} className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      Register for Event
                    </button>
                  </div>
                )}
                {!canRegister() && !registration && phase === 'upcoming' && event.registration_start_date && (
                  <div className="mt-6 text-center text-sm text-gray-500">Registration opens {formatDateTime(event.registration_start_date)}</div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg p-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-black mb-6">Register for Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select title="Select gender" value={regForm.gender} onChange={(e) => setRegForm({ ...regForm, gender: e.target.value, weightCategory: '' })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight Category *</label>
                <select title="Select weight category" value={regForm.weightCategory} onChange={(e) => setRegForm({ ...regForm, weightCategory: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none">
                  <option value="">Select category</option>
                  {WEIGHT_CATEGORIES[regForm.gender as keyof typeof WEIGHT_CATEGORIES].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <input type="text" value={regForm.clubName} onChange={(e) => setRegForm({ ...regForm, clubName: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Your weightlifting club" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Federation ID</label>
                <input type="text" value={regForm.federationId} onChange={(e) => setRegForm({ ...regForm, federationId: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Membership number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
                <input type="text" value={regForm.coachName} onChange={(e) => setRegForm({ ...regForm, coachName: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Your coach's name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coach Phone</label>
                <input type="tel" value={regForm.coachPhone} onChange={(e) => setRegForm({ ...regForm, coachPhone: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Coach contact number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={regForm.athleteNotes} onChange={(e) => setRegForm({ ...regForm, athleteNotes: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none" rows={3} placeholder="Any additional notes..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleRegister} disabled={submitting} className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">{submitting ? 'Registering...' : 'Register'}</button>
              <button onClick={() => setShowRegisterModal(false)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
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
