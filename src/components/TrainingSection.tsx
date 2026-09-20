import type { HomeContent } from '../../shared/content'

export function TrainingSection({ training }: { training: HomeContent['training'] }) {
  return (
    <section className="bg-brand-ice py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-brand-blue">
            {training.eyebrow}
          </p>
          <p className="mt-4 text-body">{training.intro}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {training.cards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-lg">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-body">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
