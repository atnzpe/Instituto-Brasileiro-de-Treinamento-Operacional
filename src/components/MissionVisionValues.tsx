import type { QuemSomosContent } from '../../shared/content'

export function MissionVisionValues({
  mvv,
}: {
  mvv: QuemSomosContent['missaoVisaoValores']
}) {
  return (
    <section className="grid gap-6 sm:grid-cols-3">
      <div className="rounded-2xl bg-brand-ice p-8">
        <h3 className="text-lg">Missão</h3>
        <p className="mt-3 text-sm leading-relaxed text-body">{mvv.missao}</p>
      </div>
      <div className="rounded-2xl bg-brand-ice p-8">
        <h3 className="text-lg">Visão</h3>
        <p className="mt-3 text-sm leading-relaxed text-body">{mvv.visao}</p>
      </div>
      <div className="rounded-2xl bg-ink p-8 text-white">
        <h3 className="text-lg text-white">Valores</h3>
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-brand-blue-light">
          {mvv.valores.map((valor) => (
            <li key={valor}>{valor}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
