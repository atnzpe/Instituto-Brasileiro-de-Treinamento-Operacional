import type { Representative } from '../../shared/content'

export function RepresentativeCard({ person }: { person: Representative }) {
  return (
    <article className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      {person.photo && (
        <img
          src={person.photo}
          alt={person.name}
          className="h-24 w-24 rounded-full object-cover"
        />
      )}
      <div>
        <p className="font-semibold text-white">{person.name}</p>
        <p className="text-sm text-brand-gold-light">{person.role}</p>
        <p className="mt-1 text-sm text-white/70">
          {person.city}, {person.state}
        </p>
        {person.phone && <p className="mt-1 text-sm text-white/70">{person.phone}</p>}
        {person.instrutorResponsavel && (
          <p className="mt-1 text-xs text-white/50">
            Instrutor responsável: {person.instrutorResponsavel}
          </p>
        )}
      </div>
    </article>
  )
}
