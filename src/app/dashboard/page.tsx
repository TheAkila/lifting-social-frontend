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
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null)
  const [updateForm, setUpdateForm] = useState({
    weightCategory: '',
    gender: '',
    clubName: '',
    coachName: '',
    coachPhone: '',
    coachEmail: '',
    athleteNotes: '',
    teamName: '',
    teamManagerName: '',
    teamManagerPhone: '',
    teamManagerEmail: '',
    teamSize: ''
  })
  const [submitting, setSubmitting] = useState(false)

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
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Approval', icon: Clock },
      registered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Registered', icon: CheckCircle2 },
      // Preliminary statuses
      preliminary_pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Prelim Pending', icon: Clock },
      preliminary_submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Prelim Submitted', icon: Clock },
      preliminary_approved: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Prelim Approved', icon: CheckCircle2 },
      preliminary_rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Prelim Rejected', icon: AlertCircle },
      // Final statuses
      final_pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Final Pending', icon: Clock },
      final_submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Final Submitted', icon: Clock },
      final_approved: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Final Approved', icon: CheckCircle2 },
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

  const handleDeleteRegistration = async (regId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete your registration for ${eventTitle}?`)) return
    
    try {
      await api.delete(`/registrations/${regId}`)
      alert('Registration deleted successfully')
      // Reload registrations
      loadRegistrations()
    } catch (err: any) {
      console.error('Failed to delete registration:', err)
      alert(err.response?.data?.message || 'Failed to delete registration. Please try again.')
    }
  }

  const handleUpdateRegistration = (reg: EventRegistration) => {
    setSelectedRegistration(reg)
    const isTeam = (reg as any).is_team_registration
    // Pre-fill form with existing data
    setUpdateForm({
      weightCategory: reg.weight_category || '',
      gender: (reg as any).gender || '',
      clubName: (reg as any).club_name || '',
      coachName: (reg as any).coach_name || '',
      coachPhone: (reg as any).coach_phone || '',
      coachEmail: (reg as any).coach_email || '',
      athleteNotes: (reg as any).athlete_notes || '',
      // For team registrations, team name is stored in club_name field
      teamName: isTeam ? ((reg as any).club_name || '') : '',
      teamManagerName: (reg as any).team_manager_name || '',
      teamManagerPhone: (reg as any).team_manager_phone || '',
      teamManagerEmail: (reg as any).team_manager_email || '',
      teamSize: (reg as any).team_size?.toString() || ''
    })
    setShowUpdateModal(true)
  }

  const handleSubmitUpdate = async () => {
    if (!selectedRegistration) return

    const isTeam = (selectedRegistration as any).is_team_registration

    // Validation
    if (isTeam) {
      if (!updateForm.teamName || !updateForm.teamManagerName || !updateForm.teamManagerPhone) {
        alert('Team name, manager name, and phone are required')
        return
      }
    } else {
      if (!updateForm.gender || !updateForm.weightCategory) {
        alert('Gender and weight category are required')
        return
      }
    }

    setSubmitting(true)
    try {
      const requestData: any = {
        isTeamRegistration: isTeam
      }

      if (isTeam) {
        requestData.teamName = updateForm.teamName
        requestData.teamManagerName = updateForm.teamManagerName
        requestData.teamManagerPhone = updateForm.teamManagerPhone
        requestData.teamManagerEmail = updateForm.teamManagerEmail || undefined
        requestData.teamSize = updateForm.teamSize ? parseInt(updateForm.teamSize) : 0
        requestData.notes = updateForm.athleteNotes || undefined
      } else {
        requestData.gender = updateForm.gender
        requestData.weightCategory = updateForm.weightCategory
        requestData.clubName = updateForm.clubName || undefined
        requestData.coachName = updateForm.coachName || undefined
        requestData.coachPhone = updateForm.coachPhone || undefined
        requestData.coachEmail = updateForm.coachEmail || undefined
        requestData.athleteNotes = updateForm.athleteNotes || undefined
      }

      await api.put(`/registrations/${selectedRegistration.id}`, requestData)
      alert('Registration updated successfully!')
      setShowUpdateModal(false)
      setSelectedRegistration(null)
      loadRegistrations()
    } catch (err: any) {
      console.error('Update error:', err)
      alert(err.response?.data?.message || 'Failed to update registration. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
            Hi {user?.name || 'there'}! 
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">Welcome back to your weightlifting dashboard</p>
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
                onDelete={handleDeleteRegistration}
                onUpdate={handleUpdateRegistration}
              />
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Registration</h2>
              
              {(selectedRegistration as any).is_team_registration ? (
                // Team Registration Form
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
                    <input
                      type="text"
                      value={updateForm.teamName}
                      onChange={(e) => setUpdateForm({ ...updateForm, teamName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Manager Name *</label>
                    <input
                      type="text"
                      value={updateForm.teamManagerName}
                      onChange={(e) => setUpdateForm({ ...updateForm, teamManagerName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Manager Phone *</label>
                    <input
                      type="tel"
                      value={updateForm.teamManagerPhone}
                      onChange={(e) => setUpdateForm({ ...updateForm, teamManagerPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Manager Email</label>
                    <input
                      type="email"
                      value={updateForm.teamManagerEmail}
                      onChange={(e) => setUpdateForm({ ...updateForm, teamManagerEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                    <input
                      type="number"
                      value={updateForm.teamSize}
                      onChange={(e) => setUpdateForm({ ...updateForm, teamSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={updateForm.athleteNotes}
                      onChange={(e) => setUpdateForm({ ...updateForm, athleteNotes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                // Individual Registration Form
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select
                      value={updateForm.gender}
                      onChange={(e) => setUpdateForm({ ...updateForm, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight Category *</label>
                    <select
                      value={updateForm.weightCategory}
                      onChange={(e) => setUpdateForm({ ...updateForm, weightCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {updateForm.gender === 'male' ? (
                        <>
                          <option value="55">55kg</option>
                          <option value="61">61kg</option>
                          <option value="67">67kg</option>
                          <option value="73">73kg</option>
                          <option value="81">81kg</option>
                          <option value="89">89kg</option>
                          <option value="96">96kg</option>
                          <option value="102">102kg</option>
                          <option value="109">109kg</option>
                          <option value="+109">+109kg</option>
                        </>
                      ) : updateForm.gender === 'female' ? (
                        <>
                          <option value="45">45kg</option>
                          <option value="49">49kg</option>
                          <option value="55">55kg</option>
                          <option value="59">59kg</option>
                          <option value="64">64kg</option>
                          <option value="71">71kg</option>
                          <option value="76">76kg</option>
                          <option value="81">81kg</option>
                          <option value="87">87kg</option>
                          <option value="+87">+87kg</option>
                        </>
                      ) : null}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Club/Team Name</label>
                    <input
                      type="text"
                      value={updateForm.clubName}
                      onChange={(e) => setUpdateForm({ ...updateForm, clubName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
                    <input
                      type="text"
                      value={updateForm.coachName}
                      onChange={(e) => setUpdateForm({ ...updateForm, coachName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coach Phone</label>
                    <input
                      type="tel"
                      value={updateForm.coachPhone}
                      onChange={(e) => setUpdateForm({ ...updateForm, coachPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coach Email</label>
                    <input
                      type="email"
                      value={updateForm.coachEmail}
                      onChange={(e) => setUpdateForm({ ...updateForm, coachEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      value={updateForm.athleteNotes}
                      onChange={(e) => setUpdateForm({ ...updateForm, athleteNotes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowUpdateModal(false)
                    setSelectedRegistration(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitUpdate}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {submitting ? 'Updating...' : 'Update Registration'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
function EventCard({ reg, index, getRegistrationStatusBadge, getEventData, getRequiredAction, onDelete, onUpdate }: {
  reg: EventRegistration
  index: number
  getRegistrationStatusBadge: (status: string) => { bg: string, text: string, label: string, icon: any }
  getEventData: (reg: EventRegistration) => { id: string, title: string, slug: string, date: string, location?: string, preliminaryEntryOpen: boolean, finalEntryOpen: boolean }
  getRequiredAction: (reg: EventRegistration) => { action: string, actionType?: string, message: string, phase: string, color: string } | null
  onDelete: (regId: string, eventTitle: string) => void
  onUpdate: (reg: EventRegistration) => void
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
      className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      {/* Header: Title and Status */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{eventData.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {eventData.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{eventData.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-t border-gray-200 pt-4">
        {reg.weight_category && (
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">CATEGORY</p>
            <p className="text-sm font-semibold text-gray-900">{reg.weight_category}</p>
          </div>
        )}
        {reg.entry_total && (
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">ENTRY TOTAL</p>
            <p className="text-sm font-semibold text-gray-900">{reg.entry_total}kg</p>
          </div>
        )}
        {reg.snatch_opener && (
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">SNATCH</p>
            <p className="text-sm font-semibold text-gray-900">{reg.snatch_opener}kg</p>
          </div>
        )}
        {reg.cnj_opener && (
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">C&J</p>
            <p className="text-sm font-semibold text-gray-900">{reg.cnj_opener}kg</p>
          </div>
        )}
      </div>

      {/* Action Required */}
      {requiredAction && (
        <div className={`p-3 rounded-lg border border-current ${requiredAction.color} mb-4`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-0.5">{requiredAction.message}</p>
            </div>
            {requiredAction.action === 'action' && (
              <Link href={`/events/${eventData.slug}`}>
                <button className="px-3 py-1.5 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
                  Take Action
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons - Only show for pending registrations */}
      {reg.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(reg)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Update
          </button>
          <button
            onClick={() => onDelete(reg.id, eventData.title)}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  )
}
