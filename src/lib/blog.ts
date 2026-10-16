/**
 * BLOG E EVENTOS NO SITE (#61, bloco B4).
 *
 * O conteúdo é cadastrado na plataforma de cursos (Comando Geral) e mostrado
 * aqui, no site, que é a vitrine pública do IBTO. Este arquivo busca os dados
 * na API pública da plataforma do mesmo ambiente e traz as funções pequenas
 * que as páginas usam (data no formato do Brasil, parágrafos do texto etc.).
 *
 * Regra de ouro: se a plataforma estiver fora do ar ou lenta, as páginas
 * mostram um aviso calmo, nunca uma tela quebrada.
 */
import { enderecoDaPlataforma } from './plataforma'

// Quanto tempo esperar a plataforma antes de desistir (8 segundos: a página
// inteira depende da resposta, então espera um pouco mais que o bloco da home).
const ESPERA_MAXIMA_MS = 8000

// Quantos posts por página da lista (o máximo que a API entrega de uma vez).
export const POSTS_POR_PAGINA = 12

// Estilo comum dos links de paginação e de filtro (área de toque de 44 px, contraste AA).
export const ESTILO_DO_LINK_DE_PAGINA =
  'inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-white hover:border-brand-gold-light hover:text-brand-gold-light'

/** As categorias do blog, no valor técnico que a API entende. */
export type CategoriaDoBlog = 'noticia' | 'evento'

/** As opções do filtro da página /blog, na ordem dos botões. */
export const CATEGORIAS: { valor: CategoriaDoBlog | ''; rotulo: string }[] = [
  { valor: '', rotulo: 'Tudo' },
  { valor: 'noticia', rotulo: 'Notícias' },
  { valor: 'evento', rotulo: 'Eventos' },
]

/** Em que página da lista estamos e quantas existem. */
export interface Pagina {
  atual: number
  ultima: number
  total: number
}

/** Um post na lista (o cartão). */
export interface CartaoDoPost {
  /** O nome do post no endereço. Ex.: 'formacao-no-estande' */
  slug: string
  titulo: string
  /** Ex.: 'Eventos' */
  categoria: string
  resumo: string | null
  /** Ex.: '2026-10-15' */
  data: string | null
  capa_url: string | null
  capa_descricao: string | null
}

/** Uma foto de álbum: endereço, descrição (texto alternativo) e crédito. */
export interface Foto {
  id: number
  url: string
  descricao: string | null
  credito: string
}

/** Como tocar o vídeo do post: YouTube (endereço para embutir) ou arquivo. */
export type Video = { tipo: 'youtube'; id: string; embed: string } | { tipo: 'arquivo'; url: string }

/** O post inteiro (a página do post). */
export interface PostCompleto extends CartaoDoPost {
  /** O texto como foi digitado, com as quebras de linha. */
  texto: string | null
  credito: string | null
  video: Video | null
  /** O curso aberto ligado ao post (com o link da inscrição), ou null. */
  curso: { titulo: string; url: string } | null
  fotos: Foto[]
}

/** Um álbum na lista de eventos. */
export interface CartaoDoAlbum {
  slug: string
  titulo: string
  /** Ex.: '2026-10-11' */
  data_evento: string | null
  local_evento: string | null
  /** Quantas fotos o álbum tem. */
  fotos: number
  capa_url: string | null
  capa_descricao: string | null
}

/** Um álbum inteiro (a página do evento). */
export interface AlbumCompleto {
  slug: string
  titulo: string
  descricao: string | null
  data_evento: string | null
  local_evento: string | null
  /** O post ligado ao álbum, se já está no site. */
  post: { slug: string; titulo: string } | null
  fotos: Foto[]
}

/**
 * Busca um JSON na API pública da plataforma do mesmo ambiente.
 *
 * @param caminho O caminho na plataforma. Ex.: '/api/publico/blog?pagina=2'
 * @returns Os dados, ou null quando a plataforma responde 404 (não existe ou não está no site).
 * @throws Error se a plataforma não responder a tempo ou responder com outro erro.
 */
