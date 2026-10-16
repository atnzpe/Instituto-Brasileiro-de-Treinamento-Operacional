/**
 * PÁGINA /blog DO SITE (#61, bloco B4): as notícias e os eventos do IBTO,
 * os mais novos primeiro, com filtro por categoria e paginação.
 *
 * O filtro e a página ficam no endereço (ex.: /blog?categoria=evento&pagina=2),
 * para a pessoa poder compartilhar o link e o botão Voltar funcionar.
 * Os posts vêm da plataforma (cadastrados no Comando Geral).
 */
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AvisoDeEstado } from '../components/blog/AvisoDeEstado'
import { CartaoDoPost } from '../components/blog/CartaoDoPost'
import { Paginacao } from '../components/blog/Paginacao'
import { type BuscaDoBlog, buscaLimpa, buscarPosts, CATEGORIAS, ESTILO_DO_LINK_DE_PAGINA } from '../lib/blog'

// O título da aba do navegador e dos compartilhamentos.
const TITULO = 'Blog | Instituto Brasileiro de Treinamento Operacional'
// A descrição que o Google e as redes sociais mostram.
const DESCRICAO = 'Notícias, eventos e conteúdos do Instituto Brasileiro de Treinamento Operacional.'

export const Route = createFileRoute('/blog/')({
  // validateSearch: lê e LIMPA o que veio no endereço. Valor estranho
  // (ex.: ?pagina=abc ou ?categoria=xyz) vira o padrão, sem erro na tela.
  // Os dois são OPCIONAIS: o padrão (todas, página 1) nem aparece no endereço,
  // e um link simples para "/blog" (ex.: o do menu) funciona sem parâmetros.
  validateSearch: (busca: Record<string, unknown>): BuscaDoBlog => buscaLimpa(busca),
  head: () => ({
    meta: [
      { title: TITULO },
      { name: 'description', content: DESCRICAO },
      { property: 'og:title', content: TITULO },
      { property: 'og:description', content: DESCRICAO },
      { property: 'og:url', content: 'https://ib-to.org/blog' },
    ],
  }),
  component: PaginaDoBlog,
})

/**
 * A página do blog.
 *
 * @returns O título, os filtros, os cartões e a paginação.
 */
function PaginaDoBlog() {
  // O filtro e a página já validados (validateSearch acima); ausentes = padrão.
  const busca = Route.useSearch()
  const categoria = busca.categoria ?? ''
  const pagina = busca.pagina ?? 1

  // useQuery busca e guarda a resposta; a chave muda com o filtro e a página,
  // então cada combinação tem a sua resposta guardada por 5 minutos.
  const consulta = useQuery({
    queryKey: ['blog', categoria, pagina],
    queryFn: () => buscarPosts(pagina, categoria),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="bg-ink px-safe-4 py-16 sm:px-safe-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl text-white sm:text-5xl">Blog</h1>
          <p className="mt-4 text-brand-gold-light">Notícias e eventos do IBTO</p>
        </div>

        {/* Filtro por categoria: links (e não botões) para o endereço mudar junto. */}
        <nav aria-label="Filtrar por categoria" className="mt-8 flex flex-wrap justify-center gap-3">
          {CATEGORIAS.map((opcao) => {
            // A opção escolhida ganha destaque e o aviso "aria-current" para o leitor de tela.
            const escolhida = opcao.valor === categoria
            return (
              <Link
                key={opcao.rotulo}
                to="/blog"
                // Trocar de filtro volta para a página 1 (que não aparece no endereço).
                search={{ categoria: opcao.valor || undefined }}
                aria-current={escolhida ? 'page' : undefined}
                className={`${ESTILO_DO_LINK_DE_PAGINA} ${escolhida ? 'border-brand-gold-light text-brand-gold-light' : ''}`}
              >
                {opcao.rotulo}
              </Link>
            )
          })}
        </nav>

        <div className="mt-10">
          {/* Carregando, erro, vazio ou a lista: um estado de cada vez. */}
          {consulta.isPending ? (
            <AvisoDeEstado estado="carregando" />
          ) : consulta.isError ? (
            <AvisoDeEstado estado="erro" />
          ) : consulta.data.posts.length === 0 ? (
            <AvisoDeEstado estado="vazio" />
          ) : (
            <>
              {/* Cartões: 1 coluna no celular, 2 no tablet, 3 na tela larga. */}
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {consulta.data.posts.map((post) => (
                  <CartaoDoPost key={post.slug} post={post} />
                ))}
              </ul>
              <Paginacao
                pagina={consulta.data.pagina}
                link={(numero, conteudo) => (
                  <Link
                    to="/blog"
                    search={{ categoria: categoria || undefined, pagina: numero > 1 ? numero : undefined }}
                    className={ESTILO_DO_LINK_DE_PAGINA}
                  >
                    {conteudo}
                  </Link>
                )}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
