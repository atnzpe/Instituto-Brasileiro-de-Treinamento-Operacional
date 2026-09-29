import { Link } from '@tanstack/react-router'
import type { HomeContent } from '../../shared/content'

export function AreasTeaser({ teaser }: { teaser: HomeContent['areasTeaser'] }) {
  return (
    <section className="px-safe-4 py-20 text-center sm:px-safe-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl text-white sm:text-4xl">{teaser.heading}</h2>
        <div className="mt-6 space-y-4">
          {teaser.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-white/70">
              {paragraph}
            </p>
          ))}
        </div>
        <Link
          to={teaser.cta.href}
          className="mt-8 inline-block rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold-light hover:text-ink"
        >
          {teaser.cta.label}
        </Link>
      </div>
    </section>
  )
}
