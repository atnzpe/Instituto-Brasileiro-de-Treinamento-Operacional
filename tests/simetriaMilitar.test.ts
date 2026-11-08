/**
 * GUARDA DA SIMETRIA MILITAR (pedido do Gleyson, 08/11/2026: "em todo o site, sem
 * exceção"). Tudo no site se alinha num eixo central, como numa insígnia. Este teste
 * vigia o código: se alguma parte voltar a encostar algo à esquerda ou à direita, ou
 * usar uma grade comum (que deixa a última fileira torta), a esteira avisa antes de
 * publicar.
 *
 * O jeito certo:
 *   - texto: herda o centro do <main> (regra no src/index.css);
 *   - texto longo: className="prosa" (margens retas e última linha centralizada);
 *   - cartões em colunas: className="grade-simetrica [--col-sm:2] [--col-lg:3]".
 */
import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

// Pasta com o código das telas do site.
const RAIZ = join(import.meta.dir, '..', 'src')

// As classes que tiram algo do eixo central. Ex.: "text-left" encosta o texto à esquerda;
// "grid-cols-3" faz uma grade comum (a última fileira fica encostada à esquerda).
// Vale também com prefixo de tamanho de tela (ex.: "sm:text-left").
const PROIBIDAS =
  /(^|[\s"'`])(?:[a-z0-9]+:)*(text-left|text-right|text-start|text-end|justify-start|justify-end|items-start|items-end|self-start|self-end|grid-cols-\d+|mr-auto|ml-auto|float-left|float-right|list-disc|list-decimal)(?=[\s"'`]|$)/gm

/**
 * Lista todos os arquivos .tsx de uma pasta, entrando nas subpastas.
 *
 * @param pasta O caminho da pasta. Ex.: RAIZ.
 * @returns Os caminhos completos dos arquivos .tsx.
 */
function arquivosTsx(pasta: string): string[] {
  return readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = join(pasta, item.name)

    // Subpasta: entra nela. Arquivo .tsx: entra na lista. Outro arquivo: fica de fora.
    if (item.isDirectory()) {
      return arquivosTsx(caminho)
    }

    return item.name.endsWith('.tsx') ? [caminho] : []
  })
}

describe('simetria militar', () => {
  test('nenhuma parte do site sai do eixo central', () => {
    const problemas = arquivosTsx(RAIZ).flatMap((caminho) => {
      // Caminho curto com barras normais. Ex.: 'components/Header.tsx'.
      const curto = relative(RAIZ, caminho).replaceAll('\\', '/')
      const codigo = readFileSync(caminho, 'utf8')

      // Cada classe proibida vira uma linha do aviso. Ex.: 'components/X.tsx: text-left'.
      return [...codigo.matchAll(PROIBIDAS)].map((achado) => `${curto}: ${achado[2]}`)
    })

    // A mensagem do erro lista onde está cada problema (para quem for corrigir).
    expect(problemas).toEqual([])
  })

  test('o <main> centraliza o conteúdo e as classes de simetria existem', () => {
    const css = readFileSync(join(RAIZ, 'index.css'), 'utf8')

    // As três peças da regra: o eixo central, o texto longo e a grade simétrica.
    expect(css).toMatch(/main\s*\{\s*text-align:\s*center;/)
    expect(css).toContain('.prosa p')
    expect(css).toContain('.grade-simetrica')
  })
})
