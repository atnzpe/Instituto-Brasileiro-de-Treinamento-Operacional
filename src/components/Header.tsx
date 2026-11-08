import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useNav } from '../hooks/useContent'
import { linkDaPlataforma } from '../lib/plataforma'
import { MenuIdiomas } from './MenuIdiomas'

/*
 * CABEÇALHO do site: o logo, o menu e o botão "Entrar / Área do aluno" (#48,
 * decisão do Gleyson em 14/10/2026), que leva à tela de entrar da plataforma
 * de cursos do mesmo ambiente (testes ou oficial). No celular, o menu abre
 * pelo botão de três tracinhos e o botão fica no fim da lista.
 * O menu de idiomas (#54: português, inglês e espanhol pelo Google Tradutor)
 * fica ao lado do botão no computador e no fim do menu no celular.
 *
 * Ajuste de 24/10/2026 (o Gleyson achou "feio"): o menu completo só aparece a
 * partir de 1280 px (xl), onde os 6 itens, o idioma e o botão cabem numa linha
 * só. Abaixo disso (tablet e notebook pequeno), vale o menu de três tracinhos,
 * como no celular. Antes ele aparecia já em 768 px e os itens quebravam em duas
 * linhas, encostando no logo. O logo ganhou fundo transparente (era preto).
 */

export function Header() {
  const { data: nav } = useNav()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 pt-safe backdrop-blur">
      {/* SIMETRIA MILITAR (08/11/2026): três colunas, as das pontas com a MESMA largura
          (1fr cada) e a do meio só do tamanho do conteúdo (auto). Assim o que fica no
          meio cai no EIXO CENTRAL exato da tela.
          - Celular e tablet: [espaço vazio] [logo] [botão do menu].
          - Computador (xl, 1280 px ou mais): [logo] [links + idiomas] [Entrar].
          max-w-[90rem]: largura para os links caberem no meio sem apertar as pontas;
          gap-4: o vão entre as três colunas. */}
      <div className="mx-auto grid max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-safe-4 py-3 sm:px-safe-6">
        {/* COLUNA DA ESQUERDA. No computador: o logo, encostado à esquerda. No celular:
            um espaço vazio do MESMO tamanho do botão do menu (44 px), que espelha o botão
            da direita e deixa o logo no centro. aria-hidden: o leitor de tela pula. */}
        <Link to="/" className="hidden shrink-0 justify-self-start xl:block" onClick={() => setOpen(false)}>
          <img src="/images/logo.webp" alt="IBTO" className="h-12 w-auto" />
        </Link>
        <span aria-hidden="true" className="h-11 w-11 xl:hidden" />

        {/* COLUNA DO MEIO. No computador: os links e os idiomas. No celular: o logo. */}
        <nav className="hidden items-center gap-5 xl:flex">
          {nav.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              activeOptions={{ exact: true }}
              className="py-2 font-body text-sm font-medium tracking-wide whitespace-nowrap text-white/70 uppercase transition-colors hover:text-brand-gold-light"
              activeProps={{ className: 'text-brand-gold-light', 'aria-current': 'page' }}
            >
              {link.label}
            </Link>
          ))}
          {/* Idiomas (#54): a mesma página traduzida pelo Google. */}
          <MenuIdiomas />
        </nav>
        <Link to="/" className="shrink-0 xl:hidden" onClick={() => setOpen(false)}>
          <img src="/images/logo.webp" alt="IBTO" className="h-12 w-auto" />
        </Link>

        {/* COLUNA DA DIREITA. No computador: o botão Entrar, encostado à direita.
            No celular: o botão que abre e fecha o menu. */}
        {/* Entrar / Área do aluno: abre a plataforma de cursos (link comum: é outro endereço). */}
        <a
          href={linkDaPlataforma('/login')}
          className="hidden min-h-11 items-center justify-self-end rounded-full bg-brand-gold px-5 font-body text-sm font-semibold tracking-wide whitespace-nowrap text-white uppercase transition-colors hover:bg-brand-gold-light hover:text-ink xl:inline-flex"
        >
          Entrar / Área do aluno
        </a>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center justify-self-end xl:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
          </div>
        </button>
      </div>

      {open && (
        // Menu do celular: tudo no eixo central (items-center + text-center).
        <nav className="flex flex-col items-center gap-1 border-t border-white/10 bg-ink px-safe-4 pb-4 text-center xl:hidden">
          {nav.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              activeOptions={{ exact: true }}
              className="rounded px-2 py-3 font-body text-sm font-medium tracking-wide text-white/70 uppercase"
              activeProps={{ className: 'text-brand-gold-light', 'aria-current': 'page' }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {/* Idiomas (#54) no celular: a lista abre dentro do menu. */}
          <MenuIdiomas noCelular />
          {/* No celular, o botão da plataforma fica no fim do menu. */}
          <a
            href={linkDaPlataforma('/login')}
            className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 font-body text-sm font-semibold tracking-wide text-white uppercase"
          >
            Entrar / Área do aluno
          </a>
        </nav>
      )}
    </header>
  )
}
