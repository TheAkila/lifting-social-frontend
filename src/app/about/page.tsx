'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaDumbbell, FaHeart, FaTrophy, FaUsers } from 'react-icons/fa'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <section className="bg-zinc-950 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              About Lifting Social
            </h1>
            <p className="text-lg text-zinc-400">
              More than a brand—we're a movement celebrating Sri Lankan weightlifting culture
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-zinc-900 text-center mb-6">Our Mission</h2>
            <p className="text-lg text-zinc-600 text-center mb-8">
              To elevate Sri Lankan Olympic weightlifting by creating a platform that connects athletes, 
              celebrates achievements, provides quality gear, and inspires the next generation of champions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-brand-secondary/30">
        <div className="container-custom">
          <h2 className="section-title mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaDumbbell,
                title: 'Excellence',
                description: 'Pursuing the highest standards in everything we do',
                color: 'text-brand-primary',
              },
              {
                icon: FaUsers,
                title: 'Community',
                description: 'Building a supportive network of athletes and supporters',
                color: 'text-brand-accent',
              },
              {
                icon: FaTrophy,
                title: 'Achievement',
                description: 'Celebrating every victory, big and small',
                color: 'text-yellow-400',
              },
              {
                icon: FaHeart,
                title: 'Passion',
                description: 'Fueled by love for the sport and our culture',
                color: 'text-brand-primary',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center"
              >
                <value.icon className={`text-5xl ${value.color} mx-auto mb-4`} />
                <h3 className="text-xl font-display font-bold mb-2">{value.title}</h3>
                <p className="text-brand-light/70 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-brand-dark">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-brand-light/80"
          >
            <h2 className="text-3xl font-display font-bold text-center mb-8">Our Story</h2>
            
            <p className="text-lg">
              Lifting Social was born from a simple observation: Sri Lankan weightlifters had incredible 
              talent but lacked a unified platform to showcase their achievements, connect with supporters, 
              and access quality training gear.
            </p>
            
            <p className="text-lg">
              Founded in 2023, we started with a vision to change this. What began as a small online 
              community quickly grew into a comprehensive lifestyle brand that serves athletes, coaches, 
              and fans across the island.
            </p>
            
            <p className="text-lg">
              Today, Lifting Social is proud to be Sri Lanka's premier Olympic weightlifting platform, 
              offering premium apparel, telling inspiring athlete stories, connecting coaches with students, 
              and building a community that celebrates every lift, every achievement, and every dream.
            </p>
            
            <p className="text-lg font-semibold text-brand-accent">
              We're not just selling products—we're building a legacy. Join us in lifting Sri Lankan 
              weightlifting to new heights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-hero">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Ready to Join the Movement?
            </h2>
            <p className="text-xl mb-8">
              Whether you're an athlete, coach, or supporter, there's a place for you in our community
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/shop" className="btn-accent">
                Shop Now
              </Link>
              <Link href="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
