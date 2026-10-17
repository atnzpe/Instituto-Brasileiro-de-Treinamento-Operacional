/**
 * GRADE DAS ÁREAS DE ATUAÇÃO: o emblema e o nome de cada área.
 *
 * Cada emblema fica num "medalhão" (16/10/2026, pedido do Gleyson): um círculo
 * um tom acima do fundo (o mesmo dos cartões) com um contorno dourado fino. Os
 * emblemas têm partes escuras e, soltos no preto, se misturavam com o fundo; o
 * medalhão os destaca sem brilho forte. Ao passar o mouse, o contorno fica mais
 * forte. Usada na home e na página /areas-de-atuacao.
 */
import type { ServiceTile } from '../../shared/content'

/**
 * Desenha a grade.
 *
 * @param services As áreas, com a imagem do emblema e o nome. Ex.: [{ title: 'Defesa Pessoal', image: '/...' }]
 * @returns A grade: 1 coluna no celular, 3 no tablet e 5 na tela larga.
 */
export function ServiceGrid({ services }: { services: ServiceTile[] }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
      {services.map((service) => (
        <div key={service.title} className="group flex flex-col items-center gap-4 text-center">
          {/* O medalhão: fundo um tom acima do preto, contorno dourado fino que reforça ao passar o mouse. */}
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-superficie ring-1 ring-brand-gold-light/35 shadow-lg shadow-black/40 transition duration-300 group-hover:ring-2 group-hover:ring-brand-gold-light/80">
            <img src={service.image} alt={service.title} loading="lazy" decoding="async" className="h-24 w-24 object-contain" />
          </div>
          <p className="text-sm font-semibold text-brand-gold-light">{service.title}</p>
        </div>
      ))}
    </div>
  )
}
