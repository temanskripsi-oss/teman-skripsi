export default function QuoteBanner() {
  return (
    <section className="py-16 px-4 bg-[#1E1B4B]">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-[#9eff63] text-6xl font-serif leading-none mb-6 select-none">"</div>
        <blockquote className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-6">
          Education is our passport to the future,{' '}
          <span className="text-[#9eff63] font-bold">
            for tomorrow belongs only to the people who prepare for it today.
          </span>
        </blockquote>
        <cite className="not-italic">
          <p className="text-white font-bold text-sm">Malcolm X</p>
          <p className="text-white/40 text-xs mt-1">Founding Rally of the Organization of Afro-American Unity, 1964</p>
        </cite>
      </div>
    </section>
  )
}
