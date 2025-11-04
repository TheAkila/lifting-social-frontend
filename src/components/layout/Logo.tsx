"use client"

import { useState } from 'react'

type Props = {
  className?: string
  size?: number
}

export default function Logo({ className = '', size = 40 }: Props) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {imgOk ? (
        <img
          src="/logo.jpg"
          alt="Lifting Social"
          width={size}
          height={size}
          className="rounded-lg object-contain"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center font-bold text-white text-xl"
        >
          LS
        </div>
      )}

      <span className="font-display font-bold text-xl text-white">
        Lifting Social
      </span>
    </div>
  )
}
