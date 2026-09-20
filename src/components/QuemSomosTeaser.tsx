import { Link } from '@tanstack/react-router'
import type { HomeContent } from '../../shared/content'

export function QuemSomosTeaser({
  teaser,
}: {
  teaser: HomeContent['quemSomosTeaser']
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold tracking-[0.2em] text-brand-blue">{teaser.eyebrow}</p>
      <div className="mt-6 space-y-4">
        {teaser.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-body">
            {paragraph}
          </p>
        ))}
      </div>
      <Link
        to="/quem-somos"
        className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-blue"
      >
        Quem somos
      </Link>
    </section>
  )
}
