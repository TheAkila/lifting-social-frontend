export default function CoachingHeader() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100 pt-24 pb-12 sm:pt-32 sm:pb-16">
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.32em] sm:tracking-[0.4em] text-zinc-400">
          Lifting Social Coaching
        </p>
        <h1 className="mt-3 sm:mt-4 font-display text-[32px] sm:text-4xl lg:text-5xl leading-[1.05] font-bold tracking-tight text-zinc-900">
          Train With The Best
        </h1>
        <p className="mt-3 mx-auto max-w-xl text-zinc-500 text-sm sm:text-base leading-relaxed">
          Certified Olympic weightlifting coaches who&apos;ve produced national champions —
          ready to take your lifting to the next level.
        </p>
      </div>
    </section>
  )
}
