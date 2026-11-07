/**
 * RODAPÉ DO SITE: o logo do IBTO e, embaixo, uma linha discreta no estilo de placa
 * tática (letras pequenas, maiúsculas e espaçadas), com dois blocos espelhados em
 * volta de um losango central:
 *   - à esquerda, QUEM FEZ o site (autoria, pedido do Gleyson em 07/11/2026);
 *   - à direita, a VERSÃO no ar (#75), para o suporte saber o que está publicado
 *     quando alguém relata um problema.
 */

// Quem desenvolveu o site. Guardado aqui num lugar só para trocar fácil, se precisar.
const AUTOR = 'Gleyson Atanazio'

/**
 * Um dos dois blocos da linha de baixo: um rótulo pequeno em cima e o valor embaixo.
 *
 * @param rotulo O que o valor significa. Ex.: 'Desenvolvido por'
 * @param valor  O dado em si. Ex.: 'Gleyson Atanazio' ou 'v0.2.0'
 * @param lado   'esquerda' alinha o texto à direita (encostado no losango);
 *               'direita' alinha à esquerda. Assim os dois blocos ficam simétricos.
 * @returns O bloco de texto.
 */
function Bloco({ rotulo, valor, lado }: { rotulo: string; valor: string; lado: 'esquerda' | 'direita' }) {
  return (
    // Bloco da esquerda: texto encostado no centro (à direita). Bloco da direita: o contrário.
    <div className={lado === 'esquerda' ? 'text-right' : 'text-left'}>
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
 * @returns O rodapé com o logo, a autoria e a versão.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pt-10 pb-safe-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-safe-4">
        <img src="/images/logo.webp" alt="IBTO" className="h-16 w-auto" />

        {/* Linha tática: três colunas, as das pontas com a mesma largura (1fr), e o
            losango no meio. Por isso fica simétrica em qualquer tamanho de tela. */}
        <div className="grid w-full max-w-md grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-white/10 pt-5">
          <Bloco rotulo="Desenvolvido por" valor={AUTOR} lado="esquerda" />
          {/* Losango central: só enfeite, por isso aria-hidden (o leitor de tela pula). */}
          <span aria-hidden="true" className="block size-2 rotate-45 border border-brand-gold-light/60" />
          {/* A versão do site vem do package.json no build. Ex.: v0.2.0 */}
          <Bloco rotulo="Versão do site" valor={`v${__VERSAO_SITE__}`} lado="direita" />
        </div>
      </div>
    </footer>
  )
}
