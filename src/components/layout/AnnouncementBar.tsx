'use client';

export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-700 text-white overflow-hidden py-2 z-50">
      <div className="flex w-max animate-marquee-ltr whitespace-nowrap">
        {/* First set of items */}
        <div className="flex shrink-0 gap-8 sm:gap-16 mx-4 sm:mx-8">
          {[...Array(8)].map((_, i) => (
            <span key={`1-${i}`} className="font-nav font-bold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center gap-4 sm:gap-8">
              {i % 2 === 0 ? "LIFTING SOCIAL" : "Empowering Sri Lankan Weightlifting"}
            </span>
          ))}
        </div>

        {/* Second set of items for seamless loop */}
        <div className="flex shrink-0 gap-8 sm:gap-16 mx-4 sm:mx-8">
          {[...Array(8)].map((_, i) => (
            <span key={`2-${i}`} className="font-nav font-bold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center gap-4 sm:gap-8">
              {i % 2 === 0 ? "LIFTING SOCIAL" : "BEAST MODE MERCH"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
