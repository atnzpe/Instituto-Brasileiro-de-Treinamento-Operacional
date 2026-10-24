/**
 * LIGAÇÃO DO SITE COM A PLATAFORMA DE CURSOS (blog #61, bloco B3).
 *
 * O site e a plataforma são dois sistemas, em endereços diferentes. Cada site
 * conversa com a plataforma DO MESMO AMBIENTE, descoberta pelo endereço:
 * - site de testes (homolog.ib-to.org) → plataforma de testes (cursos-homolog.ib-to.org);
 * - site oficial (ib-to.org) → plataforma oficial (cursos.ib-to.org);
 * - no computador do desenvolvedor (localhost) → a plataforma de testes.
 * Assim o site de testes nunca mostra dados da plataforma oficial, e o contrário.
 */

/** Um post do blog como a API pública da plataforma devolve. */
export interface PostResumo {
  /** O nome do post no endereço; o site monta o link /blog/{slug} com ele (#61, B4). */
  slug: string
  titulo: string
  categoria: string
  resumo: string | null
  /** A data em que foi publicado. Ex.: '2026-10-15' */
  data: string | null
  capa_url: string | null
  capa_descricao: string | null
  /** O endereço completo do post na plataforma. */
  url: string
}

// Quanto tempo esperar a plataforma antes de desistir (5 segundos): o bloco
// some, e o resto da página continua normal.
const ESPERA_MAXIMA_MS = 5000

/**
 * O endereço da plataforma do mesmo ambiente do site.
 *
 * @param host O endereço do site sem o "https://". Ex.: 'homolog.ib-to.org'
 * @returns Ex.: 'https://cursos-homolog.ib-to.org'
 */
export function enderecoDaPlataforma(host: string): string {
  // Site oficial (com ou sem "www"): a plataforma oficial.
  if (host === 'ib-to.org' || host === 'www.ib-to.org') {
    return 'https://cursos.ib-to.org'
  }

  // Qualquer outro (homologação, computador local): a plataforma de testes.
  return 'https://cursos-homolog.ib-to.org'
}

/**
 * O endereço da plataforma do ambiente em que o site está aberto agora.
 * Fora do navegador (ex.: testes), usa a plataforma de testes.
 *
 * @param caminho O caminho dentro da plataforma. Ex.: '/login'
 * @returns Ex.: 'https://cursos.ib-to.org/login'
 */
export function linkDaPlataforma(caminho = ''): string {
  // "window" só existe no navegador.
  const host = typeof window !== 'undefined' ? window.location.host : ''

  return `${enderecoDaPlataforma(host)}${caminho}`
}

/**
 * Busca os posts mais recentes do blog na plataforma.
 *
 * @param quantos Quantos posts. Ex.: 3
 * @returns Os posts (lista vazia se não houver nenhum).
 * @throws Error se a plataforma não responder em 5 segundos ou responder com erro.
 */
export async function buscarUltimosPosts(quantos = 3): Promise<PostResumo[]> {
  // O endereço do site atual decide qual plataforma consultar.
  const base = enderecoDaPlataforma(window.location.host)
  // AbortController + setTimeout: corta o pedido se passar do tempo (funciona até no Safari antigo).
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), ESPERA_MAXIMA_MS)

  try {
    const resposta = await fetch(`${base}/api/publico/blog?quantos=${quantos}`, {
      signal: controle.signal,
      headers: { Accept: 'application/json' },
    })
    // Resposta de erro (ex.: plataforma em manutenção): avisa quem chamou.
    if (!resposta.ok) {
      throw new Error(`PLATAFORMA_RESPONDEU_${resposta.status}`)
    }
    const dados = (await resposta.json()) as { posts: PostResumo[] }

    return dados.posts
  } finally {
    // Desliga o relógio, deu certo ou não.
    clearTimeout(relogio)
  }
}

/** Um curso como a API pública da plataforma devolve (#52). */
export interface CursoDaPlataforma {
  titulo: string
  chamada: string | null
  /** Ex.: 'Presencial' ou 'Online' */
  modalidade: string
  area: string | null
  /** true = exclusivo para filiados */
  restrito: boolean
  /** Ex.: 'Pago · aberto ao público' */
  tipo: string
  /** Preço em centavos (0 = gratuito). Ex.: 25000 */
  valor_centavos: number
  /** Ex.: '2026-11-08' */
  data_inicio: string | null
  local: string | null
  carga_horaria: number | null
  instrutor: string | null
  imagem_url: string | null
  /** O endereço completo da página do curso na plataforma. */
  url: string
}

