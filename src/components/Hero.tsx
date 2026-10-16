/**
 * TOPO DA PÁGINA INICIAL: a foto, o nome do instituto, para quem é e as duas
 * ações (principal e secundária). É o que o visitante vê antes de rolar a
 * tela, então já diz o que fazer ("Ver cursos" ou "Fale com o IBTO").
 */
import type { HomeContent } from '../../shared/content'
import { BotaoDeAcao } from './BotaoDeAcao'

/**
 * Desenha o topo.
 *
 * @param hero Os textos e as ações. Ex.: { eyebrow: 'Formação real. Resultado operacional.', ... }
 * @returns A seção do topo, com o único h1 da página.
 */
export function Hero({ hero }: { hero: HomeContent['hero'] }) {
  return (
    <section className="relative isolate flex min-h-[85vh] items-center overflow-hidden bg-ink">
      {/* Foto decorativa (alt vazio): o texto por cima já diz tudo. */}
      <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      {/* Escurece a foto para o texto manter o contraste WCAG AA. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      {/* pb-36: espaço extra embaixo, porque os cartões da seção seguinte "sobem" 80 px
          por cima do fim da foto; sem ele, os botões encostariam nos cartões. */}
      <div className="relative mx-auto max-w-4xl px-safe-4 pt-24 pb-36 text-center sm:px-safe-6">
        <p className="font-accent text-lg italic tracking-wide text-brand-gold-light sm:text-xl">{hero.eyebrow}</p>
        <h1 className="mt-4 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
          {hero.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">{hero.subheading}</p>
        {/* Ações: a primeira é a principal (dourada); a segunda, a alternativa (contorno).
            No celular ficam uma embaixo da outra; na tela larga, lado a lado. */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {hero.ctas.map((acao, indice) => (
            <BotaoDeAcao key={acao.label} acao={acao} versao={indice === 0 ? 'principal' : 'secundario'} />
          ))}
        </div>
      </div>
    </section>
  )
}
