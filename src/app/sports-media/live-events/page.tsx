import { Metadata } from 'next'
import Link from 'next/link'
import { Video, Wifi, Users, Camera, Radio, ArrowLeft, Phone, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Live Sports Events | LiftingSocial',
  description: 'Professional live streaming and event coverage for weightlifting competitions',
}

export default function LiveEventsPage() {
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
              Live Sports Events
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300">
              Professional live streaming and comprehensive event coverage for weightlifting competitions and sporting events
            </p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-4 sm:mb-6">
              Complete Event Coverage
            </h2>
            <div className="space-y-3 sm:space-y-4 text-zinc-600 mb-10 sm:mb-12">
              <p className="text-base sm:text-lg">
                Our live event coverage services bring your weightlifting competitions to audiences around the world. Whether it's a local meet or a national championship, we provide professional-grade streaming and documentation services.
              </p>
              <p className="text-base sm:text-lg">
                We handle all technical aspects of live broadcasting, allowing organizers to focus on running a successful competition while we ensure every moment is captured and shared with your audience.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Wifi className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-900 mb-2 sm:mb-3">Live Streaming</h3>
                <p className="text-zinc-600 text-sm sm:text-base">
                  High-quality multi-camera live streaming to platforms like YouTube, Facebook, and custom streaming services with professional commentary support.
                </p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Camera className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-900 mb-2 sm:mb-3">Event Documentation</h3>
                <p className="text-zinc-600 text-sm sm:text-base">
                  Complete video recording of all lifts, award ceremonies, and key moments with professional editing and highlight reels delivered post-event.
                </p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Radio className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-900 mb-2 sm:mb-3">Real-Time Updates</h3>
                <p className="text-zinc-600 text-sm sm:text-base">
                  Live scoring updates, result graphics, and social media integration to keep your audience engaged throughout the competition.
                </p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-900 mb-2 sm:mb-3">On-Site Team</h3>
                <p className="text-zinc-600 text-sm sm:text-base">
                  Professional crew managing cameras, audio, graphics, and streaming to ensure smooth operation and high-quality output throughout your event.
                </p>
              </div>
            </div>

            {/* Package Features */}
            <div className="bg-black/5 rounded-2xl p-6 sm:p-8 border border-black/10">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 mb-4 sm:mb-6">
                What's Included
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-zinc-700">Multi-camera setup and switching</span>
                </li>
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-zinc-700">Professional audio mixing</span>
                </li>
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-zinc-700">Live graphics and overlays</span>
                </li>
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-zinc-700">Instant replay capabilities</span>
                </li>
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-zinc-700">High-definition recording</span>
                </li>
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-zinc-700">Post-event highlight videos</span>
                </li>
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-zinc-700">Social media coverage</span>
                </li>
                <li className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-zinc-700">Technical support throughout event</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black rounded-2xl p-6 sm:p-9 md:p-12 text-white text-center">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Planning an Event?
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Let us handle your live streaming and event coverage. Contact us for a custom quote tailored to your event's needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href="tel:+94771234567"
                  className="bg-white text-black px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-zinc-100 transition-colors text-sm sm:text-base"
                >
                  Call Now
                </a>
                <a
                  href="mailto:events@liftingsocial.lk"
                  className="bg-zinc-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-colors text-sm sm:text-base"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 sm:mb-4">
                Get in Touch
              </h2>
              <p className="text-base sm:text-lg text-zinc-600">
                Ready to elevate your event? Contact our team today
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
                <p className="text-zinc-600 text-sm sm:text-base">events@liftingsocial.lk</p>
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
    </div>
  )
}
