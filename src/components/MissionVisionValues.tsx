import type { QuemSomosContent } from '../../shared/content'
import { CheckIcon } from './Icon'

export function MissionVisionValues({
  mvv,
}: {
  mvv: QuemSomosContent['missaoVisaoValores']
}) {
  return (
    // Três cartões (Missão, Visão, Valores) em colunas iguais, no eixo central.
    <section className="grade-simetrica [--col-sm:3]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h3 className="text-lg text-white">Missão</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{mvv.missao}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h3 className="text-lg text-white">Visão</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{mvv.visao}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h3 className="text-lg text-white">Valores</h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-gold-light">
          {mvv.valores.map((valor) => (
            // justify-center: o ícone e o valor juntos, no centro do cartão.
            <li key={valor} className="flex items-center justify-center gap-2">
              <CheckIcon className="h-4 w-4 shrink-0 text-brand-gold-light" />
              {valor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
