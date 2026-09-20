import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useNav } from '../hooks/useContent'

export function Header() {
  const { data: nav } = useNav()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img src="/images/logo.png" alt="IBTO" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              activeOptions={{ exact: true }}
              className="font-body text-sm font-medium tracking-wide text-muted uppercase transition-colors hover:text-brand-blue"
              activeProps={{ className: 'text-brand-blue' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-6 bg-ink" />
            <span className="h-0.5 w-6 bg-ink" />
            <span className="h-0.5 w-6 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 bg-white px-4 pb-4 md:hidden">
          {nav.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              activeOptions={{ exact: true }}
              className="rounded px-2 py-2 font-body text-sm font-medium tracking-wide text-muted uppercase"
              activeProps={{ className: 'text-brand-blue' }}
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
