'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Camera, ChevronLeft, ChevronRight, Dumbbell, ShoppingBag, Trophy } from 'lucide-react'

interface HeroSlide {
  id: string
  image_url: string
  link_url?: string | null
}

const AUTOPLAY_MS = 3000

interface StageMetrics {
  tx: number      // peek horizontal offset (% of slide width)
  tz: number      // peek depth recession (px, applied as negative)
  ry: number      // peek tilt angle (deg, applied with sign per side)
  scale: number   // peek scale factor (active is always 1)
  perspective: number
}

const STAGE_DESKTOP: StageMetrics = { tx: 58, tz: 220, ry: 32, scale: 0.85, perspective: 1600 }
const STAGE_TABLET: StageMetrics = { tx: 52, tz: 200, ry: 28, scale: 0.82, perspective: 1500 }
const STAGE_MOBILE: StageMetrics = { tx: 38, tz: 140, ry: 22, scale: 0.72, perspective: 1200 }

export default function Hero() {
  const router = useRouter()
  const [slides, setSlides] = React.useState<HeroSlide[]>([])
  const [loaded, setLoaded] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [stage, setStage] = React.useState<StageMetrics>(STAGE_DESKTOP)
  const count = slides.length

  React.useEffect(() => {
    const compute = () => {
      if (window.matchMedia('(max-width: 639px)').matches) setStage(STAGE_MOBILE)
      else if (window.matchMedia('(max-width: 1023px)').matches) setStage(STAGE_TABLET)
      else setStage(STAGE_DESKTOP)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  React.useEffect(() => {
    let cancelled = false
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero-carousel`)
        if (!res.ok) throw new Error('Failed to load hero slides')
        const json = await res.json()
        const items: HeroSlide[] = Array.isArray(json?.data) ? json.data : []
        if (!cancelled) setSlides(items)
      } catch (err) {
        console.warn('Hero carousel fetch failed', err)
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }
    fetchSlides()
    return () => {
      cancelled = true
    }
  }, [])

  const go = React.useCallback(
    (next: number) => {
      if (count === 0) return
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  React.useEffect(() => {
    if (paused || count <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, count])

  React.useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Shortest-path circular offset — keeps the slide direction intuitive when
  // wrapping (last → first should slide forward, not spin all the way back).
  const offsetOf = React.useCallback(
    (i: number) => {
      const raw = i - index
      const half = count / 2
      if (raw > half) return raw - count
      if (raw < -half) return raw + count
      return raw
    },
    [index, count]
  )

  const handleSlideClick = (slide: HeroSlide, i: number) => {
    if (i !== index) {
      go(i)
      return
    }
    if (!slide.link_url) return
    if (slide.link_url.startsWith('http')) {
      window.open(slide.link_url, '_blank', 'noopener,noreferrer')
    } else {
      router.push(slide.link_url)
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100 min-h-screen flex flex-col items-center justify-start sm:justify-center pt-24 pb-10 sm:py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured slides"
    >
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      {loaded && count === 0 ? (
        <div className="text-center max-w-xl px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
            Hero carousel is empty
          </h2>
          <p className="text-zinc-600">
            Upload slides from the admin panel to see them appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile-only intro — fills the navbar→carousel gap on small screens.
              Hidden on sm+ where the centered carousel naturally fills the viewport. */}
          <div className="sm:hidden w-full max-w-md px-5 mb-6 text-center">
            <h1 className="font-display text-3xl font-bold text-zinc-900 leading-tight">
              Built for Champions
            </h1>
            <p className="mt-2 text-zinc-600 text-sm">
              Engineered for Performance
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold shadow-sm active:bg-zinc-100"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Shop
              </Link>
              <Link
                href="/coaching"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold shadow-sm active:bg-zinc-100"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                Coaching
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold shadow-sm active:bg-zinc-100"
              >
                <Trophy className="w-3.5 h-3.5" />
                Events
              </Link>
              <Link
                href="/sports-media"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold shadow-sm active:bg-zinc-100"
              >
                <Camera className="w-3.5 h-3.5" />
                Media
              </Link>
            </div>
          </div>

          {/* 3D stage — perspective on outer, preserve-3d on inner so child rotateY renders in depth.
              Heights scale with viewport so the active square card feels full-screen on desktop
              while staying contained on mobile. */}
          <div
            className="relative mx-auto w-full max-w-7xl px-3 sm:px-6 h-[72vw] max-h-[420px] sm:max-h-none sm:h-[60vh] lg:h-[70vh] xl:h-[78vh]"
            style={{ perspective: `${stage.perspective}px` }}
          >
            <div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {slides.map((slide, i) => (
                <Slide
                  key={slide.id}
                  slide={slide}
                  offset={offsetOf(i)}
                  stage={stage}
                  onClick={() => handleSlideClick(slide, i)}
                />
              ))}
            </div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous slide"
                  className="absolute left-1 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-sm transition hover:bg-white sm:left-6 sm:h-11 sm:w-11"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next slide"
                  className="absolute right-1 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-sm transition hover:bg-white sm:right-6 sm:h-11 sm:w-11"
                >
                  <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1 rounded-full transition-all ${
                    i === index
                      ? 'w-8 bg-accent'
                      : 'w-5 bg-zinc-300 hover:bg-zinc-400'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function Slide({
  slide,
  offset,
  stage,
  onClick,
}: {
  slide: HeroSlide
  offset: number
  stage: StageMetrics
  onClick: () => void
}) {
  const abs = Math.abs(offset)
  const isActive = offset === 0
  const isAdjacent = abs === 1
  const visible = abs <= 1

  const translateX = offset === 0 ? 0 : offset * stage.tx
  const translateZ = isActive ? 0 : -stage.tz
  const rotateY = offset === 0 ? 0 : offset > 0 ? -stage.ry : stage.ry
  const scale = isActive ? 1 : stage.scale
  const opacity = isActive ? 1 : isAdjacent ? 0.6 : 0
  const zIndex = isActive ? 30 : isAdjacent ? 20 : 0

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? 'Featured slide' : 'Go to slide'}
      tabIndex={isActive ? 0 : -1}
      className="absolute left-1/2 top-1/2 aspect-square h-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 transition-all duration-700 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-zinc-900"
      style={{
        transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        opacity,
        zIndex,
        pointerEvents: visible ? 'auto' : 'none',
        filter: isActive ? 'none' : 'brightness(0.5)',
        willChange: 'transform, opacity, filter',
      }}
    >
      <Image
        src={slide.image_url}
        alt=""
        fill
        aria-hidden
        sizes="(min-width: 1280px) 78vh, (min-width: 1024px) 70vh, (min-width: 640px) 60vh, 72vw"
        className="object-cover scale-110 blur-2xl opacity-60"
        draggable={false}
      />
      <Image
        src={slide.image_url}
        alt="Hero slide"
        fill
        priority={isActive}
        sizes="(min-width: 1280px) 78vh, (min-width: 1024px) 70vh, (min-width: 640px) 60vh, 72vw"
        className="object-contain"
        draggable={false}
      />
    </button>
  )
}
