'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, X, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Sample gallery images - replace with actual images from admin dashboard
const galleryImages = [
  { id: 1, src: '/images/gallery/sample-1.jpg', alt: 'Weightlifting competition moment', category: 'Competition' },
  { id: 2, src: '/images/gallery/sample-2.jpg', alt: 'Athlete performing snatch', category: 'Training' },
  { id: 3, src: '/images/gallery/sample-3.jpg', alt: 'Clean and jerk lift', category: 'Competition' },
  { id: 4, src: '/images/gallery/sample-4.jpg', alt: 'Celebration after successful lift', category: 'Moments' },
  { id: 5, src: '/images/gallery/sample-5.jpg', alt: 'Intense training session', category: 'Training' },
  { id: 6, src: '/images/gallery/sample-6.jpg', alt: 'Medal ceremony', category: 'Moments' },
]

export default function PhotographyPage() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-4">
        <div className="container mx-auto px-4">
          <Link href="/sports-media" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Sports Media</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-black text-white py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Sports Photography
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300">
              Professional photography services capturing the power, intensity, and emotion of weightlifting sports
            </p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-4 sm:mb-6">
              What We Offer
            </h2>
            <div className="space-y-3 sm:space-y-4 text-zinc-600">
              <p className="text-base sm:text-lg">
                Our sports photography services are designed specifically for weightlifting athletes, coaches, and event organizers. We understand the unique challenges of capturing the explosive power and technical precision of Olympic weightlifting.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <li className="flex items-start gap-3 text-base sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span>Competition photography</span>
                </li>
                <li className="flex items-start gap-3 text-base sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span>Training session documentation</span>
                </li>
                <li className="flex items-start gap-3 text-base sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span>Athlete portraits and profiles</span>
                </li>
                <li className="flex items-start gap-3 text-base sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span>Event highlights and coverage</span>
                </li>
                <li className="flex items-start gap-3 text-base sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span>Team and gym photography</span>
                </li>
                <li className="flex items-start gap-3 text-base sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span>High-resolution digital delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 sm:mb-4">
              Our Work
            </h2>
            <p className="text-base sm:text-lg text-zinc-600">
              Browse through our collection of captured moments
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative aspect-square bg-zinc-200 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-white/20" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{image.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-zinc-500 text-xs sm:text-sm px-4">
              Sample gallery images. Add your photos through the admin dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 sm:mb-4">
                Book Your Session
              </h2>
              <p className="text-base sm:text-lg text-zinc-600">
                Get in touch to discuss your photography needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6 text-center">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2 text-sm sm:text-base">Phone</h3>
                <p className="text-zinc-600 text-sm sm:text-base">+94 77 123 4567</p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6 text-center">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2 text-sm sm:text-base">Email</h3>
                <p className="text-zinc-600 text-sm sm:text-base">photography@liftingsocial.lk</p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6 text-center">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2 text-sm sm:text-base">Location</h3>
                <p className="text-zinc-600 text-sm sm:text-base">Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close image modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="max-w-5xl w-full">
              <div className="aspect-video bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                <Camera className="w-20 h-20 text-white/20" />
              </div>
              <p className="text-white text-center mt-4">{selectedImage.alt}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
