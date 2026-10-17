/**
 * LINKS DE CONTATO (WhatsApp, Facebook, Instagram) da página de contato.
 *
 * Mesmo estilo dos emblemas das áreas de atuação (17/10/2026, pedido do Gleyson:
 * "ícones circulares"): cada ícone num medalhão. O arquivo do ícone é quadrado,
 * com fundo preto; ele preenche o círculo (que recorta esse fundo) e ganha um
 * contorno dourado fino, com um respiro. O link inteiro é a área de toque; ao
 * passar o mouse ou focar pelo teclado, o contorno fica mais forte.
 */
import type { ContatoContent } from '../../shared/content'

/**
 * Desenha os links.
 *
 * @param links Os contatos, com o nome, o endereço e o ícone. Ex.: [{ label: 'WhatsApp', href: 'https://wa.me/...', icon: '/images/social/whatsapp.webp' }]
 * @returns Os medalhões lado a lado (quebram linha no celular).
 */
export function ContactLinks({ links }: { links: ContatoContent['links'] }) {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="group flex min-w-28 flex-col items-center gap-4 rounded-2xl p-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold-light"
        >
          {/* O medalhão: o ícone preenche o círculo; contorno dourado fino que reforça no mouse e no foco. */}
          <span className="block size-28 overflow-hidden rounded-full bg-black ring-1 ring-brand-gold-light/45 ring-offset-4 ring-offset-ink shadow-lg shadow-black/40 transition duration-300 group-hover:ring-2 group-hover:ring-brand-gold-light/90 group-focus-visible:ring-2 group-focus-visible:ring-brand-gold-light/90">
            {/* alt vazio: o nome já está escrito logo abaixo (o leitor de tela não repete). */}
            <img src={link.icon} alt="" className="size-full object-cover brightness-[1.15] contrast-[1.05]" />
          </span>
          <span className="text-sm font-semibold text-brand-gold-light">{link.label}</span>
        </a>
      ))}
    </div>
  )
}
