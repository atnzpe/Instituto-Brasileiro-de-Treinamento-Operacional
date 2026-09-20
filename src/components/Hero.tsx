import type { HomeContent } from '../../shared/content'

export function Hero({ hero }: { hero: HomeContent['hero'] }) {
  return (
    <section className="relative isolate flex min-h-[85vh] items-center overflow-hidden bg-ink">
      <img
        src={hero.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <p className="font-accent text-lg italic tracking-wide text-brand-gold-light sm:text-xl">
          {hero.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
          {hero.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </div>
    </section>
  )
}
