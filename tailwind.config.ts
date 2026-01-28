import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern brand colors with refined palette
        brand: {
          primary: '#0f0f0f', // Near black - main brand color
          secondary: '#fafafa', // Off-white
          accent: '#2563eb', // Blue accent for CTAs
          dark: '#09090b', // Deep black background
          light: '#f4f4f5', // Light zinc background
        },
        // Category-specific colors for content types
        category: {
          athletes: '#6366f1', // Indigo
          stories: '#8b5cf6', // Violet
          events: '#f59e0b', // Amber
          shop: '#10b981', // Emerald
          coaching: '#06b6d4', // Cyan
        },
        // Status colors
        status: {
          positive: '#22c55e', // Green for gains/success
          negative: '#ef4444', // Red for losses/errors
          neutral: '#71717a', // Zinc for neutral
        },
        // Enhanced zinc colors for modern design
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        body: ['var(--font-ibm-plex)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Custom type scale for better hierarchy
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading-lg': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'heading': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'small': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        // Consistent rounded corners (8-12px standard)
        'card': '12px',
        'button': '10px',
        'badge': '9999px', // Pill shape
        'input': '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'marquee-ltr': 'marquee-ltr 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'marquee-ltr': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        // Refined shadow system
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 12px -4px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 16px -4px rgba(0, 0, 0, 0.1), 0 8px 24px -8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 28px -6px rgba(0, 0, 0, 0.15), 0 16px 40px -12px rgba(0, 0, 0, 0.1)',
        'brand': '0 4px 16px 0 rgba(225, 29, 72, 0.25)',
        'brand-lg': '0 8px 28px -4px rgba(225, 29, 72, 0.3)',
        'glow': '0 0 40px -8px rgba(225, 29, 72, 0.4)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
export default config
