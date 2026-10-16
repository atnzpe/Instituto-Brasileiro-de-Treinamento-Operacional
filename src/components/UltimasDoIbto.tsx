/**
 * BLOCO "ÚLTIMAS DO IBTO" na página inicial (blog #61, blocos B3 e B4;
 * desenho aprovado pelo Gleyson em 14/10/2026): os 3 posts mais recentes do
 * blog, buscados na plataforma de cursos, com a capa, a categoria, a data e o
 * link "Ler mais", que abre o post AQUI no site (/blog/{slug}, desde o B4).
 *
 * Se a plataforma estiver fora do ar, lenta ou sem posts, o bloco SOME: a
 * página inicial nunca quebra por causa dele.
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { buscarUltimosPosts } from '../lib/plataforma'
import { CartaoDoPost } from './blog/CartaoDoPost'

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

        {/* Cartões: 1 coluna no celular, 3 na tela larga. Título h3 (dentro da seção h2). */}
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <CartaoDoPost key={post.slug} post={post} nivelDoTitulo="h3" />
          ))}
        </ul>

        {/* Para quem quer mais: a lista completa do blog e a galeria de eventos, neste site. */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2">
          <Link to="/blog" className="inline-flex min-h-11 items-center font-semibold text-brand-gold-light hover:underline">
            Ver todas as publicações
          </Link>
          <Link to="/eventos" className="inline-flex min-h-11 items-center font-semibold text-brand-gold-light hover:underline">
            Ver as fotos dos eventos
          </Link>
        </div>
      </div>
    </section>
  )
}
