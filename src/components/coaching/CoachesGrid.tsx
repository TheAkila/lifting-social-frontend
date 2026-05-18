'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, User2 } from 'lucide-react'
import { getCoaches } from '@/lib/api'

interface Coach {
  id: string
  name: string
  slug?: string
  title: string
  bio: string
  specializations?: string[]
  certifications?: string[]
  experience?: number
  availability?: string
  email?: string
  phone?: string
  image?: string
  featured?: boolean
  champions_count?: number
}

export default function CoachesGrid() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await getCoaches()
        if (!cancelled) setCoaches(Array.isArray(data) ? data : [])
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load coaches')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const { featured, rest } = useMemo(() => {
    const f = coaches.filter((c) => c.featured)
    const r = coaches.filter((c) => !c.featured)
    return { featured: f, rest: r }
  }, [coaches])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[12px] border border-zinc-100 shadow-soft overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-zinc-100" />
            <div className="p-4 space-y-2">
              <div className="h-2.5 bg-zinc-100 rounded w-1/3" />
              <div className="h-4 bg-zinc-100 rounded w-3/4" />
              <div className="h-3 bg-zinc-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  if (coaches.length === 0) {
    return (
      <div className="bg-white border border-zinc-100 rounded-[12px] shadow-soft py-14 px-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
          <User2 className="w-6 h-6 text-zinc-400" />
        </div>
        <h3 className="text-base font-display font-semibold text-zinc-900">No coaches yet</h3>
        <p className="mt-1.5 text-sm text-zinc-500 max-w-sm mx-auto">
          The coaching team will appear here as soon as profiles are added.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10 sm:space-y-14">
      {featured.length > 0 && (
        <section>
          <SectionHeading title="Head Coaches" subtitle="Lead the program · mentor champions" />
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {featured.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <SectionHeading
            title={featured.length > 0 ? 'The Roster' : 'Our Coaches'}
            subtitle="Specialists across youth, technique, nutrition and competition prep"
          />
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {rest.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-1">
      <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
    </div>
  )
}

function CoachCard({ coach }: { coach: Coach }) {
  const href = `/coaching/${coach.slug || coach.id}`
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group h-full"
    >
      <Link
        href={href}
        className="bg-white rounded-[12px] overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1 h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-square bg-zinc-100 overflow-hidden">
          {coach.image ? (
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${coach.image})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <span className="text-white font-display font-semibold text-base text-center px-4 line-clamp-2">
                {coach.name}
              </span>
            </div>
          )}

          {coach.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-zinc-900 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider line-clamp-1">
            {coach.title}
          </span>
          <h3 className="font-display font-semibold text-base text-zinc-900 mt-1 mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors">
            {coach.name}
          </h3>

          {(coach.champions_count != null || coach.experience != null) && (
            <div className="flex items-center gap-3 text-xs text-zinc-600 mb-2">
              {coach.champions_count != null && (
                <span className="inline-flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span className="font-semibold text-zinc-900">{coach.champions_count}</span>
                  <span className="text-zinc-500">champs</span>
                </span>
              )}
              {coach.experience != null && (
                <span>
                  <span className="font-semibold text-zinc-900">{coach.experience}</span>
                  <span className="text-zinc-500"> yrs</span>
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 group-hover:text-brand-accent transition-colors">
              View Profile
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
