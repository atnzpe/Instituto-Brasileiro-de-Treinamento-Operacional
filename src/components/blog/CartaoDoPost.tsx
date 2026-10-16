/**
 * CARTÃO DE UM POST DO BLOG (#61): capa, categoria, data, título, resumo e o
 * link "Ler mais", que abre a página do post AQUI no site (/blog/{slug}).
 * Usado na lista /blog e no bloco "Últimas do IBTO" da página inicial.
 *
 * As fotos da plataforma usam crossOrigin="anonymous": pedidas no modo liberado
 * pela plataforma (CORS), o modo offline as guarda sabendo se vieram certas.
 */
import { Link } from '@tanstack/react-router'
import { type CartaoDoPost as Post, dataBr } from '../../lib/blog'

/**
 * Desenha o cartão.
 *
 * @param post O post. Ex.: { slug: 'formacao-no-estande', titulo: 'Formação no estande', ... }
 * @param nivelDoTitulo O nível do título (h2 na lista /blog; h3 dentro de uma seção da home).
 * @returns Um item de lista (<li>) pronto para ir dentro de um <ul>.
 */
export function CartaoDoPost({ post, nivelDoTitulo = 'h2' }: { post: Post; nivelDoTitulo?: 'h2' | 'h3' }) {
  // O título usa o nível pedido, para a página ter uma hierarquia correta (acessibilidade).
  const Titulo = nivelDoTitulo

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {/* Capa com a descrição para o leitor de tela (sem capa: só o texto). */}
      {post.capa_url && (
        <img
          crossOrigin="anonymous"
          src={post.capa_url}
          alt={post.capa_descricao ?? ''}
          loading="lazy"
          decoding="async"
          width={800}
          height={450}
          className="aspect-video w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs text-white/70">
          {post.categoria}
          {post.data && ` · ${dataBr(post.data)}`}
        </span>
        <Titulo className="text-lg text-white">{post.titulo}</Titulo>
        {post.resumo && <p className="text-sm text-white/85">{post.resumo}</p>}
        {/* Link do roteador: a página do post é deste site (abre sem recarregar). */}
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="mt-auto inline-flex min-h-11 items-center font-semibold text-brand-gold-light hover:underline"
        >
          Ler mais
          {/* Para o leitor de tela: "Ler mais: título", e não vários "Ler mais" iguais. */}
          <span className="sr-only">: {post.titulo}</span>
        </Link>
      </div>
    </li>
  )
}
