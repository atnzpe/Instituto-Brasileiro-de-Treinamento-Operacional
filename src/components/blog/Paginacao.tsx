/**
 * PAGINAÇÃO das listas do blog e dos eventos (#61): "Anterior", "Página X de Y"
 * e "Próxima". Some quando só existe uma página.
 */
import type { ReactNode } from 'react'
import type { Pagina } from '../../lib/blog'

/**
 * Desenha a paginação.
 *
 * @param pagina Em que página estamos e quantas existem. Ex.: { atual: 2, ultima: 5, total: 50 }
 * @param link Função que desenha o link para outra página (cada lista monta o seu,
 *             mantendo os filtros). Ex.: (numero, conteudo) => <Link ...>{conteudo}</Link>
 * @returns A navegação entre páginas, ou nada se só há uma página.
 */
export function Paginacao({
  pagina,
  link,
}: {
  pagina: Pagina
  link: (numero: number, conteudo: ReactNode) => ReactNode
}) {
  // Uma página só: não há para onde ir.
  if (pagina.ultima <= 1) {
    return null
  }

  return (
    <nav aria-label="Páginas" className="mt-10 flex items-center justify-center gap-4 text-sm">
      {/* "Anterior" só existe depois da primeira página. */}
      {pagina.atual > 1 ? link(pagina.atual - 1, '← Anterior') : <span aria-hidden="true" />}
      <span className="text-white/70">
        Página {pagina.atual} de {pagina.ultima}
      </span>
      {/* "Próxima" só existe antes da última página. */}
      {pagina.atual < pagina.ultima ? link(pagina.atual + 1, 'Próxima →') : <span aria-hidden="true" />}
    </nav>
  )
}
