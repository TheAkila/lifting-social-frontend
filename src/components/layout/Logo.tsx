"use client"

import Image from 'next/image'

type Props = {
  className?: string
}

export default function Logo({ className = '' }: Props) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/lifting-social-logo.svg"
        alt="Lifting Social - Lift. Train. Inspire"
        width={320}
        height={110}
        className="h-16 w-auto"
        priority
      />
    </div>
  )
}