async function buscarJson<T>(caminho: string): Promise<T | null> {
  // O endereço do site atual decide qual plataforma consultar (testes ou oficial).
  const base = enderecoDaPlataforma(typeof window !== 'undefined' ? window.location.host : '')
  // AbortController + setTimeout: corta o pedido se passar do tempo.
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), ESPERA_MAXIMA_MS)

  try {
    const resposta = await fetch(`${base}${caminho}`, {
      signal: controle.signal,
      headers: { Accept: 'application/json' },
    })
    // 404: o conteúdo não existe (ou ainda não está no site). Não é falha: a página mostra "não encontrado".
    if (resposta.status === 404) {
      return null
    }
    // Outro erro (ex.: 500, 429): avisa quem chamou, e a página mostra o aviso calmo.
    if (!resposta.ok) {
      throw new Error(`PLATAFORMA_RESPONDEU_${resposta.status}`)
    }

    return (await resposta.json()) as T
  } finally {
    // Sempre desliga o relógio, deu certo ou não.
    clearTimeout(relogio)
  }
}

/**
 * Monta o caminho da lista de posts na API.
 *
 * @param pagina A página. Ex.: 2
 * @param categoria 'noticia', 'evento' ou '' (todas).
 * @returns Ex.: '/api/publico/blog?quantos=12&pagina=2&categoria=evento'
 */
export function caminhoDaLista(pagina: number, categoria: CategoriaDoBlog | ''): string {
  // URLSearchParams monta o "?a=1&b=2" já protegendo caracteres especiais.
  const parametros = new URLSearchParams({ quantos: String(POSTS_POR_PAGINA), pagina: String(pagina) })
  // Categoria vazia = todas: nem vai no endereço.
  if (categoria !== '') {
    parametros.set('categoria', categoria)
  }

  return `/api/publico/blog?${parametros.toString()}`
}

/**
 * Uma página da lista de posts.
 *
 * @param pagina A página. Ex.: 1
 * @param categoria 'noticia', 'evento' ou '' (todas).
 * @returns Os posts e a paginação (lista vazia se não houver nenhum).
 */
export async function buscarPosts(
  pagina: number,
  categoria: CategoriaDoBlog | '',
): Promise<{ posts: CartaoDoPost[]; pagina: Pagina }> {
  const dados = await buscarJson<{ posts: CartaoDoPost[]; pagina: Pagina }>(caminhoDaLista(pagina, categoria))

  // 404 na lista não deveria acontecer; se acontecer, trata como lista vazia.
  return dados ?? { posts: [], pagina: { atual: 1, ultima: 1, total: 0 } }
}

/**
 * Um post inteiro, pelo slug.
 *
 * @param slug Ex.: 'formacao-no-estande'
 * @returns O post, ou null se ele não existe ou não está no site.
 */
export async function buscarPost(slug: string): Promise<PostCompleto | null> {
  // Slug fora do formato (ex.: alguém digitou um endereço estranho): nem pergunta à plataforma.
  if (!slugValido(slug)) {
    return null
  }
  const dados = await buscarJson<{ post: PostCompleto }>(`/api/publico/blog/${slug}`)

  return dados?.post ?? null
}

/**
 * Uma página da lista de álbuns de eventos.
 *
 * @param pagina A página. Ex.: 1
 */
export async function buscarAlbuns(pagina: number): Promise<{ albuns: CartaoDoAlbum[]; pagina: Pagina }> {
  const dados = await buscarJson<{ albuns: CartaoDoAlbum[]; pagina: Pagina }>(
    `/api/publico/eventos?pagina=${pagina}`,
  )

  return dados ?? { albuns: [], pagina: { atual: 1, ultima: 1, total: 0 } }
}

/**
 * Um álbum inteiro, pelo slug.
 *
 * @param slug Ex.: 'estande-de-tiro-pe'
 * @returns O álbum, ou null se ele não existe ou não está no site.
 */
export async function buscarAlbum(slug: string): Promise<AlbumCompleto | null> {
  if (!slugValido(slug)) {
    return null
  }
  const dados = await buscarJson<{ album: AlbumCompleto }>(`/api/publico/eventos/${slug}`)

  return dados?.album ?? null
}

/**
 * O slug está no formato que a plataforma gera? (letras minúsculas, números e hífen)
 *
 * @param slug Ex.: 'formacao-no-estande' (válido) ou '../senha' (inválido).
 */
export function slugValido(slug: string): boolean {
  return /^[a-z0-9-]{1,170}$/.test(slug)
}

/**
 * Lê a categoria do endereço da página (?categoria=...).
 *
 * @param valor O que veio no endereço. Ex.: 'evento', 'xyz' ou undefined.
 * @returns A categoria válida, ou '' (todas) para qualquer outro valor.
 */
export function categoriaDoEndereco(valor: unknown): CategoriaDoBlog | '' {
  return valor === 'noticia' || valor === 'evento' ? valor : ''
}

