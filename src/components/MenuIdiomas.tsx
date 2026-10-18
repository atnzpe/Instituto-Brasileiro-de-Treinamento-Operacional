import { useEffect, useRef } from 'react'
import type { MouseEvent as EventoDoMouse, ReactNode } from 'react'
import {
  IDIOMAS,
  buscaSemGoogle,
  hostOriginal,
  idiomaAtual,
  linkTraducao,
} from '../lib/traducao'
import type { CodigoIdioma } from '../lib/traducao'

/*
 * MENU DE IDIOMAS DO SITE (#54; decisão do Gleyson de 07/10/2026): português
 * (padrão), inglês e espanhol pelo Google Tradutor. Cada idioma estrangeiro
 * abre a MESMA página traduzida pelo endereço "translate.goog"; o português
 * volta à página original. Nenhum script do Google é carregado no site.
 * Mesmo método e mesmos desenhos da plataforma (menu-idiomas.tsx) e da CBSA.
 *
 * Usa <details>/<summary>, que o próprio navegador abre e fecha: funciona pelo
 * teclado (Tab e Enter) sem código extra. O código abaixo só fecha o menu ao
 * clicar fora ou ao apertar Esc.
 */

// Bandeira de cada idioma, desenhada em SVG dentro do código (não depende de
// arquivo de imagem, então não quebra na página traduzida pelo Google).
// pt = Brasil, en = Estados Unidos, es = Espanha.
const BANDEIRAS: Record<CodigoIdioma, ReactNode> = {
  // Brasil: fundo verde, losango amarelo, círculo azul com a faixa branca.
  pt: (
    <>
      <rect width="30" height="20" fill="#009c3b" />
      <path d="M15 2 28 10 15 18 2 10z" fill="#ffdf00" />
      <circle cx="15" cy="10" r="4.6" fill="#002776" />
      <path d="M10.6 9.1q4.6-1.2 8.8 1.6" stroke="#fff" strokeWidth=".9" fill="none" />
    </>
  ),
  // Estados Unidos: listras vermelhas e brancas, quadrado azul com estrelas (pontos).
  en: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <path
        d="M0 0h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0z"
        fill="#b22234"
      />
      <rect width="12" height="10.77" fill="#3c3b6e" />
      <g fill="#fff">
        <circle cx="2" cy="2" r=".6" />
        <circle cx="6" cy="2" r=".6" />
        <circle cx="10" cy="2" r=".6" />
        <circle cx="4" cy="5.4" r=".6" />
        <circle cx="8" cy="5.4" r=".6" />
        <circle cx="2" cy="8.8" r=".6" />
        <circle cx="6" cy="8.8" r=".6" />
        <circle cx="10" cy="8.8" r=".6" />
      </g>
    </>
  ),
  // Espanha: vermelho, amarelo (faixa do meio, mais larga) e vermelho.
  es: (
    <>
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </>
  ),
}

/**
 * Desenha a bandeira de um idioma. É decorativa (aria-hidden): quem usa leitor
 * de tela ouve o nome do idioma, que está escrito ao lado.
 *
 * @param codigo Código do idioma. Ex.: 'es'
 * @returns O desenho <svg> da bandeira, com 21 x 14 pixels.
 */
function Bandeira({ codigo }: { codigo: CodigoIdioma }) {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false" className="h-3.5 w-[21px] shrink-0 rounded-[2px]">
      {BANDEIRAS[codigo]}
    </svg>
  )
}

/**
 * O menu de idiomas: um botão que abre a lista dos três idiomas.
 * Lê o endereço da página atual direto no navegador.
 *
 * @param noCelular true = versão do menu do celular (lista aberta na largura toda).
 * @returns O menu pronto para o cabeçalho do site.
 */
