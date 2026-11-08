/**
 * CARTÃO DE UM MEMBRO DA DIRETORIA (página Quem Somos), com SIMETRIA MILITAR
 * (08/11/2026): a foto em cima, no centro; embaixo, o nome, o cargo e a
 * apresentação, tudo no mesmo eixo. As seções que abrem e fecham (formação,
 * cargos...) têm o título no centro, com o sinal "+" dos DOIS lados.
 */
import type { TeamMember } from '../../shared/content'
// Foto inteira, sem cortar o rosto, com o fundo desfocado (#105).
import { FotoInteira } from './FotoInteira'

/**
 * O sinal "+" que gira e vira "x" quando a seção abre. Aparece dos dois lados do
 * título, para o título ficar no centro exato. É só enfeite: aria-hidden.
 *
 * @returns O sinal "+".
 */
function Sinal() {
  return (
    <span aria-hidden="true" className="text-brand-gold-light transition-transform group-open:rotate-45">
      +
    </span>
  )
}

/**
 * @param member A pessoa da diretoria. Ex.: { name: 'Eduardo Lopes', role: 'Presidente', photo: '...', bio: [...], sections: [...] }
 * @returns O cartão com a foto, a apresentação e as seções que abrem e fecham.
 */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {/* Tudo empilhado no eixo central (flex-col + items-center + text-center),
          em qualquer tamanho de tela. */}
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        {/* Foto inteira da pessoa (sem cortar o rosto), na mesma moldura em todos os cartões (#105).
            A caixa de fora guarda o tamanho: 13rem x 16rem no celular, 16rem x 20rem na tela larga. */}
        <div className="h-64 w-52 shrink-0 overflow-hidden rounded-xl sm:h-80 sm:w-64">
          <FotoInteira src={member.photo} alt={member.name} proporcao="h-full" />
        </div>
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
            {/* Título no centro, com o "+" dos dois lados (simetria). */}
            <summary className="flex cursor-pointer list-none items-center justify-center gap-4 text-sm font-semibold uppercase tracking-wide text-white">
              <Sinal />
              {section.title}
              <Sinal />
            </summary>
            <ul className="mt-3 space-y-1.5 text-center text-sm leading-relaxed text-white/70">
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
