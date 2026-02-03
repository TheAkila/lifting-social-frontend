'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'

interface FinalEntry {
  id: string
  athleteName: string
  dateOfBirth?: string
  registrationNumber: string
  weightCategory: string
  bestTotal?: number
  coachName?: string
  gender?: string
}

interface FinalEntryFormProps {
  eventId: string
  eventTitle: string
}

export default function FinalEntryForm({ eventId, eventTitle }: FinalEntryFormProps) {
  const [entries, setEntries] = useState<FinalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFinalEntries()
  }, [eventId])

  const loadFinalEntries = async () => {
    try {
      console.log('Fetching final entries for event:', eventId)
      const response = await api.get(`/events/${eventId}/final-entries`)
      console.log('Final entries response:', response.data)
      setEntries(response.data || [])
      setError(null)
      setLoading(false)
    } catch (err: any) {
      console.error('Failed to load final entries:', err)
      setError(err.response?.data?.message || 'Failed to load entries')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Loading final entries...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No final entries yet. Final entries will appear here once athletes submit their opening attempts.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-card border border-zinc-200 shadow-sm overflow-hidden"
    >
      {/* Header Section */}
      <div className="p-8 border-b border-zinc-200 bg-white">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">ENTRY FORM (Final)</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b-2 border-zinc-900">
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-900 border-r border-zinc-300 w-12">C/NO.</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-900 border-r border-zinc-300 w-24">CATEGORY</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-900 border-r border-zinc-300 flex-1">NAME OF THE COMPETITOR</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-900 border-r border-zinc-300 w-32">DATE OF BIRTH</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-900 border-r border-zinc-300 w-28">ID NUMBER</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-900 border-r border-zinc-300 w-24">BEST TOTAL</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-zinc-900 w-32">NAME OF THE COACH</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={entry.id}
                className="border-b border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-semibold text-zinc-900 border-r border-zinc-300">{String(index + 1).padStart(2, '0')}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-900 border-r border-zinc-300">{entry.weightCategory}</td>
                <td className="px-4 py-3 text-sm text-zinc-900 border-r border-zinc-300 font-medium">{entry.athleteName}</td>
                <td className="px-4 py-3 text-sm text-zinc-900 border-r border-zinc-300">{entry.dateOfBirth || '-'}</td>
                <td className="px-4 py-3 text-sm text-zinc-900 border-r border-zinc-300">{entry.registrationNumber || '-'}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-900 border-r border-zinc-300">{entry.bestTotal ? `${entry.bestTotal}kg` : '-'}</td>
                <td className="px-4 py-3 text-sm text-zinc-900">{entry.coachName || '-'}</td>
              </tr>
            ))}
            
            {/* Reserve rows */}
            {entries.length < 12 && (
              <>
                {Array.from({ length: Math.min(2, 12 - entries.length) }).map((_, idx) => (
                  <tr key={`reserve-${idx}`} className="border-b border-zinc-300 hover:bg-zinc-50">
                    <td className="px-4 py-3 text-sm font-semibold text-zinc-900 border-r border-zinc-300">{String(entries.length + idx + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-3 text-sm text-zinc-500 border-r border-zinc-300">Reserve</td>
                    <td className="px-4 py-3 border-r border-zinc-300"></td>
                    <td className="px-4 py-3 border-r border-zinc-300"></td>
                    <td className="px-4 py-3 border-r border-zinc-300"></td>
                    <td className="px-4 py-3 border-r border-zinc-300"></td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
