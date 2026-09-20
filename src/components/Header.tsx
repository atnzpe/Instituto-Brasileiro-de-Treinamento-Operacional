import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useNav } from '../hooks/useContent'

export function Header() {
  const { data: nav } = useNav()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img src="/images/logo.webp" alt="IBTO" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              activeOptions={{ exact: true }}
              className="py-2 font-body text-sm font-medium tracking-wide text-white/70 uppercase transition-colors hover:text-brand-gold-light"
              activeProps={{ className: 'text-brand-gold-light', 'aria-current': 'page' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center md:hidden"
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
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-ink px-4 pb-4 md:hidden">
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
        </nav>
      )}
    </header>
  )
}
