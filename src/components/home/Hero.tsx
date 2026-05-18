'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface HeroSlide {
  id: string
  image_url: string
  link_url?: string | null
}

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
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

  const enableLoop = slides.length >= 3

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100">
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="container-custom relative h-screen flex flex-col items-center justify-center py-16">
        {loaded && slides.length === 0 ? (
          <div className="text-center max-w-xl px-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
              Hero carousel is empty
            </h2>
            <p className="text-zinc-600">
              Upload slides from the admin panel to see them appear here.
            </p>
          </div>
        ) : (
        <div className="relative w-full max-w-6xl">
          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop={enableLoop}
            slidesPerView="auto"
            spaceBetween={0}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            coverflowEffect={{
              rotate: 32,
              stretch: 0,
              depth: 220,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ clickable: true, el: '.hero-carousel-pagination' }}
            navigation={{
              prevEl: '.hero-carousel-prev',
              nextEl: '.hero-carousel-next',
            }}
            className="hero-coverflow !pb-16"
          >
            {slides.map((slide) => {
              const card = (
                <div className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[440px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-zinc-200">
                  <Image
                    src={slide.image_url}
                    alt="Hero slide"
                    fill
                    priority
                    sizes="(min-width: 1024px) 440px, (min-width: 768px) 380px, (min-width: 640px) 320px, 260px"
                    className="object-cover"
                  />
                </div>
              )

              return (
                <SwiperSlide
                  key={slide.id}
                  className="!w-[260px] sm:!w-[320px] md:!w-[380px] lg:!w-[440px]"
                >
                  {slide.link_url ? (
                    slide.link_url.startsWith('http') ? (
                      <a href={slide.link_url} target="_blank" rel="noopener noreferrer" className="block">
                        {card}
                      </a>
                    ) : (
                      <Link href={slide.link_url} className="block">
                        {card}
                      </Link>
                    )
                  ) : (
                    card
                  )}
                </SwiperSlide>
              )
            })}
          </Swiper>

          <button
            type="button"
            aria-label="Previous slide"
            className="hero-carousel-prev hidden md:flex absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-zinc-900 shadow-lg items-center justify-center transition-transform hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="hero-carousel-next hidden md:flex absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-zinc-900 shadow-lg items-center justify-center transition-transform hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="hero-carousel-pagination relative mt-6 flex justify-center gap-2" />
        </div>
        )}

        {!loaded && (
          <p className="sr-only">Loading hero carousel…</p>
        )}
      </div>

      <style jsx global>{`
        .hero-coverflow .swiper-slide {
          transition: opacity 400ms ease, transform 400ms ease;
          opacity: 0.55;
        }
        .hero-coverflow .swiper-slide-active {
          opacity: 1;
        }
        .hero-coverflow .swiper-slide-prev,
        .hero-coverflow .swiper-slide-next {
          opacity: 0.85;
        }
        .hero-carousel-pagination .swiper-pagination-bullet {
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(15, 15, 15, 0.25);
          opacity: 1;
          transition: width 200ms ease, background-color 200ms ease;
        }
        .hero-carousel-pagination .swiper-pagination-bullet-active {
          width: 1.75rem;
          border-radius: 9999px;
          background-color: rgb(37, 99, 235);
        }
      `}</style>
    </section>
  )
}
