'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Hero() {
  const images = [
    '/images/hero-background.png',
    '/images/hero-background-2.png',
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, images.length])

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* SVG Background Carousel */}
      <div className="relative w-full h-screen">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Lifting Social Hero ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
              quality={100}
              sizes="100vw"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentImageIndex
                ? 'bg-white w-8 h-2 sm:w-10 sm:h-2.5'
                : 'bg-white/50 hover:bg-white/75 w-2 h-2 sm:w-2.5 sm:h-2.5'
            }`}
            aria-label={`Go to background ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
