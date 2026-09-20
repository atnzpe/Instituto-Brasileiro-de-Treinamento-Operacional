import type { ServiceTile } from '../../shared/content'

export function ServiceGrid({ services }: { services: ServiceTile[] }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
      {services.map((service) => (
        <div key={service.title} className="flex flex-col items-center gap-4 text-center">
          <img src={service.image} alt={service.title} className="h-28 w-28 object-contain" />
          <p className="text-sm font-semibold text-brand-gold-light">{service.title}</p>
        </div>
      ))}
    </div>
  )
}
