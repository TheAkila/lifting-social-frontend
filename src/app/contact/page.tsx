'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement actual form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      
      setTimeout(() => setSubmitSuccess(false), 5000)
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <section className="bg-zinc-950 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Get in Touch
            </h1>
            <p className="text-sm md:text-base text-zinc-400">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="card"
              >
                <h3 className="text-xl sm:text-2xl font-display font-bold mb-4 sm:mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-blue-600 text-xl mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-zinc-600 text-sm">
                        123 Galle Road<br />
                        Colombo 03, Sri Lanka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-blue-600 text-xl mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-zinc-600 text-sm">
                        +94 77 123 4567<br />
                        
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-blue-600 text-xl mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-zinc-600 text-sm">
                        info@liftingsocial.com
                        
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://facebook.com/liftingsocial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <FaFacebook className="text-xl" />
                    </a>
                    <a
                      href="https://instagram.com/liftingsocial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <FaInstagram className="text-xl" />
                    </a>
                    <a
                      href="https://whatsapp.com/channel/0029Vb6anfUDjiOUZhVkSe1h"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <FaWhatsapp className="text-xl" />
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card"
              >
                <h3 className="text-2xl font-display font-bold mb-6">Send Us a Message</h3>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-[8px] text-green-700 font-medium">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-zinc-200 rounded-[8px] px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-250"
                        placeholder="Akila Nishan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-zinc-200 rounded-[8px] px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-250"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border border-zinc-200 rounded-[8px] px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-250"
                        placeholder="+94 77 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-900 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-zinc-200 rounded-[8px] px-4 py-3 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-250"
                        aria-label="Subject"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="coaching">Coaching Information</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-white border border-zinc-200 rounded-[8px] px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-250 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium py-3.5 px-8 rounded-[10px] transition-all duration-250 text-sm tracking-wide shadow-soft hover:shadow-card hover:-translate-y-0.5"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
