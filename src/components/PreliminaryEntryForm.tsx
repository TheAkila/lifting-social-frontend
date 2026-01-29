'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'

interface PreliminaryEntry {
  id: string
  athleteName: string
  dateOfBirth?: string
  registrationNumber: string
  weightCategory: string
  bestTotal?: number
  coachName?: string
  gender?: string
}

interface PreliminaryEntryFormProps {
  eventId: string
  eventTitle: string
}

export default function PreliminaryEntryForm({ eventId, eventTitle }: PreliminaryEntryFormProps) {
  const [entries, setEntries] = useState<PreliminaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [clubInfo, setClubInfo] = useState({
    name: '',
    address: '',
    phone: '',
    gender: 'Men'
  })

  useEffect(() => {
    loadPreliminaryEntries()
  }, [eventId])

  const loadPreliminaryEntries = async () => {
    try {
      const response = await api.get(`/events/${eventId}/preliminary-entries`)
      setEntries(response.data)
      
      // Try to get club info from first entry if available
      if (response.data.length > 0 && response.data[0].clubName) {
        setClubInfo(prev => ({
          ...prev,
          name: response.data[0].clubName || ''
        }))
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Failed to load preliminary entries', err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Loading preliminary entries...</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No preliminary entries yet</p>
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
        <h2 className="text-xl font-bold text-zinc-900 mb-6">ENTRY FORM (Preliminary)</h2>
        
        {/* Club and Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-semibold text-zinc-900">Name of the Club/Institute/School:</span>
              <div className="flex-1 border-b border-zinc-400"></div>
              <span className="text-zinc-600 ml-2">{clubInfo.name || 'N/A'}</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-zinc-900">Address:</span>
              <div className="flex-1 border-b border-zinc-400"></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-semibold text-zinc-900">Men / Women:</span>
              <div className="flex-1 border-b border-zinc-400"></div>
              <span className="text-zinc-600 ml-2">{clubInfo.gender}</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-zinc-900">Telephone No:</span>
              <div className="flex-1 border-b border-zinc-400"></div>
              <span className="text-zinc-600 ml-2">{clubInfo.phone || '-'}</span>
            </div>
          </div>
        </div>
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
                    <td colSpan={5} className="px-4 py-3 text-sm text-zinc-500 border-r border-zinc-300"></td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
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

      {/* Print Button */}
      <div className="p-6 border-t border-zinc-200 bg-white flex gap-3 justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Print Form
        </button>
        <button
          onClick={() => {
            const element = document.querySelector('[data-printable]')
            if (element) {
              const printWindow = window.open('', '_blank')
              if (printWindow) {
                printWindow.document.write(element.innerHTML)
                printWindow.document.close()
                printWindow.print()
              }
            }
          }}
          className="px-6 py-2 bg-zinc-600 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
        >
          Export to PDF
        </button>
      </div>
    </motion.div>
  )
}
