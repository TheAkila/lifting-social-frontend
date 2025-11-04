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
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="hero-bg py-20 mt-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-brand-light/80">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-brand-dark">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="card"
              >
                <h3 className="text-2xl font-display font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-brand-accent text-xl mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-brand-light/70 text-sm">
                        123 Galle Road<br />
                        Colombo 03, Sri Lanka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-brand-accent text-xl mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-brand-light/70 text-sm">
                        +94 77 123 4567<br />
                        +94 11 234 5678
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-brand-accent text-xl mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-brand-light/70 text-sm">
                        info@liftingsocial.lk<br />
                        support@liftingsocial.lk
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
                      className="w-10 h-10 rounded-full bg-brand-secondary/50 flex items-center justify-center hover:bg-brand-accent transition-colors"
                    >
                      <FaFacebook className="text-xl" />
                    </a>
                    <a
                      href="https://instagram.com/liftingsocial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-brand-secondary/50 flex items-center justify-center hover:bg-brand-accent transition-colors"
                    >
                      <FaInstagram className="text-xl" />
                    </a>
                    <a
                      href="https://whatsapp.com/channel/0029Vb6anfUDjiOUZhVkSe1h"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-brand-secondary/50 flex items-center justify-center hover:bg-brand-accent transition-colors"
                    >
                      <FaWhatsapp className="text-xl" />
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Business Hours</h4>
                  <div className="text-sm text-brand-light/70 space-y-1">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
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
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+94 77 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="input-field"
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
                    <label className="block text-sm font-semibold mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full md:w-auto"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
