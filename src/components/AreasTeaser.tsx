import { Link } from '@tanstack/react-router'
import type { HomeContent } from '../../shared/content'

export function AreasTeaser({ teaser }: { teaser: HomeContent['areasTeaser'] }) {
  return (
    <section className="bg-brand-ice px-4 py-20 text-center sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl sm:text-4xl">{teaser.heading}</h2>
        <div className="mt-6 space-y-4">
          {teaser.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body">
              {paragraph}
            </p>
          ))}
        </div>
        <Link
          to={teaser.cta.href}
          className="mt-8 inline-block rounded-full bg-brand-blue px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-ink"
        >
          {teaser.cta.label}
        </Link>
      </div>
    </section>
  )
}
