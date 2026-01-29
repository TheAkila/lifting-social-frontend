'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'

interface FinalEntry {
  id: string
  athleteName: string
  registrationNumber: string
  weightCategory: string
  bestTotal?: number
  snatchOpener: number
  cnjOpener: number
  signature?: string
}

interface FinalEntryFormProps {
  eventId: string
  eventTitle: string
}

export default function FinalEntryForm({ eventId, eventTitle }: FinalEntryFormProps) {
  const [entries, setEntries] = useState<FinalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'weight' | 'name'>('weight')

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

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === 'weight') {
      const weightA = parseFloat(a.weightCategory)
      const weightB = parseFloat(b.weightCategory)
      return weightA - weightB
    }
    return a.athleteName.localeCompare(b.athleteName)
  })

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
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-semibold text-zinc-900">{eventTitle}</h2>
          <p className="text-sm text-zinc-500">Total Entries: {entries.length}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSortBy('weight')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'weight'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Sort by Weight Category
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'name'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Sort by Name
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 border-r border-zinc-200 w-12">No.</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 border-r border-zinc-200">Weight Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 border-r border-zinc-200">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 border-r border-zinc-200">Registration Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 border-r border-zinc-200">Best Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 border-r border-zinc-200">Snatch Opener</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 border-r border-zinc-200">C&J Opener</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900">Signature</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry, index) => (
              <tr
                key={entry.id}
                className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'
                }`}
              >
                <td className="px-6 py-4 text-sm text-zinc-900 font-medium border-r border-zinc-200">{String(index + 1).padStart(2, '0')}</td>
                <td className="px-6 py-4 text-sm text-zinc-900 border-r border-zinc-200 font-semibold">{entry.weightCategory}</td>
                <td className="px-6 py-4 text-sm text-zinc-900 border-r border-zinc-200">{entry.athleteName}</td>
                <td className="px-6 py-4 text-sm text-zinc-700 border-r border-zinc-200">{entry.registrationNumber || '-'}</td>
                <td className="px-6 py-4 text-sm text-zinc-900 border-r border-zinc-200 font-semibold">{entry.bestTotal ? `${entry.bestTotal}kg` : '-'}</td>
                <td className="px-6 py-4 text-sm text-zinc-900 border-r border-zinc-200 font-semibold">{entry.snatchOpener}kg</td>
                <td className="px-6 py-4 text-sm text-zinc-900 border-r border-zinc-200 font-semibold">{entry.cnjOpener}kg</td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  <div className="w-20 h-8 border border-zinc-300 rounded bg-zinc-50"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="p-6 bg-zinc-50 border-t border-zinc-200">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Total Athletes</p>
            <p className="text-2xl font-bold text-zinc-900">{entries.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Weight Categories</p>
            <p className="text-2xl font-bold text-zinc-900">{new Set(entries.map(e => e.weightCategory)).size}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Avg Best Total</p>
            <p className="text-2xl font-bold text-zinc-900">
              {Math.round(entries.reduce((sum, e) => sum + (e.bestTotal || 0), 0) / entries.length)}kg
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
