'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Star,
  Trophy,
  User2,
} from 'lucide-react'

interface Coach {
  id: string
  name: string
  slug?: string
  title: string
  bio: string
  specializations?: string[]
  certifications?: string[]
  competitive_achievements?: string[]
  coaching_achievements?: string[]
  experience?: number
  availability?: string
  email?: string
  phone?: string
  image?: string
  featured?: boolean
  champions_count?: number
}

const apiBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function CoachDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params?.slug

  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setNotFound(false)
        const res = await fetch(`${apiBase()}/coaches/${slug}`)
        if (res.status === 404) {
          if (!cancelled) setNotFound(true)
          return
        }
        if (!res.ok) throw new Error('Failed to load coach')
        const data = await res.json()
        if (!cancelled) setCoach(data)
      } catch (err) {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="bg-zinc-950 pt-24 sm:pt-28 pb-12">
          <div className="container mx-auto px-4 max-w-5xl animate-pulse">
            <div className="h-4 w-32 bg-zinc-800 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-8">
              <div className="aspect-square bg-zinc-800 rounded-[12px]" />
              <div className="space-y-3 pt-2">
                <div className="h-4 w-24 bg-zinc-800 rounded" />
                <div className="h-10 w-3/4 bg-zinc-800 rounded" />
                <div className="h-4 w-1/2 bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !coach) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center pt-24 pb-24">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
            <User2 className="w-7 h-7 text-zinc-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-zinc-900 mb-2">Coach not found</h1>
          <p className="text-sm text-zinc-500 mb-6">
            We couldn&apos;t find a coach with that link. They may have moved on or the URL is wrong.
          </p>
          <Link
            href="/coaching"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all coaches
          </Link>
        </div>
      </main>
    )
  }

  const specs = coach.specializations ?? []
  const certs = coach.certifications ?? []
  const competitive = coach.competitive_achievements ?? []
  const coachingAch = coach.coaching_achievements ?? []

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Hero — dark header matching events/shop pages */}
      <section className="bg-zinc-950 pt-24 sm:pt-28 pb-10 sm:pb-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            href="/coaching"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Coaches
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6 md:gap-10 items-start"
          >
            {/* Photo */}
            <div className="relative aspect-square w-full max-w-[280px] mx-auto md:mx-0 rounded-[12px] overflow-hidden bg-zinc-800 shadow-lg">
              {coach.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <User2 className="w-20 h-20 text-zinc-600" />
                </div>
              )}
              {coach.featured && (
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-zinc-900">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Featured
                </div>
              )}
            </div>

            {/* Title block */}
            <div className="text-center md:text-left">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {coach.title}
              </p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                {coach.name}
              </h1>

              {/* Stats strip */}
              {(coach.champions_count != null || coach.experience != null) && (
                <div className="mt-5 sm:mt-6 flex items-stretch justify-center md:justify-start gap-3 sm:gap-4">
                  {coach.champions_count != null && (
                    <StatChip
                      icon={<Trophy className="w-4 h-4 text-amber-400" />}
                      value={coach.champions_count}
                      label="Champions"
                    />
                  )}
                  {coach.experience != null && (
                    <StatChip
                      icon={<Award className="w-4 h-4 text-zinc-300" />}
                      value={coach.experience}
                      suffix="yrs"
                      label="Experience"
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 max-w-5xl py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6 lg:gap-8 items-start">
          {/* Main column */}
          <div className="space-y-6">
            {coach.bio && (
              <Panel title="About">
                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed whitespace-pre-line">
                  {coach.bio}
                </p>
              </Panel>
            )}

            {specs.length > 0 && (
              <Panel title="Specializations">
                <div className="flex flex-wrap gap-2">
                  {specs.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </Panel>
            )}

            {competitive.length > 0 && (
              <Panel title="Competitive Achievements">
                <ul className="space-y-2.5">
                  {competitive.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-700">
                      <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {coachingAch.length > 0 && (
              <Panel title="Coaching Achievements">
                <ul className="space-y-2.5">
                  {coachingAch.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-700">
                      <Award className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {certs.length > 0 && (
              <Panel title="Education & Certifications">
                <ul className="space-y-2.5">
                  {certs.map((cert, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <Panel title="Get in touch" tight>
              <div className="space-y-2">
                {coach.email && (
                  <a
                    href={`mailto:${coach.email}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center text-zinc-600 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                        Email
                      </p>
                      <p className="text-sm font-medium text-zinc-900 truncate">{coach.email}</p>
                    </div>
                  </a>
                )}
                {coach.phone && (
                  <a
                    href={`tel:${coach.phone}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center text-zinc-600 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-zinc-900 truncate">{coach.phone}</p>
                    </div>
                  </a>
                )}
                {!coach.email && !coach.phone && (
                  <p className="text-sm text-zinc-500 py-2">No contact details listed.</p>
                )}
              </div>
            </Panel>

            {coach.availability && (
              <Panel title="Availability" tight>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                    {coach.availability}
                  </p>
                </div>
              </Panel>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}

function Panel({
  title,
  children,
  tight = false,
}: {
  title: string
  children: React.ReactNode
  tight?: boolean
}) {
  return (
    <div className="bg-white rounded-[12px] border border-zinc-100 shadow-soft overflow-hidden">
      <div className={tight ? 'px-4 pt-4 pb-2' : 'px-5 sm:px-6 pt-5 sm:pt-6 pb-3'}>
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{title}</h2>
      </div>
      <div className={tight ? 'px-4 pb-4' : 'px-5 sm:px-6 pb-5 sm:pb-6'}>{children}</div>
    </div>
  )
}

function StatChip({
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
    <div className="flex flex-col items-center md:items-start px-4 py-3 bg-white/5 border border-white/10 rounded-[10px] backdrop-blur min-w-[110px]">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {value}
          {suffix && <span className="text-base font-semibold text-zinc-300 ml-1">{suffix}</span>}
        </span>
      </div>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </span>
    </div>
  )
}
