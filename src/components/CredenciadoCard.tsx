/**
 * CARTÃO DE UM CREDENCIADO na página Rede Nacional (#11): a foto personalizada
 * do monitor ou instrutor, com nome, nível, equipe, estado e áreas.
 *
 * Modelo pedido pelo Mestre Eduardo (o da WKMF), com a cara do IBTO: fundo
 * escuro, moldura dourada e texto objetivo. Sem telefone e sem cidade: o
 * contato passa pela página de Contato do IBTO (regra do Eduardo, 26/09/2026).
 */
import type { CredenciadoDaRede } from '../lib/plataforma'

/**
 * @param pessoa Os dados do cartão, como a plataforma devolve.
 *               Ex.: { nome: 'Ana M. S.', nivel: 'Instrutor II', equipe: 'IBTO PE', uf: 'PE', areas: ['Krav Maga'], foto_url: '...' }
 * @returns O cartão (um <article>).
 */
export function CredenciadoCard({ pessoa }: { pessoa: CredenciadoDaRede }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-brand-gold-light/30 bg-white/5">
      {/* Foto quadrada, do tamanho do cartão; "lazy" = só baixa quando chega perto da tela. */}
      <img
        src={pessoa.foto_url}
        alt={`Foto de ${pessoa.nome}${pessoa.nivel ? `, ${pessoa.nivel}` : ''}`}
        loading="lazy"
        width={400}
        height={400}
        className="aspect-square w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-1 p-4">
        {/* O nível em destaque dourado (é a "patente" do credenciado). */}
        {pessoa.nivel && (
          <p className="text-xs font-semibold tracking-wide text-brand-gold-light uppercase">
            {pessoa.nivel}
          </p>
        )}
        <h3 className="text-lg font-semibold text-white">{pessoa.nome}</h3>
        {/* Equipe e estado numa linha só. Sem equipe: só o estado. */}
        <p className="text-sm text-white/70">
          {pessoa.equipe ? `${pessoa.equipe} · ${pessoa.uf}` : pessoa.uf}
        </p>
        {/* Áreas de atuação em etiquetas pequenas (só se houver). */}
        {pessoa.areas.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1" aria-label="Áreas de atuação">
            {pessoa.areas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-white/80"
              >
                {area}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
