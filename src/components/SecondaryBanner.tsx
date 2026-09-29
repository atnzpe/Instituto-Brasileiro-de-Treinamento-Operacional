import type { HomeContent } from '../../shared/content'

export function SecondaryBanner({ banner }: { banner: HomeContent['banner'] }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-24 text-center text-white">
      <img
        src="/images/logo.webp"
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-auto -translate-x-1/2 -translate-y-1/2 opacity-10"
      />
      <div className="relative mx-auto max-w-3xl px-safe-4 sm:px-safe-6">
        <h2 className="text-3xl leading-tight sm:text-4xl">
          {banner.heading.map((line) => (
            <span key={line} className="block text-white">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-6 text-brand-gold-light">{banner.body}</p>
      </div>
    </section>
  )
}
