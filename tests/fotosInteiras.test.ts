/**
 * GUARDA DAS FOTOS INTEIRAS (#105): nenhuma parte do site volta a cortar foto
 * com "object-cover" sem querer. O recorte só vale nas EXCEÇÕES da issue
 * (cada uma com o motivo). Foto nova: use o componente FotoInteira.
 * O mesmo teste existe na plataforma (tests/js/fotos-inteiras.test.ts).
 */
import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

// Pasta com o código das telas do site.
const RAIZ = join(import.meta.dir, '..', 'src')

// Onde o recorte é o CERTO, com o motivo (lista da issue #105).
const EXCECOES: Record<string, string> = {
  // O próprio componente usa o recorte só no FUNDO desfocado (a frente é inteira).
  'components/FotoInteira.tsx': 'fundo desfocado do próprio componente',
  'components/Hero.tsx': 'fundo grande do topo, atrás do texto',
  'components/ContactLinks.tsx': 'ícones dos contatos',
  'components/ServiceGrid.tsx': 'emblema redondo (o círculo recorta o fundo preto do arquivo)',
}

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

describe('fotos inteiras (#105)', () => {
  test('só as exceções da issue usam object-cover', () => {
    const comRecorte = arquivosTsx(RAIZ)
      // Caminho curto com barras normais. Ex.: 'routes/eventos.index.tsx'.
      .map((caminho) => relative(RAIZ, caminho).replaceAll('\\', '/'))
      .filter((curto) => readFileSync(join(RAIZ, curto), 'utf8').includes('object-cover') && !(curto in EXCECOES))

    // A mensagem do erro lista as partes que cortam foto (para quem for corrigir).
    expect(comRecorte).toEqual([])
  })
})
