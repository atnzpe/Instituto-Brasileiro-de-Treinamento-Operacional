import { Link } from '@tanstack/react-router'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFound() {
  useDocumentTitle('Página não encontrada')

  return (
    <div className="mx-auto max-w-2xl px-safe-4 py-24 text-center sm:px-safe-6">
      <p className="font-accent text-lg italic text-brand-gold">Erro 404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">Página não encontrada</h1>
      <p className="mt-4 text-body">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
