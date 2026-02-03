'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import api from '@/lib/api'

interface Athlete {
  id: string
  name: string
  category: string
  dateOfBirth: string
  idNumber: string
  bestTotal: string
  coachName: string
}

interface PreliminaryFormProps {
  registrationId: string
  competitionName: string
  registrationData?: {
    clubName?: string
    phone?: string
    gender?: string
    ageCategory?: string
  }
  onClose: () => void
  onSuccess: () => void
}

export default function DashboardPreliminaryForm({ 
  registrationId, 
  competitionName,
  registrationData,
  onClose, 
  onSuccess 
}: PreliminaryFormProps) {
  const [clubName, setClubName] = useState(registrationData?.clubName || '')
  const [menWomen, setMenWomen] = useState(registrationData?.gender || 'Men')
  const [address, setAddress] = useState('')
  const [telephone, setTelephone] = useState(registrationData?.phone || '')
  const [athletes, setAthletes] = useState<Athlete[]>([{
    id: '1',
    name: '',
    category: '',
    dateOfBirth: '',
    idNumber: '',
    bestTotal: '',
    coachName: ''
  }])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load existing preliminary entry data
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const response = await api.get(`/registrations/${registrationId}/preliminary-athletes`)
        
        if (response.data && response.data.length > 0) {
          // Map backend data to frontend format
          const loadedAthletes = response.data.map((athlete: any, index: number) => ({
            id: athlete.id || `${index + 1}`,
            name: athlete.name || '',
            category: athlete.weight_category || '',
            dateOfBirth: athlete.date_of_birth ? athlete.date_of_birth.split('T')[0] : '',
            idNumber: athlete.id_number || '',
            bestTotal: athlete.best_total?.toString() || '',
            coachName: athlete.coach_name || ''
          }))
          
          setAthletes(loadedAthletes)
        }
      } catch (err) {
        console.log('No existing preliminary data or error loading:', err)
        // Keep default empty athlete form
      } finally {
        setLoading(false)
      }
    }

    loadExistingData()
  }, [registrationId])

  const addAthlete = () => {
    setAthletes([...athletes, {
      id: Date.now().toString(),
      name: '',
      category: '',
      dateOfBirth: '',
      idNumber: '',
      bestTotal: '',
      coachName: ''
    }])
  }

  const removeAthlete = (id: string) => {
    if (athletes.length > 1) {
      setAthletes(athletes.filter(a => a.id !== id))
    }
  }

  const updateAthlete = (id: string, field: keyof Athlete, value: string) => {
    setAthletes(athletes.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  const weightCategories = menWomen === 'Men' 
    ? ['60', '65', '71', '79', '88', '94', '110', '+110']
    : ['48', '53', '58', '63', '69', '77', '86', '+86']

  const handleSubmit = async () => {
    // Validate club information
    if (!clubName.trim()) {
      alert('Please enter the club/institute/school name')
      return
    }

    if (!telephone.trim()) {
      alert('Please enter telephone number')
      return
    }

    // Validate telephone format (basic validation)
    const phoneRegex = /^[0-9+\-\s()]{8,}$/
    if (!phoneRegex.test(telephone.trim())) {
      alert('Please enter a valid telephone number (minimum 8 digits)')
      return
    }

    // Check if at least one athlete is added
    if (athletes.length === 0) {
      alert('Please add at least one athlete')
      return
    }

    // Validate each athlete
    const errors: string[] = []
    const validAthletes: any[] = []

    athletes.forEach((athlete, index) => {
      const athleteNum = index + 1
      
      // Check required fields
      if (!athlete.name.trim()) {
        errors.push(`Athlete ${athleteNum}: Name is required`)
        return
      }

      if (!athlete.category) {
        errors.push(`Athlete ${athleteNum} (${athlete.name}): Weight category is required`)
        return
      }

      if (!athlete.bestTotal) {
        errors.push(`Athlete ${athleteNum} (${athlete.name}): Best total is required`)
        return
      }

      // Validate best total
      const bestTotal = parseFloat(athlete.bestTotal)
      if (isNaN(bestTotal) || bestTotal <= 0) {
        errors.push(`Athlete ${athleteNum} (${athlete.name}): Best total must be a positive number`)
        return
      }

      if (bestTotal > 500) {
        errors.push(`Athlete ${athleteNum} (${athlete.name}): Best total seems unrealistic (${bestTotal}kg). Please verify.`)
        return
      }

      // Validate date of birth if provided
      if (athlete.dateOfBirth) {
        const dob = new Date(athlete.dateOfBirth)
        const now = new Date()
        const age = now.getFullYear() - dob.getFullYear()
        
        if (dob > now) {
          errors.push(`Athlete ${athleteNum} (${athlete.name}): Date of birth cannot be in the future`)
          return
        }
        
        if (age < 10 || age > 100) {
          errors.push(`Athlete ${athleteNum} (${athlete.name}): Please verify date of birth (age appears to be ${age})`)
          return
        }
      }

      // Validate ID number if provided
      if (athlete.idNumber && athlete.idNumber.trim().length < 5) {
        errors.push(`Athlete ${athleteNum} (${athlete.name}): ID number should be at least 5 characters`)
        return
      }

      // If all validations pass, add to valid athletes
      validAthletes.push({
        name: athlete.name.trim(),
        weight_category: athlete.category,
        date_of_birth: athlete.dateOfBirth || undefined,
        id_number: athlete.idNumber ? athlete.idNumber.trim() : undefined,
        best_total: bestTotal,
        coach_name: athlete.coachName ? athlete.coachName.trim() : undefined
      })
    })

    // Show all validation errors at once
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'))
      return
    }

    if (validAthletes.length === 0) {
      alert('Please add at least one complete athlete entry')
      return
    }

    setSubmitting(true)
    try {
      await api.post(`/registrations/${registrationId}/preliminary`, {
        club_name: clubName.trim(),
        gender: menWomen.toLowerCase(),
        address: address.trim() || undefined,
        telephone: telephone.trim(),
        athletes: validAthletes
      })
      alert('Preliminary entry submitted successfully!')
      onSuccess()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit preliminary entry')
    } finally {
      setSubmitting(false)
    }
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
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">ENTRY FORM (Preliminary)</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{competitionName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 ml-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading existing entry data...</p>
          </div>
        ) : (
          /* Form Content */
          <div className="p-4 sm:p-6">
          {/* Club Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Name of the Club/Institute/School: *
              </label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                placeholder="Enter club name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Men / Women: *
              </label>
              <div className="w-full px-3 py-2 border-b-2 border-gray-300 bg-gray-50 text-gray-700 font-medium">
                {menWomen}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Age Category: *
              </label>
              <div className="w-full px-3 py-2 border-b-2 border-gray-300 bg-gray-50 text-gray-700 font-medium">
                {registrationData?.ageCategory || 'Not specified'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Address:
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Telephone No:
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Athletes Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-900">C/NO.</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-900">CATEGORY</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-900">NAME OF THE COMPETITOR</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-900">DATE OF BIRTH</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-900">ID NUMBER</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-900">BEST TOTAL</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-900">NAME OF THE COACH</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-900">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map((athlete, index) => (
                  <tr key={athlete.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-center text-sm">{String(index + 1).padStart(2, '0')}</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={athlete.category}
                        onChange={(e) => updateAthlete(athlete.id, 'category', e.target.value)}
                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        {weightCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}kg</option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={athlete.name}
                        onChange={(e) => updateAthlete(athlete.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                        placeholder="Athlete name"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="date"
                        value={athlete.dateOfBirth}
                        onChange={(e) => updateAthlete(athlete.id, 'dateOfBirth', e.target.value)}
                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={athlete.idNumber}
                        onChange={(e) => updateAthlete(athlete.id, 'idNumber', e.target.value)}
                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                        placeholder="ID/Passport"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={athlete.bestTotal}
                        onChange={(e) => updateAthlete(athlete.id, 'bestTotal', e.target.value)}
                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                        placeholder="kg"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={athlete.coachName}
                        onChange={(e) => updateAthlete(athlete.id, 'coachName', e.target.value)}
                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                        placeholder="Coach name"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <button
                        onClick={() => removeAthlete(athlete.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        disabled={athletes.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Athlete Button */}
          <button
            onClick={addAthlete}
            className="mb-6 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium"
          >
            <Plus size={16} />
            Add Another Athlete
          </button>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 text-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Preliminary Entry'}
            </button>
          </div>
        </div>
        )}
      </motion.div>
    </div>
  )
}
