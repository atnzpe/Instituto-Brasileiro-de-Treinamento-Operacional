/**
 * PÁGINA "NÃO ENCONTRADA" (erro 404): aparece quando o endereço não existe.
 * Fundo escuro como o resto do site (ajuste de 16/10/2026: o <main> agora é
 * escuro, então os textos passaram a ser claros, com contraste WCAG AA).
 */
import { Link } from '@tanstack/react-router'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/**
 * @returns O aviso de página não encontrada, com o botão para o início.
 */
export function NotFound() {
  // Título da aba do navegador.
  useDocumentTitle('Página não encontrada')

  return (
    <div className="mx-auto max-w-2xl px-safe-4 py-24 text-center sm:px-safe-6">
      <p className="font-accent text-lg italic text-brand-gold-light">Erro 404</p>
      <h1 className="mt-4 text-4xl text-white sm:text-5xl">Página não encontrada</h1>
      <p className="mt-4 text-white/75">A página que você procura não existe ou foi movida.</p>
      {/* Botão dourado: no fundo escuro, o botão preto de antes ficaria invisível. */}
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold-light hover:text-ink"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
