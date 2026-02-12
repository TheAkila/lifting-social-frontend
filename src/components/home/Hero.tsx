'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Full Screen Responsive Image */}
      <Image
        src="/images/hero-background.png"
        alt="Lifting Social - Weightlifters with Barbells"
        fill
        className="object-cover object-center"
        priority
        quality={100}
        sizes="100vw"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </section>
  )
}
