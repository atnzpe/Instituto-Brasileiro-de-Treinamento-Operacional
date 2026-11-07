/**
 * RODAPÉ DO SITE, com SIMETRIA MILITAR (pedido do Gleyson em 07/11/2026): tudo
 * se organiza em volta de um eixo central, como numa insígnia ou num brevê.
 *   - Em cima: o logo do IBTO entre duas linhas iguais (as "asas").
 *   - Embaixo: dois blocos de MESMA largura, cada um com o texto centralizado:
 *     à esquerda, QUEM FEZ o site; à direita, a VERSÃO no ar (#75, para o suporte
 *     saber o que está publicado quando alguém relata um problema).
 *   - No meio dos dois blocos: uma estrela entre dois traços, como uma divisa.
 * Como as colunas têm a mesma largura, os dois lados "pesam" igual, mesmo que
 * um texto seja mais comprido que o outro.
 */

// Quem desenvolveu o site. Guardado aqui num lugar só para trocar fácil, se precisar.
const AUTOR = 'Gleyson Atanazio'

/**
 * Uma linha fina horizontal, usada como "asa" dos dois lados do logo.
 * É só enfeite: aria-hidden faz o leitor de tela pular.
 *
 * @returns A linha (um <span> que ocupa o espaço que sobrar).
 */
function Asa() {
  return <span aria-hidden="true" className="h-px flex-1 bg-brand-gold-light/30" />
}

/**
 * Um dos dois blocos da linha de baixo: um rótulo pequeno em cima e o valor
 * embaixo, os dois centralizados na coluna (é isso que garante a simetria).
 *
 * @param rotulo O que o valor significa. Ex.: 'Desenvolvido por'
 * @param valor  O dado em si. Ex.: 'Gleyson Atanazio' ou 'v0.2.0'
 * @returns O bloco de texto.
 */
function Bloco({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="text-center">
      {/* Rótulo: dourado claro do emblema, bem pequeno e espaçado. No celular o
          espaço entre as letras é menor (0.15em), para caber sem quebrar a linha
          em telas estreitas (320 px); a partir de 640 px (sm:) fica mais aberto. */}
      <p className="text-[10px] tracking-[0.15em] text-brand-gold-light/80 uppercase sm:tracking-[0.25em]">{rotulo}</p>
      {/* Valor: um pouco maior, no branco suave do site (mesma regra de espaço). */}
      <p className="mt-1 text-xs tracking-[0.08em] text-white/70 uppercase sm:tracking-[0.15em]">{valor}</p>
    </div>
  )
}

/**
 * O rodapé de todas as páginas do site.
 *
 * @returns O rodapé com o logo entre as asas, a autoria e a versão.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pt-10 pb-safe-10">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-safe-4">
        {/* Logo entre duas asas iguais: a linha da esquerda e a da direita têm o
            mesmo tamanho (flex-1 nas duas), então o logo fica no centro exato. */}
        <div className="flex w-full items-center gap-4">
          <Asa />
          <img src="/images/logo.webp" alt="IBTO" className="h-16 w-auto" />
          <Asa />
        </div>

        {/* Três colunas: as das pontas com a MESMA largura (1fr cada) e a divisa
            no meio, só do tamanho dela (auto). */}
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
          <Bloco rotulo="Desenvolvido por" valor={AUTOR} />
          {/* Divisa central: traço, estrela, traço (na vertical). Só enfeite. */}
          <span aria-hidden="true" className="flex flex-col items-center gap-1 text-brand-gold-light/70">
            <span className="h-3 w-px bg-brand-gold-light/40" />
            <span className="text-sm leading-none">★</span>
            <span className="h-3 w-px bg-brand-gold-light/40" />
          </span>
          {/* A versão do site vem do package.json no build. Ex.: v0.2.0 */}
          <Bloco rotulo="Versão do site" valor={`v${__VERSAO_SITE__}`} />
        </div>
      </div>
    </footer>
  )
}
