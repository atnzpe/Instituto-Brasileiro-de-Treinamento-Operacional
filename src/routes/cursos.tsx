/**
 * ENDEREÇO ANTIGO /cursos DO SITE.
 *
 * A lista de cursos deste site foi aposentada: os cursos agora são cadastrados
 * só na plataforma de cursos (#52), e manter duas listas faria uma delas ficar
 * desatualizada (as datas escritas à mão já tinham vencido).
 *
 * O endereço continua existindo para quem tem o link salvo ou compartilhado:
 * ele leva sozinho ao catálogo da plataforma do mesmo ambiente (site de testes
 * → cursos-homolog.ib-to.org/cursos; site oficial → cursos.ib-to.org/cursos).
 */
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { linkDaPlataforma } from '../lib/plataforma'

export const Route = createFileRoute('/cursos')({
  head: () => ({
    meta: [
      { title: 'Cursos | Instituto Brasileiro de Treinamento Operacional' },
      // "noindex": o Google não guarda esta página, porque ela só redireciona.
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: CursosRedireciona,
})

/**
 * Leva a pessoa ao catálogo da plataforma assim que a página abre.
 *
 * @returns Um aviso curto com o link, para o caso de o navegador demorar ou
 *          não redirecionar sozinho.
 */
function CursosRedireciona() {
  // O endereço do catálogo no ambiente atual. Ex.: 'https://cursos-homolog.ib-to.org/cursos'
  const catalogo = linkDaPlataforma('/cursos')

  // Ao abrir a página: troca o endereço pelo do catálogo. "replace" (e não um
  // clique comum) para o botão Voltar não cair de novo aqui, num vaivém sem fim.
  useEffect(() => {
    window.location.replace(catalogo)
  }, [catalogo])

  return (
    <div className="bg-ink px-safe-4 py-16 text-center sm:px-safe-6">
      <h1 className="text-3xl text-white">Abrindo o catálogo de cursos…</h1>
      {/* Plano B: se nada acontecer em alguns segundos, a pessoa clica. */}
      <p className="mt-4 text-white/70">
        Se a página não abrir sozinha,{' '}
        <a href={catalogo} className="text-brand-gold-light underline">
          clique aqui para ver os cursos
        </a>
        .
      </p>
    </div>
  )
}
