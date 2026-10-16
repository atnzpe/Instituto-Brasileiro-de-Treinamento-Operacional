/**
 * CURSOS DA PLATAFORMA (#52; na página inicial desde 16/10/2026, com limite): a lista dos cursos publicados
 * na plataforma de cursos (presenciais e online; os fechados nunca vêm), em
 * cartões com a modalidade, o tipo, a data, o local, o preço e o link "Ver na
 * plataforma". Assim um curso novo aparece no site SOZINHO, sem mudar o site.
 *
 * Se a plataforma não responder ou não tiver cursos, a lista some e fica só o
 * botão para o catálogo: a página nunca quebra por causa dela.
 */
import { useQuery } from '@tanstack/react-query'
import { buscarCursosDaPlataforma, precoBr } from '../lib/plataforma'

/**
 * Data no formato do Brasil. Ex.: '2026-11-08' → '08/11/2026'.
 *
 * @param data A data no formato ano-mês-dia.
 */
function dataBr(data: string): string {
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

/**
 * @param limite Quantos cursos mostrar no máximo. Ex.: 3 na página inicial; sem limite, todos.
 * @returns A lista de cursos, ou nada (carregando, com erro ou sem cursos).
 */
export function CursosDaPlataforma({ limite }: { limite?: number } = {}) {
  // Guarda a resposta por 5 minutos e NÃO tenta de novo quando falha.
  const { data: cursos } = useQuery({
    queryKey: ['cursos-da-plataforma'],
    queryFn: buscarCursosDaPlataforma,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  // Ainda carregando, deu erro ou sem cursos: não mostra nada.
  if (!cursos || cursos.length === 0) {
    return null
  }

  return (
    // Cartões: 1 coluna no celular, 2 no tablet, 3 na tela larga.
    <ul className="mt-6 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
      {/* slice: corta no limite pedido (sem limite, vão todos). */}
      {cursos.slice(0, limite).map((curso) => (
        <li
          key={curso.url}
          className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink"
        >
          {/* Capa do curso (decorativa: o título vem escrito logo abaixo). */}
          {curso.imagem_url && (
            <img
              src={curso.imagem_url}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-40 w-full object-cover"
            />
          )}
          <div className="flex flex-1 flex-col gap-2 p-5">
            <span className="text-xs text-white/70">
              {[curso.modalidade, curso.area].filter(Boolean).join(' · ')}
            </span>
            <h3 className="text-lg text-white">{curso.titulo}</h3>
            {curso.chamada && <p className="text-sm text-white/85">{curso.chamada}</p>}
            <p className="text-sm text-white/70">
              {[
                curso.data_inicio && dataBr(curso.data_inicio),
                curso.local,
                curso.carga_horaria && `${curso.carga_horaria} h`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {/* Tipo escrito (ex.: "Pago · só filiados") e o preço. */}
            <p className="text-sm font-semibold text-brand-gold-light">
              {curso.tipo} · {precoBr(curso.valor_centavos)}
            </p>
            {/* Link comum: a página do curso fica na plataforma (outro endereço). */}
            <a
              href={curso.url}
              className="mt-auto inline-flex min-h-11 items-center font-semibold text-brand-gold-light hover:underline"
            >
              Ver na plataforma
              <span className="sr-only">: {curso.titulo}</span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
