'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

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
              More than a brand. We're a movement celebrating Sri Lankan weightlifting culture
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-20 md:py-24 px-4">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 text-center mb-8 sm:mb-10">
              The Story Behind LiftingSocial
            </h2>

            <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 text-base sm:text-lg leading-relaxed text-zinc-600">
              <p>
                It all started in 2023, when founder Akila Jayakody recognised something missing in Sri
                Lankan Olympic weightlifting: a genuine connection between the sport, its athletes, and
                the people who support it. Athletes deserved greater recognition, competitions deserved
                wider exposure, and fans deserved a closer connection to the sport.
              </p>
              <p>
                Driven by this vision, Akila began documenting hundreds of athletes and competitions,
                travelling across Sri Lanka to capture weightlifting in action. What started as a passion
                for bringing the sport closer to its people grew into Sri Lanka&rsquo;s first Olympic
                weightlifting brand and sports technology initiative.
              </p>
            </div>

            <p className="mt-8 text-center text-xl sm:text-2xl font-display font-semibold text-zinc-900">
              That vision became LiftingSocial.
            </p>
            <p className="mt-2 text-center text-sm sm:text-base text-zinc-500">
              And the passion that started it all continues to shape everything we do.
            </p>
          </motion.div>

          <div className="mt-14 sm:mt-20 grid gap-10 lg:gap-16 lg:grid-cols-12 items-center">
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
                Akila Nishan Jayakody
              </h3>
              <p className="mt-2 text-sm sm:text-base font-medium text-zinc-700 uppercase tracking-[0.2em]">
                Owner · Founder · Director · National Athlete
              </p>

              <div className="mt-6 space-y-4 text-zinc-700 text-base sm:text-lg leading-relaxed">
                <p>
                  <span className="text-zinc-900 font-semibold">Akila Nishan Jayakody is the owner of Lifting Social</span>,
                  as well as its founder and director. He is a{' '}
                  <span className="text-zinc-900 font-semibold">software engineer</span> and
                  a <span className="text-zinc-900 font-semibold">BSc in Computer Science</span> graduate
                  from the <span className="text-zinc-900 font-semibold">University of Colombo</span>.
                  An Olympic weightlifter since 2018, he holds
                  {' '}<span className="text-zinc-900 font-semibold">Sri Lanka University weightlifting meet records</span> and
                  represents Sri Lanka as a <span className="text-zinc-900 font-semibold">national athlete</span>.
                </p>
                <p>
                  In <span className="text-zinc-900 font-semibold">2023</span>, Akila founded and now owns{' '}
                  <span className="text-zinc-900 font-semibold">Lifting Social</span> to bridge two
                  worlds he knows intimately, technology and the iron platform, and to give Sri Lankan
                  lifters the brand, community, and tools they deserve. As the sole owner of Lifting
                  Social, he leads the brand&rsquo;s vision, operations, and growth.
                </p>
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

      {/* Mission */}
      <section className="py-14 sm:py-20 md:py-24 px-4 bg-zinc-50">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 text-center mb-8 sm:mb-10">
              Our Mission
            </h2>

            <blockquote className="border-l-2 border-zinc-900 pl-5 sm:pl-6 mb-8 sm:mb-10">
              <p className="text-lg sm:text-xl italic text-zinc-800 leading-relaxed">
                &ldquo;To elevate Sri Lankan Olympic weightlifting by creating a platform that connects
                athletes, celebrates achievements, provides quality gear, and inspires the next
                generation of champions.&rdquo;
              </p>
            </blockquote>

            <div className="space-y-5 text-base sm:text-lg leading-relaxed text-zinc-600">
              <p>
                Today, we work alongside some of the greatest weightlifters of this generation, creating
                performance-driven clothing and equipment designed to support their pursuit of
                excellence. We bring these products to the fans who share the same passion, building a
                community that stands behind its athletes, celebrates their achievements, and contributes
                to the continued growth and accessibility of the sport.
              </p>
              <p>
                We believe weightlifting is more than a sport. It is a community built on strength,
                dedication, discipline, and passion.
              </p>
            </div>

            <div className="mt-10 text-center space-y-1">
              <p className="text-base sm:text-lg font-bold text-zinc-900">
                When you choose LiftingSocial, you choose Weightlifting.
              </p>
              <p className="text-base sm:text-lg font-bold text-zinc-900">
                LiftingSocial: Built by Champions&trade;.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
