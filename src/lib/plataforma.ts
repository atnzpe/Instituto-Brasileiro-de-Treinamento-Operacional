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
