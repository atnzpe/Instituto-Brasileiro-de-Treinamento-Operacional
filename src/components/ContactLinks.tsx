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
          className="flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white px-10 py-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <img src={link.icon} alt={link.label} className="h-14 w-14 object-contain" />
          <span className="text-sm font-semibold text-ink">{link.label}</span>
        </a>
      ))}
    </div>
  )
}