export function MenuIdiomas({ noCelular = false }: { noCelular?: boolean }) {
  // Referência ao <details>, para o código conseguir fechá-lo.
  const menu = useRef<HTMLDetailsElement>(null)

  // Endereço da página atual (lido no navegador).
  const { hostname, host, pathname, search, protocol } = window.location

  // Idioma em que a página está agora: 'pt' no nosso site; na do Google, o escolhido.
  const atual = idiomaAtual(hostname, search)

  // O NOSSO domínio, mesmo quando a pessoa está na página do Google.
  const nossoHost = atual === 'pt' ? host : hostOriginal(hostname)

  // Caminho da página sem as sobras da tradução (_x_tr_...). Ex.: "/contato".
  const caminho = `${pathname}${buscaSemGoogle(search)}`

  // Dados do idioma atual, para mostrar no botão (bandeira + nome).
  const idiomaDoBotao = IDIOMAS.find((idioma) => idioma.codigo === atual) ?? IDIOMAS[0]

  // Fecha o menu ao clicar fora dele ou ao apertar Esc (bom para quem usa teclado).
  useEffect(() => {
    // Clique em qualquer lugar: se não foi dentro do menu, fecha.
    const aoClicar = (evento: MouseEvent) => {
      if (menu.current && !menu.current.contains(evento.target as Node)) {
        menu.current.open = false
      }
    }

    // Esc com o menu aberto: fecha e devolve o foco ao botão.
    const aoTeclar = (evento: KeyboardEvent) => {
      // Outra tecla, ou menu já fechado: não faz nada.
      if (evento.key !== 'Escape' || !menu.current?.open) {
        return
      }
      menu.current.open = false
      menu.current.querySelector('summary')?.focus()
    }

    document.addEventListener('click', aoClicar)
    document.addEventListener('keydown', aoTeclar)

    // Ao sair da página, desliga os "ouvintes" para não ficarem acumulando.
    return () => {
      document.removeEventListener('click', aoClicar)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [])

  /**
   * Monta o link de um idioma.
   *
   * @param codigo Idioma de destino. Ex.: 'en'
   * @returns Português: a página original; outro: a página traduzida pelo Google.
   */
  const linkDo = (codigo: CodigoIdioma): string => {
    // Português: a página original no nosso domínio (na do Google é sempre https).
    if (codigo === 'pt') {
      const esquema = atual === 'pt' ? protocol : 'https:'

      return `${esquema}//${nossoHost}${caminho}`
    }

    // Outro idioma: a mesma página, traduzida pelo Google.
    return linkTraducao(codigo, nossoHost, caminho)
  }

  /**
   * Leva ao idioma escolhido. Na página traduzida, o Google "embrulha" os links
   * num endereço dele; por isso o clique vai direto ao destino que montamos.
   *
   * @param evento O clique no link.
   * @param destino Endereço montado por linkDo.
   */
  const irPara = (evento: EventoDoMouse<HTMLAnchorElement>, destino: string) => {
    evento.preventDefault()
    window.location.assign(destino)
  }

  return (
    // translate="no": o Google não traduz o próprio menu (os nomes já estão no idioma de cada um).
    <details ref={menu} className={noCelular ? 'relative mt-2' : 'relative'} translate="no">
      <summary
        className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-brand-gold/40 px-5 font-body text-sm text-white/80 hover:border-brand-gold-light focus-visible:outline-2 focus-visible:outline-brand-gold-light [&::-webkit-details-marker]:hidden"
        aria-label={`Idioma / Language / Idioma: ${idiomaDoBotao.nome}`}
      >
        <Bandeira codigo={idiomaDoBotao.codigo} />
        <span>{idiomaDoBotao.nome}</span>
        <span aria-hidden="true" className="text-xs text-brand-gold-light">
          ▾
        </span>
      </summary>

      <ul
        className={
          noCelular
            ? 'mt-2 flex flex-col rounded-md border border-white/10 bg-ink py-1'
            : 'absolute right-0 z-50 mt-2 min-w-40 rounded-md border border-brand-gold/40 bg-ink py-1 shadow-lg'
        }
      >
        {IDIOMAS.map((idioma) => (
          <li key={idioma.codigo}>
            <a
              href={linkDo(idioma.codigo)}
              onClick={(evento) => irPara(evento, linkDo(idioma.codigo))}
              lang={idioma.codigo === 'pt' ? 'pt-BR' : idioma.codigo}
              aria-label={idioma.aviso}
              // Marca o idioma atual para o leitor de tela ("atual").
              aria-current={idioma.codigo === atual ? 'true' : undefined}
              className="flex min-h-11 items-center gap-2 px-3 font-body text-sm text-white/80 hover:bg-brand-gold/15 focus-visible:outline-2 focus-visible:outline-brand-gold-light aria-[current=true]:font-semibold aria-[current=true]:text-brand-gold-light"
            >
              <Bandeira codigo={idioma.codigo} />
              {idioma.nome}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
