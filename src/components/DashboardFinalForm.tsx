'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { X } from 'lucide-react'

interface Athlete {
  id?: string
  competitor_number: number
  name: string
  weight_category: string
  date_of_birth: string | null
  id_number: string | null
  best_total: number
  coach_name: string | null
}

interface DashboardFinalFormProps {
  registrationId: string
  clubName: string
  gender: string
  ageCategory: string
  registrationStatus?: string
  competitionName?: string
  onSuccess: () => void
  onClose: () => void
}

export default function DashboardFinalForm({
  registrationId,
  clubName,
  gender,
  ageCategory,
  registrationStatus,
  competitionName: initialCompetitionName,
  onSuccess,
  onClose
}: DashboardFinalFormProps) {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [actualGender, setActualGender] = useState<string>(gender)
  const [competitionName, setCompetitionName] = useState<string>(initialCompetitionName || '')

  // Normalize gender to handle different formats (men/women vs male/female vs Men/Women)
  const normalizedGender = actualGender?.toLowerCase()
  const isMen = normalizedGender === 'men' || normalizedGender === 'male' || normalizedGender === 'm'
  
  // Default weight categories as fallback
  const defaultWeightCategories = isMen
    ? ['55', '61', '67', '73', '81', '89', '96', '102', '109', '109+']
    : ['45', '49', '55', '59', '64', '71', '76', '81', '87', '87+']

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    loadPreliminaryAthletes()
    
    // Cleanup: restore scroll when modal closes
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [registrationId])

  const loadPreliminaryAthletes = async () => {
    try {
      const response = await api.get(`/registrations/${registrationId}/preliminary-athletes`)
      const preliminaryAthletes = response.data.athletes || []
      const registrationData = response.data.registration || {}
      
      console.log('Raw athletes data:', preliminaryAthletes)
      console.log('Registration data from API:', registrationData)
      
      // Use gender from API if available, otherwise use prop
      const genderToUse = registrationData.gender || gender
      setActualGender(genderToUse)
      
      console.log('Final gender to use:', genderToUse)
      console.log('Normalized gender (is men?):', genderToUse?.toLowerCase())
      
      // Initialize athletes and strip 'kg' suffix from weight categories
      const processedAthletes = preliminaryAthletes.map((a: any) => {
        const strippedCategory = a.weight_category?.toString().replace(/kg$/i, '').trim() || ''
        console.log(`Athlete ${a.name}: original category = "${a.weight_category}", stripped = "${strippedCategory}"`)
        return {
          ...a,
          weight_category: strippedCategory
        }
      })
      
      // Extract unique weight categories from preliminary data for reference
      const prelimCategories = [...new Set(processedAthletes
        .map((a: Athlete) => a.weight_category)
        .filter((cat: string) => cat && cat.trim()))]
      
      // Always use ALL gender-appropriate categories, not just preliminary ones
      // This allows athletes to change their weight class in final entry
      const isActuallyMen = genderToUse?.toLowerCase() === 'men' || genderToUse?.toLowerCase() === 'male' || genderToUse?.toLowerCase() === 'm'
      const allGenderCategories = isActuallyMen
        ? ['55', '61', '67', '73', '81', '89', '96', '102', '109', '109+']
        : ['45', '49', '55', '59', '64', '71', '76', '81', '87', '87+']
      
      console.log('Categories from preliminary data:', prelimCategories)
      console.log('All available categories for this gender:', allGenderCategories)
      
      setAvailableCategories(allGenderCategories)
      
      console.log('Processed athletes:', processedAthletes)
      setAthletes(processedAthletes)
    } catch (err) {
      console.error('Failed to load athletes:', err)
      alert('Failed to load preliminary entry athletes')
    } finally {
      setLoading(false)
    }
  }

  const updateAthlete = (index: number, field: string, value: string | number) => {
    const updated = [...athletes]
    updated[index] = { ...updated[index], [field]: value }
    setAthletes(updated)
  }

  const handleSubmit = async () => {
    // Validate all athletes have weight category and best total
    for (const athlete of athletes) {
      if (!athlete.weight_category) {
        alert(`Please select weight category for ${athlete.name}`)
        return
      }
      if (!athlete.best_total || athlete.best_total <= 0) {
        alert(`Please enter valid best total for ${athlete.name}`)
        return
      }
    }
    
    setSubmitting(true)
    try {
      const payload = {
        athletes: athletes.map(a => ({
          competitor_number: a.competitor_number,
          name: a.name,
          weight_category: a.weight_category,
          best_total: a.best_total
        }))
      }
      
      console.log('Submitting final entry payload:', payload)
      
      await api.post(`/registrations/${registrationId}/final`, payload)
      
      const isUpdate = registrationStatus === 'final_pending'
      alert(isUpdate ? 'Final entry updated successfully!' : 'Final entry submitted successfully!')
      onSuccess()
    } catch (err: any) {
      console.error('Final entry submission error:', err)
      
      // Handle timeout/abort errors
      if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
        alert('Request timed out. Please check your internet connection and try again.')
      } else if (err.response?.status === 408) {
        alert('Request timed out. The server took too long to respond. Please try again.')
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to submit final entry')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading athletes...</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl my-4 sm:my-8"
      >
        {/* Header */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">ENTRY FORM (Final)</h2>
            <p className="text-sm sm:text-base font-bold text-gray-900 mt-1">
              {competitionName ? competitionName : 'Confirm your final entry details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 ml-2"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Team Information */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Team Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Name of the Club/Institute/School:</p>
              <p className="text-sm sm:text-base font-semibold">{clubName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Men / Women:</p>
              <p className="text-sm sm:text-base font-semibold capitalize">{actualGender}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Age Category:</p>
              <p className="text-sm sm:text-base font-semibold">{ageCategory}</p>
            </div>
        </div>
        </div>

        {/* Athletes Table */}
        <div className="px-4 sm:px-6 py-4 flex-1 overflow-auto">
      
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold">C/NO.</th>
                  <th className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold">CATEGORY</th>
                  <th className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold">NAME OF THE COMPETITOR</th>
                  <th className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold">DATE OF BIRTH</th>
                  <th className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold">AGE CATEGORY</th>
                  <th className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold">ID NUMBER</th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold">BEST TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map((athlete, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-center font-medium">
                      {String(athlete.competitor_number).padStart(2, '0')}
                    </td>
                    <td className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3">
                      <select
                        value={athlete.weight_category}
                        onChange={(e) => updateAthlete(index, 'weight_category', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm font-semibold"
                      >
                        <option value="">Select</option>
                        {/* Show all valid weight categories for the gender */}
                        {availableCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}kg</option>
                        ))}
                      </select>
                    </td>
                    <td className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                      {athlete.name}
                    </td>
                    <td className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                      {athlete.date_of_birth ? new Date(athlete.date_of_birth).toLocaleDateString() : '-'}
                    </td>
                    <td className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                      {ageCategory}
                    </td>
                    <td className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm">
                      {athlete.id_number || '-'}
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3">
                      <input
                        type="number"
                        step="1"
                        placeholder="kg"
                        value={athlete.best_total || ''}
                        onChange={(e) => updateAthlete(index, 'best_total', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm font-bold"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-black text-white rounded-lg text-sm sm:text-base hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitting 
              ? (registrationStatus === 'final_pending' ? 'Updating...' : 'Submitting...') 
              : (registrationStatus === 'final_pending' ? 'Update Final Entry' : 'Submit Final Entry')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
