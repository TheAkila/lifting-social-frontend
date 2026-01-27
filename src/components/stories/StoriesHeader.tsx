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
              Weightlifting News
            </h1>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-[16px] p-8 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-display font-semibold mb-2">
                  All the latest from the world of weightlifting
                </h2>
                <p className="text-zinc-400">
                  straight to your inbox.
                </p>
              </div>
              
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-[8px] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-[8px] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-white text-zinc-900 hover:bg-zinc-100 px-8 py-3 rounded-[8px] text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