/**
 * Lê o número da página do endereço (?pagina=...).
 *
 * @param valor O que veio no endereço. Ex.: '2', 2, '-5' ou undefined.
 * @returns Um número inteiro de 1 em diante (qualquer valor estranho vira 1).
 */
export function paginaDoEndereco(valor: unknown): number {
  const numero = Number(valor)

  // Inteiro e positivo: vale. Senão (texto, zero, negativo, quebrado): página 1.
  return Number.isInteger(numero) && numero >= 1 ? numero : 1
}

/** O filtro e a página da lista, como ficam no endereço (ausente = padrão). */
export interface BuscaDoBlog {
  categoria?: CategoriaDoBlog
  pagina?: number
}

/**
 * Limpa o que veio no endereço da lista: só fica o que é válido e diferente
 * do padrão. Assim o endereço fica curto (/blog em vez de /blog?pagina=1).
 *
 * @param busca Os parâmetros do endereço. Ex.: { categoria: 'evento', pagina: '2' }
 * @returns Ex.: { categoria: 'evento', pagina: 2 }; para { pagina: '1', categoria: 'xyz' }, {}.
 */
export function buscaLimpa(busca: Record<string, unknown>): BuscaDoBlog {
  const categoria = categoriaDoEndereco(busca.categoria)
  const pagina = paginaDoEndereco(busca.pagina)
  const limpa: BuscaDoBlog = {}
  // Só guarda a categoria se ela filtra algo (vazia = todas, o padrão).
  if (categoria !== '') {
    limpa.categoria = categoria
  }
  // Só guarda a página se não for a primeira (o padrão).
  if (pagina > 1) {
    limpa.pagina = pagina
  }

  return limpa
}

/**
 * Data no formato do Brasil. Ex.: '2026-10-15' → '15/10/2026'.
 *
 * @param data A data no formato ano-mês-dia.
 */
export function dataBr(data: string): string {
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

/**
 * Quebra o texto do post em parágrafos (cada linha em branco separa um do outro).
 * O texto é mostrado como TEXTO, nunca como HTML: assim ninguém consegue
 * colocar código na página pelo cadastro do post.
 *
 * @param texto O texto digitado. Ex.: 'Primeiro.\n\nSegundo.'
 * @returns Ex.: ['Primeiro.', 'Segundo.'] (vazio sem texto).
 */
export function paragrafos(texto: string | null): string[] {
  // Sem texto: nenhum parágrafo.
  if (!texto) {
    return []
  }

  return texto
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((trecho) => trecho.trim())
    .filter((trecho) => trecho !== '')
}

/**
 * Os DADOS ESTRUTURADOS do post (JSON-LD, padrão schema.org): dizem ao Google
 * e às IAs, num formato que elas leem sem adivinhar, que a página é uma
 * notícia do IBTO, com título, data, imagem e resumo.
 *
 * Segurança: o "<" vira "<", para um título com "</script>" nunca
 * conseguir fechar a etiqueta e injetar código na página.
 *
 * @param post O post. Ex.: { slug: 'formacao-no-estande', titulo: 'Formação no estande', ... }
 * @param endereco O endereço canônico da página. Ex.: 'https://ib-to.org/blog/formacao-no-estande'
 * @returns O JSON pronto para ir dentro de <script type="application/ld+json">.
 */
export function jsonLdDoPost(post: PostCompleto, endereco: string): string {
  const dados = {
    '@context': 'https://schema.org',
    // BlogPosting: o tipo do schema.org para publicação de blog (vale para notícias e eventos).
    '@type': 'BlogPosting',
    headline: post.titulo,
    description: post.resumo ?? undefined,
    datePublished: post.data ?? undefined,
    image: post.capa_url ?? undefined,
    url: endereco,
    mainEntityOfPage: endereco,
    inLanguage: 'pt-BR',
    articleSection: post.categoria,
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Instituto Brasileiro de Treinamento Operacional',
      url: 'https://ib-to.org/',
      logo: { '@type': 'ImageObject', url: 'https://ib-to.org/images/logo.webp' },
    },
  }

  // JSON.stringify tira os campos "undefined" sozinho; depois protege o "<".
  return JSON.stringify(dados).replace(/</g, '\\u003c')
}

/**
 * "1 foto" ou "12 fotos".
 *
 * @param quantas Ex.: 12
 */
export function rotuloDeFotos(quantas: number): string {
  return quantas === 1 ? '1 foto' : `${quantas} fotos`
}
