'use client';

export default function AnnouncementBar() {
  return (
    <div className="bg-zinc-900 text-white overflow-hidden py-3 relative z-50">
      <div className="flex w-max animate-marquee-ltr whitespace-nowrap">
        {/* First set of items */}
        <div className="flex shrink-0 gap-8 sm:gap-16 mx-4 sm:mx-8">
          {[...Array(8)].map((_, i) => (
            <span key={`1-${i}`} className="font-bold text-sm sm:text-base tracking-widest uppercase flex items-center gap-4 sm:gap-8">
              {i % 2 === 0 ? "LIFTING SOCIAL" : "BEAST MODE MERCH"}
            </span>
          ))}
        </div>

        {/* Second set of items for seamless loop */}
        <div className="flex shrink-0 gap-8 sm:gap-16 mx-4 sm:mx-8">
          {[...Array(8)].map((_, i) => (
            <span key={`2-${i}`} className="font-bold text-sm sm:text-base tracking-widest uppercase flex items-center gap-4 sm:gap-8">
              {i % 2 === 0 ? "LIFTING SOCIAL" : "BEAST MODE MERCH"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
