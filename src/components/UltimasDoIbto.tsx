/**
 * BLOCO "ÚLTIMAS DO IBTO" na página inicial (blog #61, bloco B3; desenho
 * aprovado pelo Gleyson em 14/10/2026): os 3 posts mais recentes do blog,
 * buscados na plataforma de cursos, com a capa, a categoria, a data e o link
 * "Ler mais" (que abre o post na plataforma).
 *
 * Se a plataforma estiver fora do ar, lenta ou sem posts, o bloco SOME: a
 * página inicial nunca quebra por causa dele.
 */
import { useQuery } from '@tanstack/react-query'
import { buscarUltimosPosts } from '../lib/plataforma'

/**
 * Data no formato do Brasil. Ex.: '2026-10-15' → '15/10/2026'.
 *
 * @param data A data no formato ano-mês-dia.
 */
function dataBr(data: string): string {
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

/**
 * @returns O bloco com os posts, ou nada (carregando, com erro ou sem posts).
 */
export function UltimasDoIbto() {
  // useQuery guarda a resposta por 5 minutos (staleTime) e NÃO tenta de novo
  // quando falha (retry: false): se a plataforma estiver fora, o bloco some.
  const { data: posts } = useQuery({
    queryKey: ['ultimos-posts'],
    queryFn: () => buscarUltimosPosts(3),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  // Ainda carregando, deu erro ou não há posts: não mostra nada.
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="t-ultimas" className="py-16">
      <div className="mx-auto max-w-6xl px-safe-4 sm:px-safe-6">
        <h2
          id="t-ultimas"
          className="text-center text-sm font-semibold tracking-[0.2em] text-brand-gold-light"
        >
          ÚLTIMAS DO IBTO
        </h2>

        {/* Cartões: 1 coluna no celular, 3 na tela larga. */}
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <li
              key={post.url}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              {/* Capa com a descrição para o leitor de tela (sem capa: só o texto). */}
              {post.capa_url && (
                <img
                  src={post.capa_url}
                  alt={post.capa_descricao ?? ''}
                  loading="lazy"
                  decoding="async"
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-xs text-white/70">
                  {post.categoria}
                  {post.data && ` · ${dataBr(post.data)}`}
                </span>
                <h3 className="text-lg text-white">{post.titulo}</h3>
                {post.resumo && <p className="text-sm text-white/85">{post.resumo}</p>}
                {/* Link comum: o post fica na plataforma (outro endereço). */}
                <a
                  href={post.url}
                  className="mt-auto inline-flex min-h-11 items-center font-semibold text-brand-gold-light hover:underline"
                >
                  Ler mais
                  <span className="sr-only">: {post.titulo}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
