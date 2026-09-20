import type { ContatoContent } from '../../shared/content'

export function ContactLinks({ links }: { links: ContatoContent['links'] }) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-8 transition-colors hover:bg-white/10"
        >
          <img src={link.icon} alt={link.label} className="h-16 w-16 object-contain" />
          <span className="text-sm font-semibold text-brand-gold-light">{link.label}</span>
        </a>
      ))}
    </div>
  )
}
