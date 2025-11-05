import Link from 'next/link'
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaDumbbell,
  FaWhatsapp,
} from 'react-icons/fa'
import Logo from '@/components/layout/Logo'

export default function Footer() {
  return (
    <footer className="bg-brand-secondary/50 border-t border-brand-light/10">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Logo className="mb-4" />
            <p className="text-brand-light/70 text-sm mb-4">
              Fusing Olympic weightlifting culture, Sri Lankan athletic pride,
              and modern fitness fashion.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://web.facebook.com/profile.php?id=61568217705957"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-light hover:text-brand-accent transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://www.instagram.com/theliftingsocial?igsh=MXBoenJvdzlzZTBsZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-light hover:text-brand-accent transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-light hover:text-brand-accent transition-colors"
              >
                <FaYoutube className="text-2xl" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb6anfUDjiOUZhVkSe1h"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-light hover:text-brand-accent transition-colors"
              >
                <FaWhatsapp className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Apparel"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Accessories"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Equipment"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Merchandise"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Merchandise
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/stories"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Lifting Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/athletes"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Athletes
                </Link>
              </li>
              <li>
                <Link
                  href="/coaching"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Coaching
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/partnerships"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Partnerships
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-light/10 mt-8 pt-8 text-center">
          <p className="text-brand-light/50 text-sm">
            © {new Date().getFullYear()} Lifting Social. All rights reserved.
            Built with 💪 in Sri Lanka.
          </p>
        </div>
      </div>
    </footer>
  )
}
