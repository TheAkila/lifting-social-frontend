import Link from 'next/link'
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaDumbbell,
} from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-brand-secondary/50 border-t border-brand-light/10">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
                <FaDumbbell className="text-white text-xl" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Lifting Social
              </span>
            </div>
            <p className="text-brand-light/70 text-sm mb-4">
              Fusing Olympic weightlifting culture, Sri Lankan athletic pride,
              and modern fitness fashion.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-light hover:text-brand-accent transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://instagram.com"
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
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-light hover:text-brand-accent transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop/apparel"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/accessories"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/equipment"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/new-arrivals"
                  className="text-brand-light/70 hover:text-brand-accent transition-colors"
                >
                  New Arrivals
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
