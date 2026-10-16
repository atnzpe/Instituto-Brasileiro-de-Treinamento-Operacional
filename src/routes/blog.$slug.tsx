/**
 * PÁGINA DE UM POST DO BLOG NO SITE (#61, bloco B4). Ex.: /blog/formacao-no-estande
 *
 * Mostra a capa, a data, o texto, o vídeo, as fotos do evento e, se houver,
 * o link para o curso ligado ao post (a inscrição é na plataforma).
 *
 * Segurança: o texto é mostrado como TEXTO (parágrafos), nunca como HTML, e o
 * vídeo do YouTube usa o endereço "youtube-nocookie" (sem cookies de rastreio).
 *
 * As fotos da plataforma usam crossOrigin="anonymous": pedidas no modo liberado
 * pela plataforma (CORS), o modo offline as guarda sabendo se vieram certas.
 */
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AvisoDeEstado } from '../components/blog/AvisoDeEstado'
import { GradeDeFotos } from '../components/blog/GradeDeFotos'
import { buscarPost, dataBr, jsonLdDoPost, paragrafos } from '../lib/blog'

export const Route = createFileRoute('/blog/$slug')({
  component: PaginaDoPost,
})

/**
 * A página do post.
 *
 * @returns O post inteiro, ou o aviso de carregando, erro ou não encontrado.
 */
function PaginaDoPost() {
  // O slug vem do endereço. Ex.: 'formacao-no-estande'.
  const { slug } = Route.useParams()

  const consulta = useQuery({
    queryKey: ['post', slug],
    queryFn: () => buscarPost(slug),
    staleTime: 5 * 60 * 1000,
  })
  const post = consulta.data

  // O título da aba e a descrição da página mudam para os do post quando ele
  // chega (bom para o Google, para os compartilhamentos e para quem tem várias abas).
  useEffect(() => {
    // Post ainda não chegou (ou não existe): mantém o título e a descrição padrão.
    if (!post) {
      return
    }
    document.title = `${post.titulo} | Blog do IBTO`
    // A etiqueta <meta name="description"> já existe (vem do layout); só troca o texto.
    if (post.resumo) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', post.resumo)
    }
  }, [post])

  return (
    <div className="bg-ink px-safe-4 py-16 sm:px-safe-6">
      <article className="mx-auto max-w-3xl">
        {/* Link de volta para a lista, sempre visível. */}
        <Link to="/blog" className="text-sm text-brand-gold-light hover:underline">
          ← Voltar ao blog
        </Link>

        {consulta.isPending ? (
          <AvisoDeEstado estado="carregando" />
        ) : consulta.isError ? (
          <AvisoDeEstado estado="erro" />
        ) : post === null || post === undefined ? (
          // null = a plataforma respondeu 404 (não existe ou não está no site).
          <>
            <h1 className="mt-8 text-3xl text-white">Publicação não encontrada</h1>
            <AvisoDeEstado estado="nao-encontrado" />
          </>
        ) : (
          <>
            {/* Dados estruturados (JSON-LD) para o Google e as IAs. O texto já vem
                protegido por jsonLdDoPost (o "<" escapado), por isso pode ir direto. */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: jsonLdDoPost(post, `https://ib-to.org/blog/${post.slug}`) }}
            />
            <p className="mt-8 text-sm text-white/70">
              {post.categoria}
              {post.data && ` · ${dataBr(post.data)}`}
            </p>
            <h1 className="mt-2 text-3xl text-white sm:text-4xl">{post.titulo}</h1>
            {post.resumo && <p className="mt-4 text-lg text-white/85">{post.resumo}</p>}

            {/* Capa grande, com a descrição para o leitor de tela. */}
            {post.capa_url && (
              <img
                crossOrigin="anonymous"
                src={post.capa_url}
                alt={post.capa_descricao ?? ''}
                decoding="async"
                width={1200}
                height={675}
                className="mt-8 aspect-video w-full rounded-2xl object-cover"
              />
            )}

            {/* O texto, um parágrafo por bloco digitado (como TEXTO, sem HTML). */}
            <div className="mt-8 space-y-4 leading-relaxed text-white/90">
              {paragrafos(post.texto).map((trecho, indice) => (
                // whitespace-pre-line: as quebras de linha simples dentro do parágrafo ficam.
                <p key={indice} className="whitespace-pre-line">
                  {trecho}
                </p>
              ))}
            </div>

            {/* Vídeo do YouTube: título no iframe para o leitor de tela; "nocookie" sem rastreio. */}
            {post.video?.tipo === 'youtube' && (
              <div className="mt-8 aspect-video overflow-hidden rounded-2xl">
                <iframe
                  src={post.video.embed}
                  title={`Vídeo: ${post.titulo}`}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-full w-full"
                />
              </div>
            )}
            {/* Vídeo enviado como arquivo: o tocador do próprio navegador. */}
            {post.video?.tipo === 'arquivo' && (
              <video src={post.video.url} controls preload="metadata" className="mt-8 w-full rounded-2xl">
                <track kind="captions" />
              </video>
            )}

            {/* Fotos dos álbuns de evento ligados ao post. */}
            {post.fotos.length > 0 && (
              <section aria-labelledby="t-fotos" className="mt-10">
                <h2 id="t-fotos" className="mb-4 text-xl text-white">
                  Fotos
                </h2>
                <GradeDeFotos fotos={post.fotos} />
              </section>
            )}

            {post.credito && <p className="mt-6 text-xs text-white/60">Crédito: {post.credito}</p>}

            {/* Curso ligado (só curso aberto): a inscrição é na plataforma, outro endereço. */}
            {post.curso && (
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-white">Gostou? Conheça o curso {post.curso.titulo}.</p>
                <a
                  href={post.curso.url}
                  className="mt-4 inline-block rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold-light hover:text-ink"
                >
                  Ver o curso e se inscrever
                </a>
              </div>
            )}
          </>
        )}
      </article>
    </div>
  )
}
