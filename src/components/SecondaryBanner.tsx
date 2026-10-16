/**
 * CONVITE FINAL da página inicial: o título forte, a frase de para quem é e
 * as mesmas ações do topo. Quem rolou a página inteira está pronto para agir,
 * então a ação principal aparece de novo aqui, sem precisar voltar ao topo.
 */
import type { HomeContent } from '../../shared/content'
import { BotaoDeAcao } from './BotaoDeAcao'

/**
 * Desenha o convite.
 *
 * @param banner Os textos e as ações. Ex.: { heading: ['FORMAÇÃO OPERACIONAL', 'DE ALTO NÍVEL'], ... }
 * @returns A seção escura com o emblema ao fundo e os botões.
 */
export function SecondaryBanner({ banner }: { banner: HomeContent['banner'] }) {
  return (
    <section aria-labelledby="t-convite" className="relative isolate overflow-hidden bg-ink py-24 text-center text-white">
      {/* Emblema decorativo ao fundo (alt vazio), bem apagado para não competir com o texto. */}
      <img
        src="/images/logo.webp"
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-auto -translate-x-1/2 -translate-y-1/2 opacity-10"
      />
      <div className="relative mx-auto max-w-3xl px-safe-4 sm:px-safe-6">
        <h2 id="t-convite" className="text-3xl leading-tight sm:text-4xl">
          {banner.heading.map((line) => (
            <span key={line} className="block text-white">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-6 text-brand-gold-light">{banner.body}</p>
        {/* As mesmas ações do topo: principal (dourada) e alternativa (contorno). */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {banner.ctas.map((acao, indice) => (
            <BotaoDeAcao key={acao.label} acao={acao} versao={indice === 0 ? 'principal' : 'secundario'} />
          ))}
        </div>
      </div>
    </section>
  )
}
