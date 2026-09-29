import { Link } from '@tanstack/react-router'
import type { HomeContent } from '../../shared/content'

export function TrainingSection({ training }: { training: HomeContent['training'] }) {
  return (
    <section className="relative isolate overflow-hidden py-20">
      <img
        src="/images/hero.webp"
        alt=""
        className="pointer-events-none absolute right-0 top-1/2 hidden h-[44rem] w-auto -translate-y-1/2 translate-x-1/3 opacity-[0.07] sm:block"
      />
      <div className="relative mx-auto max-w-6xl px-safe-4 sm:px-safe-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-brand-gold-light">
            {training.eyebrow}
          </p>
          <p className="mt-4 text-white/70">{training.intro}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {training.cards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-lg text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/cursos"
            className="inline-block rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold-light hover:text-ink"
          >
            Conheça os cursos e treinamentos
          </Link>
        </div>
      </div>
    </section>
  )
}
