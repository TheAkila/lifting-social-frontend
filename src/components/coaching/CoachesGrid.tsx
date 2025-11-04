'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaMedal, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa'

const coaches = [
  {
    id: '1',
    slug: 'pradeep-fernando',
    name: 'Pradeep Fernando',
    title: 'Head Coach & Founder',
    bio: 'Former national champion with 15+ years coaching experience',
    specializations: ['Olympic Lifting', 'Strength & Conditioning', 'Competition Prep'],
    certifications: [
      { name: 'IWF Level 2 Coach', organization: 'International Weightlifting Federation', year: 2015 },
      { name: 'NSCA-CSCS', organization: 'National Strength & Conditioning', year: 2012 },
    ],
    experience: '15 years',
    availability: 'Monday - Saturday',
    contactEmail: 'pradeep@liftingsocial.lk',
    contactPhone: '+94 77 123 4567',
    image: '/images/coaches/pradeep.jpg',
    featured: true,
    championsProduced: 12,
  },
  {
    id: '2',
    slug: 'chamari-silva',
    name: 'Dr. Chamari Silva',
    title: 'Sports Nutrition & Conditioning Coach',
    bio: 'PhD in Sports Science, specializing in athlete nutrition and recovery',
    specializations: ['Sports Nutrition', 'Recovery Programs', 'Female Athletes'],
    certifications: [
      { name: 'PhD Sports Science', organization: 'University of Colombo', year: 2018 },
      { name: 'Precision Nutrition L2', organization: 'Precision Nutrition', year: 2020 },
    ],
    experience: '10 years',
    availability: 'By Appointment',
    contactEmail: 'chamari@liftingsocial.lk',
    contactPhone: '+94 77 234 5678',
    image: '/images/coaches/chamari.jpg',
    featured: true,
    championsProduced: 8,
  },
  {
    id: '3',
    slug: 'roshan-perera',
    name: 'Roshan Perera',
    title: 'Youth Development Coach',
    bio: 'Specializing in beginner and youth athlete development',
    specializations: ['Youth Training', 'Beginner Programs', 'Technique Development'],
    certifications: [
      { name: 'IWF Level 1 Coach', organization: 'International Weightlifting Federation', year: 2019 },
      { name: 'Child Safety in Sport', organization: 'Sri Lanka Sports Ministry', year: 2021 },
    ],
    experience: '7 years',
    availability: 'Weekday Evenings & Weekends',
    contactEmail: 'roshan@liftingsocial.lk',
    contactPhone: '+94 77 345 6789',
    image: '/images/coaches/roshan.jpg',
    featured: false,
    championsProduced: 5,
  },
  {
    id: '4',
    slug: 'nadeesha-gunasekara',
    name: 'Nadeesha Gunasekara',
    title: 'Women\'s Weightlifting Specialist',
    bio: 'Former national team athlete, now coaching female lifters',
    specializations: ['Women\'s Training', 'Competition Strategy', 'Mental Conditioning'],
    certifications: [
      { name: 'IWF Level 2 Coach', organization: 'International Weightlifting Federation', year: 2017 },
      { name: 'Sports Psychology Cert', organization: 'FEPSAC', year: 2019 },
    ],
    experience: '9 years',
    availability: 'Monday - Friday',
    contactEmail: 'nadeesha@liftingsocial.lk',
    contactPhone: '+94 77 456 7890',
    image: '/images/coaches/nadeesha.jpg',
    featured: true,
    championsProduced: 10,
  },
]

export default function CoachesGrid() {
  return (
    <div>
      <div className="text-center mb-12">
        <p className="text-brand-light/70 text-lg">
          All our coaches are certified by the International Weightlifting Federation (IWF) and have proven track records in developing champions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coaches.map((coach, index) => (
          <motion.div
            key={coach.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card relative"
          >
            {coach.featured && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-brand-dark px-3 py-1 rounded-full text-xs font-bold">
                ⭐ FEATURED
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              {/* Coach Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">
                    {coach.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>

              {/* Coach Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-display font-bold mb-1">{coach.name}</h3>
                <p className="text-brand-accent font-semibold mb-2">{coach.title}</p>
                <p className="text-brand-light/70 mb-4">{coach.bio}</p>

                {/* Specializations */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Specializations:</h4>
                  <div className="flex flex-wrap gap-2">
                    {coach.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 bg-brand-secondary/50 rounded-full text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 text-brand-accent">
                      <FaMedal />
                      <span className="text-sm font-semibold">{coach.championsProduced} Champions</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-brand-light/70">
                      <FaCheckCircle />
                      <span className="text-sm">{coach.experience} Experience</span>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Certifications:</h4>
                  <div className="space-y-1">
                    {coach.certifications.map((cert, idx) => (
                      <div key={idx} className="text-xs text-brand-light/60">
                        • {cert.name} ({cert.year})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={`mailto:${coach.contactEmail}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-brand-accent text-brand-dark rounded-lg hover:bg-brand-accent/90 transition-colors text-sm font-semibold"
                  >
                    <FaEnvelope />
                    <span>Email</span>
                  </a>
                  <a
                    href={`tel:${coach.contactPhone}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-brand-secondary rounded-lg hover:bg-brand-secondary/80 transition-colors text-sm font-semibold"
                  >
                    <FaPhone />
                    <span>Call</span>
                  </a>
                  <Link
                    href={`/coaching/${coach.slug}`}
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-colors text-sm font-semibold"
                  >
                    <span>View Profile</span>
                  </Link>
                </div>

                {/* Availability */}
                <div className="mt-4 text-xs text-brand-light/50">
                  Available: {coach.availability}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card mt-12 text-center"
      >
        <h3 className="text-2xl font-display font-bold mb-4">
          Ready to Start Your Journey?
        </h3>
        <p className="text-brand-light/70 mb-6">
          Contact us to schedule a consultation with one of our expert coaches
        </p>
        <Link href="/contact" className="btn-primary inline-block">
          Get Started Today
        </Link>
      </motion.div>
    </div>
  )
}