/**
 * Busca os cursos publicados na plataforma (os fechados nunca vêm).
 *
 * @returns Os cursos (lista vazia se não houver nenhum).
 * @throws Error se a plataforma não responder em 5 segundos ou responder com erro.
 */
export async function buscarCursosDaPlataforma(): Promise<CursoDaPlataforma[]> {
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), ESPERA_MAXIMA_MS)

  try {
    const resposta = await fetch(linkDaPlataforma('/api/publico/cursos'), {
      signal: controle.signal,
      headers: { Accept: 'application/json' },
    })
    // Resposta de erro: avisa quem chamou (a seção some).
    if (!resposta.ok) {
      throw new Error(`PLATAFORMA_RESPONDEU_${resposta.status}`)
    }
    const dados = (await resposta.json()) as { cursos: CursoDaPlataforma[] }

    return dados.cursos
  } finally {
    clearTimeout(relogio)
  }
}

/**
 * Preço para mostrar. Ex.: 25000 → 'R$ 250,00'; 0 → 'Gratuito'.
 *
 * @param centavos O preço em centavos.
 */
export function precoBr(centavos: number): string {
  // Zero: o curso é gratuito.
  if (centavos === 0) {
    return 'Gratuito'
  }

  // Intl.NumberFormat escreve no jeito do Brasil (R$, vírgula nos centavos).
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(centavos / 100)
}

/** Uma área de atuação como a API pública da plataforma devolve (#57). */
export interface AreaDaPlataforma {
  nome: string
  /** Endereço da imagem cadastrada na plataforma, ou null. */
  imagem_url: string | null
}

/** Uma área como a página do site desenha (título e imagem). */
export interface AreaNoSite {
  title: string
  image: string
}

// Imagem usada quando a área não tem imagem na plataforma nem no site.
export const IMAGEM_PADRAO_DA_AREA = '/images/hero.webp'

/**
 * Deixa um nome comparável: sem acento, sem maiúscula e só letras e números.
 * Ex.: 'Combate Corpo-a-corpo' → 'combatecorpoacorpo'.
 */
function nomeComparavel(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Junta as áreas da plataforma (a fonte, #57) com as imagens que o site já tem.
 * Imagem: a da plataforma; senão, a do site com o mesmo nome; senão, a padrão.
 *
 * @param daPlataforma As áreas ativas da plataforma, na ordem dela.
 * @param reserva A lista escrita no site (usada só para achar as imagens).
 * @returns As áreas para a página desenhar.
 */
export function juntarAreas(daPlataforma: AreaDaPlataforma[], reserva: AreaNoSite[]): AreaNoSite[] {
  // Mapa "nome comparável → imagem do site". Ex.: 'selva' → '/images/services/selva.webp'.
  const imagensDoSite = new Map(reserva.map((area) => [nomeComparavel(area.title), area.image]))

  return daPlataforma.map((area) => ({
    title: area.nome,
    image: area.imagem_url ?? imagensDoSite.get(nomeComparavel(area.nome)) ?? IMAGEM_PADRAO_DA_AREA,
  }))
}

/**
 * Busca as áreas de atuação ativas na plataforma.
 *
 * @returns As áreas (lista vazia se não houver nenhuma).
 * @throws Error se a plataforma não responder em 5 segundos ou responder com erro.
 */
export async function buscarAreasDaPlataforma(): Promise<AreaDaPlataforma[]> {
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), ESPERA_MAXIMA_MS)

  try {
    const resposta = await fetch(linkDaPlataforma('/api/publico/areas-atuacao'), {
      signal: controle.signal,
      headers: { Accept: 'application/json' },
    })
    // Resposta de erro: avisa quem chamou (a página fica com a lista do site).
    if (!resposta.ok) {
      throw new Error(`PLATAFORMA_RESPONDEU_${resposta.status}`)
    }
    const dados = (await resposta.json()) as { areas: AreaDaPlataforma[] }

    return dados.areas
  } finally {
    clearTimeout(relogio)
  }
}

