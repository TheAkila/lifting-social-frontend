'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const founderAchievements = [
  { label: 'BSc in Computer Science', detail: 'University of Colombo' },
  { label: 'Software Engineer', detail: 'Tech & product builder' },
  { label: 'Weightlifter since 2018', detail: 'Over 7 years on the platform' },
  { label: 'University Records Holder', detail: 'University of Colombo' },
  { label: 'National Athlete', detail: 'Sri Lanka' },
  { label: 'Founder of Lifting Social', detail: 'Est. 2023' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <section className="bg-zinc-950 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 sm:mb-4">
              About Lifting Social
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 px-4">
              More than a brand—we're a movement celebrating Sri Lankan weightlifting culture
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 text-center mb-4 sm:mb-6">Our Mission</h2>
            <p className="text-base sm:text-lg text-zinc-600 text-center mb-6 sm:mb-8">
              To elevate Sri Lankan Olympic weightlifting by creating a platform that connects athletes, 
              celebrates achievements, provides quality gear, and inspires the next generation of champions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-brand-dark">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 text-brand-light/80"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-6 sm:mb-8">Our Story</h2>
            
            <p className="text-base sm:text-lg">
              Lifting Social was born from a simple observation: Sri Lankan weightlifters had incredible 
              talent but lacked a unified platform to showcase their achievements, connect with supporters, 
              and access quality training gear.
            </p>
            
            <p className="text-base sm:text-lg">
              Founded in 2023, we started with a vision to change this. What began as a small online 
              community quickly grew into a comprehensive lifestyle brand that serves athletes, coaches, 
              and fans across the island.
            </p>
            
            <p className="text-base sm:text-lg">
              Today, Lifting Social is proud to be Sri Lanka's premier Olympic weightlifting platform, 
              offering premium apparel, connecting coaches with students, 
              and building a community that celebrates every lift, every achievement, and every dream.
            </p>
            
            <p className="text-base sm:text-lg font-semibold text-blue-600">
              We're not just selling products—we're building a legacy. Join us in lifting Sri Lankan
              weightlifting to new heights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder / Director */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-zinc-50 to-white py-16 sm:py-20 md:py-28 px-4">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-zinc-400/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-zinc-300/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="container-custom relative max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-zinc-900 tracking-tight">
              Meet the Visionary Behind Lifting Social
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
              An engineer, athlete, and builder driving Sri Lankan weightlifting forward.
            </p>
          </motion.div>

          <div className="grid gap-10 lg:gap-16 lg:grid-cols-12 items-center">
            {/* Image collage */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow */}
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-zinc-400/25 via-zinc-300/15 to-transparent blur-2xl" />

                {/* Primary image */}
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-zinc-200 shadow-card-hover">
                  <div className="relative aspect-[4/5] bg-zinc-100">
                    <Image
                      src="/images/founder-1.jpg"
                      alt="Akila Nishan Jayakody – Founder & Director of Lifting Social"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Secondary image - offset */}
                <div className="absolute -bottom-8 -right-6 sm:-right-10 w-2/5 rounded-2xl overflow-hidden ring-4 ring-white shadow-card-hover rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="relative aspect-[3/4] bg-zinc-100">
                    <Image
                      src="/images/founder-2.jpg"
                      alt="Akila Nishan Jayakody competing as a national weightlifter"
                      fill
                      sizes="(max-width: 1024px) 40vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Floating stat badge */}
                <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 rounded-2xl bg-zinc-900 px-4 py-3 shadow-card-hover">
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white leading-none">2023</p>
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-zinc-400 mt-1">
                    Founded
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-7 mt-12 lg:mt-0"
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-zinc-900 tracking-tight">
                Akila Nishan{' '}
                <span className="bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent">
                  Jayakody
                </span>
              </h3>
              <p className="mt-2 text-sm sm:text-base font-medium text-zinc-700 uppercase tracking-[0.2em]">
                Founder · Director · National Athlete
              </p>

              <div className="mt-6 space-y-4 text-zinc-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Akila is a software engineer and a BSc in Computer Science graduate from the
                  University of Colombo. He has been an Olympic weightlifter since 2018, going on to
                  set university records and represent Sri Lanka as a national athlete.
                </p>
                <p>
                  In 2023, he founded <span className="text-zinc-900 font-semibold">Lifting Social</span> to
                  bridge two worlds he knows intimately, technology and the iron platform, and to give
                  Sri Lankan lifters the brand, community, and tools they deserve.
                </p>
              </div>

              {/* Achievements grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {founderAchievements.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + idx * 0.05 }}
                    className="group flex items-start gap-3 rounded-xl bg-white p-3.5 ring-1 ring-inset ring-zinc-200 shadow-soft hover:ring-zinc-900/40 hover:shadow-card transition-all"
                  >
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white ring-1 ring-inset ring-zinc-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{item.label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mt-8 border-l-2 border-zinc-900 pl-4 sm:pl-5"
              >
                <p className="text-base sm:text-lg italic text-zinc-800">
                  &ldquo;Every lift in Sri Lanka deserves a stage. Lifting Social is that stage,
                  built by lifters, Built for Champions.&rdquo;
                </p>
                <footer className="mt-2 text-xs sm:text-sm text-zinc-500">
                  Akila Nishan Jayakody
                </footer>
              </motion.blockquote>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
