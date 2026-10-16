/**
 * GRADE DE FOTOS de um evento ou de um post (#61): cada foto com a descrição
 * (texto alternativo, para o leitor de tela) e o crédito do fotógrafo.
 * Tocar na foto abre a imagem inteira numa nova aba.
 */
import type { Foto } from '../../lib/blog'

/**
 * Desenha a grade.
 *
 * @param fotos As fotos. Ex.: [{ id: 31, url: 'https://...', descricao: 'Turma no estande', credito: 'Divulgação / IBTO' }]
 * @returns A grade (2 colunas no celular, 3 na tela larga), ou nada sem fotos.
 */
export function GradeDeFotos({ fotos }: { fotos: Foto[] }) {
  // Sem fotos: não desenha nada (nem o espaço da grade).
  if (fotos.length === 0) {
    return null
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {fotos.map((foto) => (
        <li key={foto.id}>
          <figure>
            {/* Link para a foto inteira; rel="noopener" impede a nova aba de mexer nesta. */}
            <a href={foto.url} target="_blank" rel="noopener noreferrer" className="block">
              {/* crossOrigin: pede a foto no modo liberado pela plataforma (CORS), para o modo offline guardá-la com segurança. */}
              <img
                crossOrigin="anonymous"
                src={foto.url}
                alt={foto.descricao ?? ''}
                loading="lazy"
                decoding="async"
                width={600}
                height={450}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <span className="sr-only">(abre a foto inteira numa nova aba)</span>
            </a>
            <figcaption className="mt-1 text-xs text-white/60">Foto: {foto.credito}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
