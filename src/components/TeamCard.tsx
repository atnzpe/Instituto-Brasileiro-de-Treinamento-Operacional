import type { TeamMember } from '../../shared/content'

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex flex-col gap-6 p-8 sm:flex-row">
        <img
          src={member.photo}
          alt={member.name}
          className="h-64 w-52 shrink-0 self-center rounded-xl object-cover sm:h-80 sm:w-64 sm:self-start"
        />
        <div>
          <h3 className="text-xl text-white">{member.name}</h3>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold-light">
            {member.role}
          </p>
          <ul className="mt-3 space-y-1 text-sm leading-relaxed text-white/70">
            {member.bio.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="divide-y divide-white/10 border-t border-white/10">
        {member.sections.map((section) => (
          <details key={section.title} className="group px-8 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-wide text-white">
              {section.title}
              <span className="text-brand-gold-light transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-white/70">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </article>
  )
}
