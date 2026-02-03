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
  snatch_opener?: number
  cnj_opener?: number
  bodyweight?: number
}

interface DashboardFinalFormProps {
  registrationId: string
  clubName: string
  gender: string
  ageCategory: string
  onSuccess: () => void
  onClose: () => void
}

export default function DashboardFinalForm({
  registrationId,
  clubName,
  gender,
  ageCategory,
  onSuccess,
  onClose
}: DashboardFinalFormProps) {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPreliminaryAthletes()
  }, [registrationId])

  const loadPreliminaryAthletes = async () => {
    try {
      const response = await api.get(`/registrations/${registrationId}/preliminary-athletes`)
      const preliminaryAthletes = response.data.athletes || []
      
      // Initialize athletes with empty opener fields
      setAthletes(preliminaryAthletes.map((a: any) => ({
        ...a,
        snatch_opener: a.snatch_opener || '',
        cnj_opener: a.cnj_opener || '',
        bodyweight: a.bodyweight || ''
      })))
    } catch (err) {
      console.error('Failed to load athletes:', err)
      alert('Failed to load preliminary entry athletes')
    } finally {
      setLoading(false)
    }
  }

  const updateAthlete = (index: number, field: string, value: string) => {
    const updated = [...athletes]
    updated[index] = { ...updated[index], [field]: value }
    setAthletes(updated)
  }

  const handleSubmit = async () => {
    // Validate all athletes have bodyweight if required
    // For now, allow submission without validation since bodyweight is optional
    
    setSubmitting(true)
    try {
      await api.post(`/registrations/${registrationId}/final`, {
        athletes: athletes.map(a => ({
          competitor_number: a.competitor_number,
          name: a.name,
          weight_category: a.weight_category
        }))
      })
      alert('Final entry submitted successfully!')
      onSuccess()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit final entry')
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
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Confirm your final entry details</p>
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
              <p className="text-sm sm:text-base font-semibold capitalize">{gender}</p>
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
                    <td className="border-r border-gray-200 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold">
                      {athlete.weight_category}kg
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
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-bold">
                      {athlete.best_total}kg
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
            {submitting ? 'Submitting...' : 'Submit Final Entry'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
