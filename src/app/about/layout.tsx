import type { Metadata } from 'next'

const SITE_URL = 'https://theliftingsocial.com'
const ABOUT_URL = `${SITE_URL}/about`
const FOUNDER_IMAGE = `${SITE_URL}/images/founder-1.jpg`

export const metadata: Metadata = {
  title: 'About Lifting Social',
  description:
    'Learn the story behind Lifting Social, the Sri Lankan weightlifting lifestyle brand built around premium gear, coaching, media support, and fitness events.',
  keywords: [
    'About Lifting Social',
    'Lifting Social story',
    'Lifting Social Sri Lanka',
    'Sri Lankan weightlifting',
  ],
  alternates: {
    canonical: ABOUT_URL,
  },
  openGraph: {
    title: 'About Lifting Social',
    description:
      'Discover the story, mission, and community behind Lifting Social — Sri Lanka’s premier Olympic weightlifting platform.',
    url: ABOUT_URL,
    siteName: 'Lifting Social',
    images: [
      {
        url: FOUNDER_IMAGE,
        width: 1200,
        height: 1500,
        alt: 'Akila Nishan Jayakody — Owner, Founder & Director of Lifting Social',
      },
    ],
    locale: 'en_LK',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Lifting Social',
    description: 'Discover the story, mission, and community behind Lifting Social.',
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
  jobTitle: [
    'Owner, Lifting Social',
    'Founder & Director, Lifting Social',
    'Software Engineer',
    'National Weightlifter',
  ],
  description:
    'Akila Nishan Jayakody is the owner, founder, and director of Lifting Social. A software engineer, BSc in Computer Science graduate of the University of Colombo, University of Colombo records holder in Olympic weightlifting, and national athlete representing Sri Lanka. He founded and owns Lifting Social (est. 2023).',
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
  owns: {
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: 'Lifting Social',
    url: SITE_URL,
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
  alternateName: 'The Lifting Social',
  url: SITE_URL,
  logo: `${SITE_URL}/lifting-social-logo.svg`,
  foundingDate: '2023',
  founder: {
    '@id': `${ABOUT_URL}#akila-nishan-jayakody`,
  },
  owner: {
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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the owner of Lifting Social?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Akila Nishan Jayakody is the owner of Lifting Social. He founded the brand in 2023 and serves as its director. Akila is a software engineer, a BSc in Computer Science graduate of the University of Colombo, and a national weightlifter representing Sri Lanka.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who founded Lifting Social?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lifting Social was founded in 2023 by Akila Nishan Jayakody, who is also its current owner and director.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is the director of Lifting Social?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Akila Nishan Jayakody is the director of Lifting Social, as well as its founder and owner.',
      },
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  )
}
