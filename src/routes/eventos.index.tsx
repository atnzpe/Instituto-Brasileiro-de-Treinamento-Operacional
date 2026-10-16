/**
 * PÁGINA /eventos DO SITE (#61, bloco B4): a galeria de fotos dos eventos do
 * IBTO (treinamentos, formações, seminários), os mais novos primeiro.
 * Os álbuns vêm da plataforma, e só aparecem os publicados (com autorização
 * de imagem e todas as fotos descritas).
 *
 * As fotos da plataforma usam crossOrigin="anonymous": pedidas no modo liberado
 * pela plataforma (CORS), o modo offline as guarda sabendo se vieram certas.
 */
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AvisoDeEstado } from '../components/blog/AvisoDeEstado'
import { Paginacao } from '../components/blog/Paginacao'
import { buscaLimpa, buscarAlbuns, dataBr, ESTILO_DO_LINK_DE_PAGINA, rotuloDeFotos } from '../lib/blog'

// O título da aba do navegador e dos compartilhamentos.
const TITULO = 'Eventos | Instituto Brasileiro de Treinamento Operacional'
// A descrição que o Google e as redes sociais mostram.
const DESCRICAO = 'Fotos dos treinamentos, formações e eventos do Instituto Brasileiro de Treinamento Operacional.'

export const Route = createFileRoute('/eventos/')({
  // A página da lista vem do endereço (?pagina=2); valor estranho ou 1 não aparece.
  validateSearch: (busca: Record<string, unknown>): { pagina?: number } => ({
    pagina: buscaLimpa(busca).pagina,
  }),
  head: () => ({
    meta: [
      { title: TITULO },
      { name: 'description', content: DESCRICAO },
      { property: 'og:title', content: TITULO },
      { property: 'og:description', content: DESCRICAO },
      { property: 'og:url', content: 'https://ib-to.org/eventos' },
    ],
  }),
  component: PaginaDeEventos,
})

/**
 * A página de eventos.
 *
 * @returns O título, os cartões dos álbuns e a paginação.
 */
function PaginaDeEventos() {
  // Página ausente no endereço = página 1.
  const pagina = Route.useSearch().pagina ?? 1

  const consulta = useQuery({
    queryKey: ['eventos', pagina],
    queryFn: () => buscarAlbuns(pagina),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="bg-ink px-safe-4 py-16 sm:px-safe-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl text-white sm:text-5xl">Eventos</h1>
          <p className="mt-4 text-brand-gold-light">Os treinamentos do IBTO em fotos</p>
        </div>

        <div className="mt-10">
          {consulta.isPending ? (
            <AvisoDeEstado estado="carregando" />
          ) : consulta.isError ? (
            <AvisoDeEstado estado="erro" />
          ) : consulta.data.albuns.length === 0 ? (
            <AvisoDeEstado estado="vazio" />
          ) : (
            <>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {consulta.data.albuns.map((album) => (
                  <li
                    key={album.slug}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    {/* O cartão inteiro é o link para o álbum (área de toque grande). */}
                    <Link
                      to="/eventos/$slug"
                      params={{ slug: album.slug }}
                      className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold-light"
                    >
                      {album.capa_url && (
                        <img
                          crossOrigin="anonymous"
                          src={album.capa_url}
                          alt={album.capa_descricao ?? ''}
                          loading="lazy"
                          decoding="async"
                          width={800}
                          height={600}
                          className="aspect-[4/3] w-full object-cover"
                        />
                      )}
                      <div className="p-5">
                        <h2 className="text-lg text-white">{album.titulo}</h2>
                        <p className="mt-1 text-sm text-white/70">
                          {[
                            album.data_evento && dataBr(album.data_evento),
                            album.local_evento,
                            // Modo privado: em vez de "12 fotos", avisa que as fotos são para filiados.
                            album.fotos_restritas ? 'Fotos para filiados' : rotuloDeFotos(album.fotos),
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Paginacao
                pagina={consulta.data.pagina}
                link={(numero, conteudo) => (
                  <Link
                    to="/eventos"
                    search={{ pagina: numero > 1 ? numero : undefined }}
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
