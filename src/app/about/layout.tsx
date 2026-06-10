import type { Metadata } from 'next'

const SITE_URL = 'https://theliftingsocial.com'
const ABOUT_URL = `${SITE_URL}/about`
const FOUNDER_IMAGE = `${SITE_URL}/images/founder-1.jpg`

export const metadata: Metadata = {
  title: 'About Akila Nishan Jayakody — Founder of Lifting Social',
  description:
    'Akila Nishan Jayakody is a software engineer, BSc in Computer Science graduate of the University of Colombo, national weightlifter, University of Colombo records holder, and the founder of Lifting Social (est. 2023).',
  alternates: {
    canonical: ABOUT_URL,
  },
  openGraph: {
    title: 'About Akila Nishan Jayakody — Founder of Lifting Social',
    description:
      'Software engineer, national weightlifter, and founder of Lifting Social — Sri Lanka’s premier Olympic weightlifting platform.',
    url: ABOUT_URL,
    siteName: 'Lifting Social',
    images: [
      {
        url: FOUNDER_IMAGE,
        width: 1200,
        height: 1500,
        alt: 'Akila Nishan Jayakody — Founder & Director of Lifting Social',
      },
    ],
    locale: 'en_LK',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Akila Nishan Jayakody — Founder of Lifting Social',
    description:
      'Software engineer, national weightlifter, and founder of Lifting Social.',
    images: [FOUNDER_IMAGE],
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${ABOUT_URL}#akila-nishan-jayakody`,
  name: 'Akila Nishan Jayakody',
  alternateName: ['Akila Nishan', 'Akila Jayakody'],
  givenName: 'Akila',
  additionalName: 'Nishan',
  familyName: 'Jayakody',
  gender: 'Male',
  nationality: {
    '@type': 'Country',
    name: 'Sri Lanka',
  },
  jobTitle: ['Founder & Director, Lifting Social', 'Software Engineer', 'National Weightlifter'],
  description:
    'Software engineer, BSc in Computer Science graduate of the University of Colombo, University of Colombo records holder in Olympic weightlifting, national athlete representing Sri Lanka, and founder of Lifting Social (2023).',
  url: ABOUT_URL,
  image: FOUNDER_IMAGE,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Colombo',
    sameAs: 'https://cmb.ac.lk/',
  },
  worksFor: {
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: 'Lifting Social',
    url: SITE_URL,
    founder: 'Akila Nishan Jayakody',
    foundingDate: '2023',
  },
  knowsAbout: [
    'Olympic Weightlifting',
    'Software Engineering',
    'Sports Technology',
    'E-commerce',
    'Sri Lankan Weightlifting',
  ],
  sameAs: [
    'https://www.linkedin.com/in/akila-nishan-4b028',
    'https://www.facebook.com/akilanishan.jayakody',
    'https://www.instagram.com/theakila__/',
  ],
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}#organization`,
  name: 'Lifting Social',
  url: SITE_URL,
  logo: `${SITE_URL}/lifting-social-logo.svg`,
  foundingDate: '2023',
  founder: {
    '@id': `${ABOUT_URL}#akila-nishan-jayakody`,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Colombo',
    addressCountry: 'LK',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'theliftingsocial@gmail.com',
    telephone: '+94-76-482-9645',
    areaServed: 'LK',
    availableLanguage: ['English', 'Sinhala'],
  },
  sameAs: [
    'https://web.facebook.com/profile.php?id=61568217705957',
    'https://www.instagram.com/theliftingsocial/',
    'https://wa.me/94764829645',
  ],
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {children}
    </>
  )
}
