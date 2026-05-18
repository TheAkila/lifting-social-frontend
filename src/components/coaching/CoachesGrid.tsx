'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Mail, Phone, Trophy, User2, Star } from 'lucide-react'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse">
            <div className="aspect-[4/5] bg-zinc-100" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-zinc-100 rounded w-2/3" />
              <div className="h-3 bg-zinc-100 rounded w-1/2" />
              <div className="h-3 bg-zinc-100 rounded w-full" />
              <div className="h-3 bg-zinc-100 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  if (coaches.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl py-16 px-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
          <User2 className="w-7 h-7 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">No coaches yet</h3>
        <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
          The coaching team will appear here as soon as profiles are added.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      {featured.length > 0 && (
        <section>
          <SectionHeading
            eyebrow="Featured"
            title="Head Coaches"
            subtitle="Lead the program, mentor champions, and design the elite training systems."
          />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {featured.map((coach) => (
              <CoachCard key={coach.id} coach={coach} highlighted />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <SectionHeading
            eyebrow={featured.length > 0 ? 'The Team' : 'Our Coaches'}
            title="Coaching Roster"
            subtitle="Specialists across youth development, nutrition, technique, and competition prep."
          />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {rest.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-zinc-500 max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}

function CoachCard({ coach, highlighted = false }: { coach: Coach; highlighted?: boolean }) {
  const specs = (coach.specializations ?? []).slice(0, highlighted ? 4 : 3)

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl bg-white border ${
        highlighted ? 'border-zinc-200 shadow-sm' : 'border-zinc-100'
      } hover:shadow-md transition-shadow`}
    >
      <div className={`relative w-full bg-zinc-100 ${highlighted ? 'aspect-[5/4] md:aspect-[4/3]' : 'aspect-[4/5]'}`}>
        {coach.image ? (
          <Image
            src={coach.image}
            alt={coach.name}
            fill
            sizes={highlighted ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
            <User2 className="w-16 h-16 text-zinc-300" />
          </div>
        )}
        {coach.featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-zinc-900">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Featured
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <h3 className={`font-display font-bold tracking-tight text-zinc-900 ${highlighted ? 'text-2xl' : 'text-xl'}`}>
          {coach.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 font-medium">{coach.title}</p>

        {coach.bio && (
          <p className={`mt-3 text-sm text-zinc-600 leading-relaxed ${highlighted ? 'line-clamp-4' : 'line-clamp-3'}`}>
            {coach.bio}
          </p>
        )}

        {(coach.champions_count != null || coach.experience != null) && (
          <div className="mt-5 flex items-center gap-5 pt-4 border-t border-zinc-100">
            {coach.champions_count != null && (
              <Stat icon={<Trophy className="w-3.5 h-3.5" />} value={coach.champions_count} label="champions" />
            )}
            {coach.experience != null && (
              <Stat value={coach.experience} suffix="yrs" label="experience" />
            )}
          </div>
        )}

        {specs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {specs.map((spec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {(coach.email || coach.phone) && (
          <div className="mt-5 flex items-center gap-4 text-zinc-500">
            {coach.email && (
              <a
                href={`mailto:${coach.email}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-accent transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            )}
            {coach.phone && (
              <a
                href={`tel:${coach.phone}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-accent transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
            )}
          </div>
        )}

        {coach.availability && (
          <p className="mt-4 text-[11px] text-zinc-400 leading-relaxed">
            {coach.availability}
          </p>
        )}
      </div>
    </article>
  )
}

function Stat({
  icon,
  value,
  suffix,
  label,
}: {
  icon?: React.ReactNode
  value: number
  suffix?: string
  label: string
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-1 text-zinc-900">
        {icon && <span className="text-zinc-400 mr-0.5">{icon}</span>}
        <span className="font-display text-xl font-bold tracking-tight">{value}</span>
        {suffix && <span className="text-xs font-semibold text-zinc-500">{suffix}</span>}
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mt-0.5">
        {label}
      </span>
    </div>
  )
}
