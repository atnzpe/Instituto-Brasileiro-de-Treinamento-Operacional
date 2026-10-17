/**
 * GRADE DAS ÁREAS DE ATUAÇÃO: o emblema e o nome de cada área.
 *
 * Cada emblema fica num "medalhão" (16/10/2026, pedido do Gleyson): o emblema
 * preenche um círculo (o arquivo é quadrado, com fundo preto; o círculo recorta
 * esse fundo) e ganha um contorno dourado fino, com um respiro entre os dois. Ao
 * passar o mouse, o contorno fica mais forte. Usada na home e em /areas-de-atuacao.
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
          {/* O medalhão: o emblema PREENCHE o círculo (o arquivo é quadrado com fundo preto; o círculo
              recorta esse fundo) e o contorno dourado fino fica colado nele, mais forte ao passar o mouse. */}
          <div className="size-32 overflow-hidden rounded-full bg-black ring-1 ring-brand-gold-light/45 ring-offset-4 ring-offset-ink shadow-lg shadow-black/40 transition duration-300 group-hover:ring-2 group-hover:ring-brand-gold-light/90">
            <img src={service.image} alt={service.title} loading="lazy" decoding="async" className="size-full object-cover brightness-[1.15] contrast-[1.05]" />
          </div>
          <p className="text-sm font-semibold text-brand-gold-light">{service.title}</p>
        </div>
      ))}
    </div>
  )
}
