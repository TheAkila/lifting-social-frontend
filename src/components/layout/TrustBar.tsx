'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const FEATURES = [
  { label: 'Since 2023', detail: "Sri Lanka's largest weightlifting community" },
  { label: 'Built for Champions', detail: '500+ orders shipped' },
  { label: 'Streaming Partner of Nationals 2026', detail: '12,000+ Followers' },
]

export default function TrustBar() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length)
    }, 3000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="mt-8 bg-zinc-50 border-b border-zinc-100">
      <div className="container mx-auto px-4">
        {/* Desktop: all three sections in one line */}
        <div className="hidden md:flex items-center justify-between gap-6 py-2.5">
          {FEATURES.map((feature) => (
            <p key={feature.label} className="flex-1 text-center text-sm text-zinc-600 whitespace-nowrap">
              {feature.label} <span className="text-zinc-300 mx-1.5">|</span> {feature.detail}
            </p>
          ))}
        </div>

        {/* Mobile: cycle through sections one at a time, no horizontal scroll */}
        <div className="md:hidden relative h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center text-center text-xs leading-tight text-zinc-600 px-4"
            >
              {FEATURES[activeIndex].label}
              <span className="text-zinc-300 mx-1.5">|</span>
              {FEATURES[activeIndex].detail}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
