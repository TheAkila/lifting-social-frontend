'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '@/components/layout/Logo'

const mainNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Stories', href: '/stories' },
  { name: 'Events', href: '/events' },
]

const secondaryNavLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Main Navigation - Single Clean Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-soft border-b border-zinc-100'
            : 'bg-white border-b border-zinc-100'
        }`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left Corner */}
            <Link href="/" className="flex items-center group pl-4">
              <Logo />
            </Link>

            {/* Main Navigation - Desktop - Centered */}
            <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-[10px] transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-zinc-900 bg-zinc-100'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Secondary Links - Desktop */}
              <div className="hidden md:flex items-center space-x-1 mr-2">
                {secondaryNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-5 bg-zinc-200" />

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-brand-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </Link>

              {/* User Actions */}
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">{user.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-[10px] transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                  <Logo />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                    title="Close menu"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <div className="space-y-6">
                  {/* Main Links */}
                  <div className="space-y-1">
                    {mainNavLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 text-base font-medium rounded-[10px] transition-all duration-200 ${
                          isActive(link.href)
                            ? 'text-zinc-900 bg-zinc-100'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-100" />

                  {/* Secondary Links */}
                  <div className="space-y-1">
                    {secondaryNavLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-base text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  {/* Account Section */}
                  <div className="pt-4 border-t border-zinc-100">
                    {user ? (
                      <div className="space-y-1">
                        <div className="px-4 py-2 mb-2">
                          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Account</p>
                          <p className="text-sm font-medium text-zinc-900 mt-1">{user.name}</p>
                        </div>
                        <Link
                          href={user.role === 'admin' ? '/admin' : '/dashboard'}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-base text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-base text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 px-4">
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full py-3 text-center text-base font-medium text-zinc-600 border border-zinc-200 rounded-[10px] hover:bg-zinc-50 transition-all duration-200"
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full py-3 text-center text-base font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-[10px] transition-all duration-200"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  )
}
