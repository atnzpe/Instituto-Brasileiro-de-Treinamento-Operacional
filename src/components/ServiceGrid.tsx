import type { ServiceTile } from '../../shared/content'

export function ServiceGrid({ services }: { services: ServiceTile[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {services.map((service) => (
        <div
          key={service.title}
          className="flex flex-col items-center gap-4 rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
        >
          <img src={service.image} alt="" className="h-20 w-20 object-contain" />
          <p className="text-sm font-semibold text-ink">{service.title}</p>
        </div>
      ))}
    </div>
  )
}
