/**
 * PÁGINA DE UM EVENTO NO SITE (#61, bloco B4). Ex.: /eventos/estande-de-tiro-pe
 * O álbum de fotos: título, data, local, descrição e a grade de fotos, com o
 * link para o post do blog sobre o evento, se houver.
 */
import { AvisoFotosRestritas } from '../components/blog/AvisoFotosRestritas'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AvisoDeEstado } from '../components/blog/AvisoDeEstado'
import { GradeDeFotos } from '../components/blog/GradeDeFotos'
import { buscarAlbum, dataBr, paragrafos } from '../lib/blog'

export const Route = createFileRoute('/eventos/$slug')({
  component: PaginaDoEvento,
})

/**
 * A página do evento.
 *
 * @returns O álbum inteiro, ou o aviso de carregando, erro ou não encontrado.
 */
function PaginaDoEvento() {
  // O slug vem do endereço. Ex.: 'estande-de-tiro-pe'.
  const { slug } = Route.useParams()

  const consulta = useQuery({
    queryKey: ['evento', slug],
    queryFn: () => buscarAlbum(slug),
    staleTime: 5 * 60 * 1000,
  })
  const album = consulta.data

  // O título da aba muda para o nome do evento quando ele chega.
  useEffect(() => {
    if (album) {
      document.title = `${album.titulo} | Eventos do IBTO`
    }
  }, [album])

  return (
    <div className="bg-ink px-safe-4 py-16 sm:px-safe-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/eventos" className="text-sm text-brand-gold-light hover:underline">
          ← Voltar aos eventos
        </Link>

        {consulta.isPending ? (
          <AvisoDeEstado estado="carregando" />
        ) : consulta.isError ? (
          <AvisoDeEstado estado="erro" />
        ) : album === null || album === undefined ? (
          <>
            <h1 className="mt-8 text-3xl text-white">Evento não encontrado</h1>
            <AvisoDeEstado estado="nao-encontrado" />
          </>
        ) : (
          <>
            <h1 className="mt-8 text-3xl text-white sm:text-4xl">{album.titulo}</h1>
            <p className="mt-2 text-sm text-white/70">
              {[album.data_evento && dataBr(album.data_evento), album.local_evento].filter(Boolean).join(' · ')}
            </p>
            {/* A descrição como TEXTO, um parágrafo por bloco digitado. */}
            <div className="mt-6 max-w-3xl space-y-3 text-white/85">
              {paragrafos(album.descricao).map((trecho, indice) => (
                <p key={indice} className="whitespace-pre-line">
                  {trecho}
                </p>
              ))}
            </div>
            {/* Post do blog sobre o evento, se já está no site. */}
            {album.post && (
              <p className="mt-4">
                <Link
                  to="/blog/$slug"
                  params={{ slug: album.post.slug }}
                  className="font-semibold text-brand-gold-light hover:underline"
                >
                  Leia a matéria: {album.post.titulo}
                </Link>
              </p>
            )}
            {/* Fotos só para filiados (modo privado): o aviso com o botão para entrar na plataforma. */}
            {album.fotos_restritas ? (
              <AvisoFotosRestritas destino={`/eventos/${album.slug}`} />
            ) : (
              <div className="mt-8">
                <GradeDeFotos fotos={album.fotos} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
