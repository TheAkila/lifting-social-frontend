'use client'

import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  MapPin,
  Mail,
  Phone,
  Heart,
  ArrowUp,
  ArrowRight,
} from 'lucide-react'
import Logo from '@/components/layout/Logo'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-zinc-950 text-white relative">
      {/* Top Gradient Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-10 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 col-span-full">
              <Logo className="mb-6" />
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-sm">
                Fusing Olympic weightlifting culture, Sri Lankan athletic pride,
                and modern fitness fashion into one inspiring community.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3 mb-8">
                <a
                  href="https://web.facebook.com/profile.php?id=61568217705957"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-800 hover:bg-brand-accent rounded-[10px] flex items-center justify-center transition-all duration-250 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </a>
                <a
                  href="https://www.instagram.com/theliftingsocial?igsh=MXBoenJvdzlzZTBsZQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-800 hover:bg-brand-accent rounded-[10px] flex items-center justify-center transition-all duration-250 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-800 hover:bg-brand-accent rounded-[10px] flex items-center justify-center transition-all duration-250 group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </a>
                <a
                  href="https://whatsapp.com/channel/0029Vb6anfUDjiOUZhVkSe1h"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-800 hover:bg-brand-accent rounded-[10px] flex items-center justify-center transition-all duration-250 group"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </a>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-[12px] p-5">
                <h4 className="font-display font-semibold text-lg mb-2 text-white">Stay Connected</h4>
                <p className="text-zinc-400 text-sm mb-4">
                  Get the latest updates on athletes, events, and products.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-l-[8px] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-r-[8px] text-sm font-medium transition-colors duration-250">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-base mb-5 text-white">Shop</h3>
              <ul className="space-y-3">
                {[
                  { name: 'All Products', href: '/shop' },
                  { name: 'Apparel', href: '/shop?category=Apparel' },
                  { name: 'Accessories', href: '/shop?category=Accessories' },
                  { name: 'Equipment', href: '/shop?category=Equipment' },
                  { name: 'Merchandise', href: '/shop?category=Merchandise' },
                  { name: 'Shopping Cart', href: '/cart' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Links */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-base mb-5 text-white">Community</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Lifting Stories', href: '/stories' },
                  { name: 'Athletes', href: '/athletes' },
                  { name: 'Coaching', href: '/coaching' },
                  { name: 'Events', href: '/events' },
                  { name: 'Join Community', href: '/signup' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-base mb-5 text-white">Company</h3>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Partnerships', href: '/partnerships' },
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Terms of Service', href: '/terms' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-base mb-5 text-white">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Colombo, Sri Lanka</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">hello@liftingsocial.lk</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">+94 77 123 4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Lifting Social. All rights reserved. 
              
            </p>
            
            <div className="flex items-center space-x-4">
              <span className="text-zinc-500 text-sm hidden sm:inline">
                Strength • Community • Excellence
              </span>
              
              <button
                onClick={scrollToTop}
                className="w-9 h-9 bg-zinc-800 hover:bg-blue-600 rounded-[8px] flex items-center justify-center transition-all duration-250 group"
                title="Scroll to top"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
