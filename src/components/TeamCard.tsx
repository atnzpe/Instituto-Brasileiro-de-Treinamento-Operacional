import type { TeamMember } from '../../shared/content'

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-8 sm:flex-row">
        <img
          src={member.photo}
          alt={member.name}
          className="h-40 w-32 shrink-0 self-center rounded-xl object-cover sm:self-start"
        />
        <div>
          <h3 className="text-xl">{member.name}</h3>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            {member.role}
          </p>
          <ul className="mt-3 space-y-1 text-sm leading-relaxed text-body">
            {member.bio.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="divide-y divide-black/5 border-t border-black/5">
        {member.sections.map((section) => (
          <details key={section.title} className="group px-8 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-wide text-ink">
              {section.title}
              <span className="text-brand-blue transition-transform group-open:rotate-45">+</span>
            </summary>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-body">
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
