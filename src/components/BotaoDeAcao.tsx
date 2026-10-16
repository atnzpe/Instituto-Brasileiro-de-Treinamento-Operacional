/**
 * BOTÃO DE AÇÃO do site (ex.: "Ver cursos", "Fale com o IBTO").
 *
 * Um só desenho para todos os botões de ação, em duas versões:
 * - principal: dourado e cheio (a ação que mais importa na seção);
 * - secundario: só com contorno (a alternativa).
 * Sabe levar a uma página deste site (link do roteador, sem recarregar) ou à
 * plataforma de cursos (link comum, porque é outro endereço).
 * Altura mínima de 44 px: alvo de toque confortável no celular.
 */
import { Link } from '@tanstack/react-router'
import type { ChamadaParaAcao } from '../../shared/content'
import { linkDaPlataforma } from '../lib/plataforma'

// Forma comum (tamanho, texto, foco visível) e as cores de cada versão.
const BASE =
  'inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold-light'
const VERSOES = {
  principal: 'bg-brand-gold text-white hover:bg-brand-gold-light hover:text-ink',
  secundario: 'border border-white/40 text-white hover:border-brand-gold-light hover:text-brand-gold-light',
} as const

/**
 * Desenha o botão.
 *
 * @param acao O texto e o destino. Ex.: { label: 'Ver cursos', href: '/cursos', naPlataforma: true }
 * @param versao 'principal' (padrão) ou 'secundario'.
 * @returns Um link com cara de botão.
 */
export function BotaoDeAcao({
  acao,
  versao = 'principal',
}: {
  acao: ChamadaParaAcao
  versao?: keyof typeof VERSOES
}) {
  const classe = `${BASE} ${VERSOES[versao]}`

  // Destino na plataforma (outro endereço): link comum para a plataforma do mesmo ambiente.
  if (acao.naPlataforma) {
    return (
      <a href={linkDaPlataforma(acao.href)} className={classe}>
        {acao.label}
      </a>
    )
  }

  // Página deste site: link do roteador (abre sem recarregar a página).
  return (
    <Link to={acao.href} className={classe}>
      {acao.label}
    </Link>
  )
}
