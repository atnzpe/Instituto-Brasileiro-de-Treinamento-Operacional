/**
 * QUEM SOMOS na página inicial: um título, um parágrafo e o link para a
 * página completa. Antes eram três parágrafos que repetiam o resto da
 * página; o texto completo continua em /quem-somos.
 */
import type { HomeContent } from '../../shared/content'
import { BotaoDeAcao } from './BotaoDeAcao'

/**
 * Desenha a seção.
 *
 * @param teaser Os textos e a ação. Ex.: { eyebrow: 'QUEM SOMOS', heading: '...', paragraph: '...', cta: {...} }
 * @returns A seção centralizada com o botão "Conheça o IBTO".
 */
export function QuemSomosTeaser({ teaser }: { teaser: HomeContent['quemSomosTeaser'] }) {
  return (
    <section aria-labelledby="t-quem-somos" className="mx-auto max-w-3xl px-safe-4 py-20 text-center sm:px-safe-6">
      <p className="text-sm font-semibold tracking-[0.2em] text-brand-gold-light">{teaser.eyebrow}</p>
      <h2 id="t-quem-somos" className="mt-3 text-3xl text-white sm:text-4xl">
        {teaser.heading}
      </h2>
      <p className="mt-6 text-white/70">{teaser.paragraph}</p>
      <div className="mt-8">
        <BotaoDeAcao acao={teaser.cta} versao="secundario" />
      </div>
    </section>
  )
}
