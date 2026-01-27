'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useState } from 'react'

export default function StoriesHeader() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribe:', { firstName, email })
    setEmail('')
    setFirstName('')
  }

  return (
    <section className="bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Weightlifting Blog
            </h1>
            
            <p className="text-zinc-400 text-sm leading-relaxed">
    We automatically curate the latest articles from <strong className="text-zinc-300">Weightlifting House</strong>, <strong className="text-zinc-300">All Things Gym</strong>, <strong className="text-zinc-300">BarBend</strong>, <strong className="text-zinc-300">IWF</strong>, and <strong className="text-zinc-300">Juggernaut Training Systems</strong>. All content is attributed to original sources.
  </p>
          </motion.div>

         
          
        </div>
      </div>
    </section>
  )
}
