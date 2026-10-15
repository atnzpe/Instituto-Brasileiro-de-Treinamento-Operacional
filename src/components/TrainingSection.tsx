/**
 * SEÇÃO "TREINAMENTOS E CAPACITAÇÕES" da página inicial: três cartões com foto
 * e o botão "Conheça os cursos e treinamentos".
 *
 * Os cartões e o botão levam ao CATÁLOGO DA PLATAFORMA de cursos (outro
 * endereço, do mesmo ambiente: testes ou oficial), porque os cursos agora são
 * cadastrados lá (#52, #48).
 */
import { Link } from '@tanstack/react-router'
import type { HomeContent } from '../../shared/content'
import { linkDaPlataforma } from '../lib/plataforma'
import { ArrowRightIcon } from './Icon'

/**
 * Desenha a seção de treinamentos.
 *
 * @param training Os textos e cartões da seção, vindos de shared/content.ts.
 *                 Ex.: { eyebrow: 'TREINAMENTOS E CAPACITAÇÕES', cards: [...] }
 * @returns A seção pronta para a página inicial.
 */
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
          {training.cards.map((card) => {
            const content = (
              <>
                {card.image && (
                  <img
                    src={card.image.src}
                    alt={card.image.alt}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={533}
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                )}
                {/* Darkens the lower part of the photo so the text keeps WCAG AA contrast. */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg text-white">{card.title}</h3>
                  {card.href && (
                    <ArrowRightIcon className="mt-1 h-5 w-5 shrink-0 text-brand-gold-light" />
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{card.description}</p>
              </>
            )
            const cardClassName =
              'group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-6'

            // Cartão que aponta para a plataforma: link comum (<a>), porque é
            // outro endereço; o roteador do site só abre páginas deste site.
            if (card.href && card.naPlataforma) {
              return (
                <a
                  key={card.title}
                  href={linkDaPlataforma(card.href)}
                  className={`${cardClassName} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold-light`}
                >
                  {content}
                </a>
              )
            }

            // Cartão com página deste site: link do roteador (abre sem recarregar).
            // Sem link nenhum: só o cartão, sem clique.
            return card.href ? (
              <Link
                key={card.title}
                to={card.href}
                className={`${cardClassName} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold-light`}
              >
                {content}
              </Link>
            ) : (
              <div key={card.title} className={cardClassName}>
                {content}
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          {/* Catálogo da plataforma do mesmo ambiente. Ex.: no site de testes,
              https://cursos-homolog.ib-to.org/cursos. Link comum: é outro endereço. */}
          <a
            href={linkDaPlataforma('/cursos')}
            className="inline-block rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold-light hover:text-ink"
          >
            Conheça os cursos e treinamentos
          </a>
        </div>
      </div>
    </section>
  )
}
