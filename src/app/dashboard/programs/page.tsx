'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaBook, FaCheckCircle, FaTimesCircle, FaPlay } from 'react-icons/fa'

interface EnrolledProgram {
  programId: {
    _id: string
    name: string
    title: string
    bio: string
    experience: number
    image?: string
  }
  progress: number
  status: 'active' | 'completed' | 'cancelled'
  enrolledAt: string
}

export default function ProgramsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [programs, setPrograms] = useState<EnrolledProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadPrograms()
    }
  }, [user, authLoading, router])

  const loadPrograms = async () => {
    try {
      setLoading(true)
      const response = await api.get('/programs/enrolled')
      setPrograms(response.data)
    } catch (error) {
      console.error('Error loading programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to cancel this program enrollment?')) return

    try {
      await api.post('/programs/cancel', { programId })
      alert('Program cancelled successfully')
      loadPrograms()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel program')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getStatusIcon = (status: string) => {
    const icons: any = {
      active: FaPlay,
      completed: FaCheckCircle,
      cancelled: FaTimesCircle
    }
    return icons[status] || FaBook
  }

  const filteredPrograms = programs.filter(program => {
    if (filter === 'all') return true
    return program.status === filter
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading programs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block text-sm sm:text-base">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Programs</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Track your coaching programs and progress</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({programs.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                filter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({programs.filter(p => p.status === 'active').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({programs.filter(p => p.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No programs enrolled yet' : `No ${filter} programs`}
            </h3>
            <p className="text-gray-600 mb-6">Explore our coaching programs to get started</p>
            <Link
              href="/coaching"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
            >
              Browse Programs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program, index) => {
              const StatusIcon = getStatusIcon(program.status)
              return (
                <motion.div
                  key={program.programId._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Program Image */}
                  <div className="relative h-48">
                    <img
                      src={program.programId.image || '/placeholder.png'}
                      alt={program.programId.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(program.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {program.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Program Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {program.programId.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {program.programId.title}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Enrolled on {new Date(program.enrolledAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 font-semibold">Progress</span>
                        <span className="font-bold text-gray-900">{program.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            program.progress === 100 ? 'bg-green-600' : 'bg-orange-600'
                          }`}
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Bio Preview */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {program.programId.bio}
                    </p>

                    {/* Actions */}
                    <div className="space-y-2">
                      {program.status === 'active' && (
                        <>
                          <Link
                            href={`/coaching/${program.programId._id}`}
                            className="block w-full text-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors"
                          >
                            Continue Learning
                          </Link>
                          <button
                            onClick={() => handleCancelProgram(program.programId._id)}
                            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold transition-colors"
                          >
                            Cancel Enrollment
                          </button>
                        </>
                      )}
                      {program.status === 'completed' && (
                        <div className="text-center py-2 px-4 bg-green-50 text-green-800 rounded-lg font-semibold">
                          ✓ Completed
                        </div>
                      )}
                      {program.status === 'cancelled' && (
                        <Link
                          href="/coaching"
                          className="block w-full text-center px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 font-semibold transition-colors"
                        >
                          Browse Programs
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Stats Summary */}
        {programs.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {programs.filter(p => p.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {programs.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {Math.round(
                    programs.reduce((acc, p) => acc + p.progress, 0) / programs.length
                  )}%
                </div>
                <div className="text-sm text-gray-600">Average Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
