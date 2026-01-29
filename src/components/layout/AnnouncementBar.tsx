'use client';

import Logo from './Logo';

export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-zinc-900 text-white overflow-hidden py-2 z-50">
      <div className="flex w-max animate-marquee-ltr whitespace-nowrap">
        {/* First set of items */}
        <div className="flex shrink-0 gap-8 sm:gap-16 mx-4 sm:mx-8">
          {[...Array(4)].map((_, i) => (
            <div key={`1-${i}`} className="font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-4 sm:gap-8">
              {i % 2 === 0 ? (
                <>
                  <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                    <Logo />
                  </span>
                  <span>LIFTING SOCIAL</span>
                </>
              ) : (
                <span>🏋️ Empowering Sri Lankan Weightlifting 🏋️</span>
              )}
            </div>
          ))}
        </div>

        {/* Second set of items for seamless loop */}
        <div className="flex shrink-0 gap-8 sm:gap-16 mx-4 sm:mx-8">
          {[...Array(4)].map((_, i) => (
            <div key={`2-${i}`} className="font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-4 sm:gap-8">
              {i % 2 === 0 ? (
                <>
                  <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                    <Logo />
                  </span>
                  <span>LIFTING SOCIAL</span>
                </>
              ) : (
                <span>🏋️ Empowering Sri Lankan Weightlifting 🏋️</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