// ===== REDE NACIONAL (#11, pedido do Mestre Eduardo em 23/10/2026) =====
// Monitores e instrutores credenciados, por estado, vindos da plataforma. Só
// aparecem os que autorizaram a imagem; a plataforma NUNCA manda contato.

/** Uma pessoa no cartão da Rede Nacional. */
export interface CredenciadoDaRede {
  /** Nome abreviado. Ex.: 'Gleyson A. S.' */
  nome: string
  /** O nível (graduação). Ex.: 'Instrutor Expert II' */
  nivel: string | null
  /** A equipe filiada. Ex.: 'IBTO Pernambuco' */
  equipe: string | null
  /** A sigla do estado. Ex.: 'PE' */
  uf: string
  /** As áreas de atuação. Ex.: ['Defesa Pessoal', 'Krav Maga'] */
  areas: string[]
  /** O endereço completo da foto personalizada. */
  foto_url: string
}

/** Um estado com as pessoas dele, já na ordem da hierarquia. */
export interface EstadoDaRede {
  uf: string
  /** O nome do estado. Ex.: 'Pernambuco' */
  estado: string
  pessoas: CredenciadoDaRede[]
}

/** A resposta completa da API da Rede Nacional. */
export interface RedeNacionalDaPlataforma {
  instrutores: EstadoDaRede[]
  monitores: EstadoDaRede[]
  /** Os 27 estados (sigla → nome), para a grade de siglas. */
  estados: Record<string, string>
  /** Quantas pessoas no total (instrutores + monitores). */
  total: number
}

/**
 * Busca a Rede Nacional na plataforma.
 *
 * @returns As duas listas (instrutores e monitores), por estado.
 * @throws Error se a plataforma não responder em 5 segundos ou responder com erro.
 */
export async function buscarRedeNacional(): Promise<RedeNacionalDaPlataforma> {
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), ESPERA_MAXIMA_MS)

  try {
    const resposta = await fetch(linkDaPlataforma('/api/publico/rede-nacional'), {
      signal: controle.signal,
      headers: { Accept: 'application/json' },
    })
    // Resposta de erro: avisa quem chamou (a página mostra "rede em expansão").
    if (!resposta.ok) {
      throw new Error(`PLATAFORMA_RESPONDEU_${resposta.status}`)
    }

    return (await resposta.json()) as RedeNacionalDaPlataforma
  } finally {
    clearTimeout(relogio)
  }
}

/**
 * Quantas pessoas cada estado tem numa lista, para a grade de siglas
 * (estado com 0 fica apagado, sem link).
 *
 * @param estados Os estados de uma das listas. Ex.: [{ uf: 'PE', pessoas: [a, b] }]
 * @returns Sigla → quantidade. Ex.: { PE: 2 } (estado ausente = 0).
 */
export function contarPorUf(estados: EstadoDaRede[]): Record<string, number> {
  return Object.fromEntries(estados.map((estado) => [estado.uf, estado.pessoas.length]))
}

/**
 * As áreas de atuação que aparecem numa lista, sem repetir e em ordem
 * alfabética, para as etiquetas do filtro (#11, pedido de 16/10/2026).
 *
 * @param estados Os estados de uma das listas (instrutores ou monitores).
 * @returns As áreas. Ex.: ['Defesa Pessoal', 'Kapap', 'Krav Maga']
 */
export function areasDaLista(estados: EstadoDaRede[]): string[] {
  // Set: guarda cada área uma vez só, mesmo que muita gente tenha a mesma.
  const areas = new Set(estados.flatMap((estado) => estado.pessoas.flatMap((pessoa) => pessoa.areas)))

  // localeCompare com 'pt-BR': "Ávila" fica junto do "A", e não no fim.
  return [...areas].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

/**
 * Deixa só quem atua numa área. O estado que fica sem ninguém some da lista.
 *
 * @param estados Os estados de uma das listas.
 * @param area A área escolhida (ex.: 'Krav Maga'), ou null para não filtrar.
 * @returns Os estados com as pessoas daquela área (a lista original, se area for null).
 */
export function filtrarPorArea(estados: EstadoDaRede[], area: string | null): EstadoDaRede[] {
  // Sem área escolhida: tudo como veio.
  if (area === null) {
    return estados
  }

  return estados
    .map((estado) => ({ ...estado, pessoas: estado.pessoas.filter((pessoa) => pessoa.areas.includes(area)) }))
    .filter((estado) => estado.pessoas.length > 0)
}
