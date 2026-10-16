/**
 * PRÓXIMOS CURSOS na página inicial (16/10/2026): até 3 cursos publicados na
 * plataforma, com data, local e preço, e o botão "Ver todos os cursos".
 *
 * Os cursos vêm da plataforma (a fonte única). Se ela não responder ou não
 * tiver cursos, os cartões somem e fica o botão para o catálogo: a seção
 * nunca fica vazia nem quebrada.
 */
import type { HomeContent } from '../../shared/content'
import { BotaoDeAcao } from './BotaoDeAcao'
import { CursosDaPlataforma } from './CursosDaPlataforma'

/**
 * Desenha a seção.
 *
 * @param secao Os textos e a ação. Ex.: { eyebrow: 'PRÓXIMOS CURSOS', heading: 'Inscrições abertas', ... }
 * @returns A seção com os cartões (quando houver) e o botão para o catálogo.
 */
export function ProximosCursos({ secao }: { secao: HomeContent['proximosCursos'] }) {
  return (
    <section aria-labelledby="t-proximos" className="py-20">
      <div className="mx-auto max-w-6xl px-safe-4 text-center sm:px-safe-6">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand-gold-light">{secao.eyebrow}</p>
        <h2 id="t-proximos" className="mt-3 text-3xl text-white sm:text-4xl">
          {secao.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">{secao.intro}</p>
        {/* No máximo 3 cursos aqui: a lista completa fica no catálogo. */}
        <CursosDaPlataforma limite={3} />
        <div className="mt-10">
          <BotaoDeAcao acao={secao.cta} />
        </div>
      </div>
    </section>
  )
}
