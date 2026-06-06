export default function QuoteBanner() {
  return (
    <section className="py-16 px-4 bg-[#1E1B4B]">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-[#9eff63] text-6xl font-serif leading-none mb-6 select-none">"</div>
        <blockquote className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-6">
          "Pendidikan adalah senjata paling ampuh yang{' '}
          <span className="text-[#9eff63] font-bold">
            bisa kamu gunakan untuk mengubah dunia."
          </span>
        </blockquote>
        <cite className="not-italic">
          <p className="text-white font-bold text-sm">Nelson Mandela</p>
          <p className="text-white/40 text-xs mt-1">Madison Park High School, Boston, 1990</p>
        </cite>
      </div>
    </section>
  )
}
