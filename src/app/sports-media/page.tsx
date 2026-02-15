import { Metadata } from 'next'
import Link from 'next/link'
import { Camera, Video, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sports Media | LiftingSocial',
  description: 'Professional sports photography and live event coverage services',
}

export default function SportsMediaPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Sports Media Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-6 sm:mb-8">
              Capturing the power, passion, and precision of weightlifting through professional photography and live event coverage
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Sports Photography */}
            <Link
              href="/sports-media/photography"
              className="group bg-zinc-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video bg-black flex items-center justify-center">
                <Camera className="w-16 sm:w-20 h-16 sm:h-20 text-white" />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-zinc-900 mb-4 group-hover:text-brand-accent transition-colors">
                  Sports Photography
                </h2>
                <p className="text-zinc-600 mb-6">
                  Professional photography services capturing the intensity and athleticism of weightlifting competitions and training sessions.
                </p>
                <div className="flex items-center gap-2 text-brand-accent font-medium">
                  <span>View Gallery</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Live Sports Events */}
            <Link
              href="/sports-media/live-events"
              className="group bg-zinc-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video bg-black flex items-center justify-center">
                <Video className="w-16 sm:w-20 h-16 sm:h-20 text-white" />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-zinc-900 mb-4 group-hover:text-brand-accent transition-colors">
                  Live Sports Events
                </h2>
                <p className="text-zinc-600 mb-6">
                  Complete live event coverage including live streaming, real-time updates, and comprehensive event documentation.
                </p>
                <div className="flex items-center gap-2 text-brand-accent font-medium">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 sm:mb-4">
                Get in Touch
              </h2>
              <p className="text-base sm:text-lg text-zinc-600">
                Ready to capture your sporting moments? Contact us to discuss your needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-5 sm:p-6 text-center">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2 text-sm sm:text-base">Phone</h3>
                <p className="text-zinc-600 text-sm sm:text-base">+94 77 123 4567</p>
              </div>

              <div className="bg-white rounded-xl p-5 sm:p-6 text-center">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2 text-sm sm:text-base">Email</h3>
                <p className="text-zinc-600 text-sm sm:text-base">media@liftingsocial.lk</p>
              </div>

              <div className="bg-white rounded-xl p-5 sm:p-6 text-center">
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
    </div>
  )
}
