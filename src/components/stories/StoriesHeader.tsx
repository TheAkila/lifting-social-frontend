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
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 tracking-tight">
              Weightlifting Blog
            </h1>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Curated articles from top weightlifting sources worldwide
            </p>

            {/* Sources Section */}
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <p className="text-zinc-500 text-xs mb-3">Featured Sources:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="text-xs">
                  <span className="text-zinc-300 font-medium">Weightlifting House</span>
                </div>
                <div className="text-zinc-600">•</div>
                <div className="text-xs">
                  <span className="text-zinc-300 font-medium">All Things Gym</span>
                </div>
                <div className="text-zinc-600">•</div>
                <div className="text-xs">
                  <span className="text-zinc-300 font-medium">BarBend</span>
                </div>
                <div className="text-zinc-600">•</div>
                <div className="text-xs">
                  <span className="text-zinc-300 font-medium">IWF</span>
                </div>
                <div className="text-zinc-600">•</div>
                <div className="text-xs">
                  <span className="text-zinc-300 font-medium">Juggernaut Training Systems</span>
                </div>
              </div>
            </div>
          </motion.div>

         
          
        </div>
      </div>
    </section>
  )
}
