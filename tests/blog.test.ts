/**
 * Testes das funções do BLOG E EVENTOS NO SITE (src/lib/blog.ts, #61 B4):
 * o que vem no endereço é limpo, o texto vira parágrafos (sem HTML) e o slug
 * só aceita o formato seguro. Rodam sem navegador: `bun test`.
 */
import { describe, expect, test } from 'bun:test'
import {
  buscaLimpa,
  caminhoDaLista,
  categoriaDoEndereco,
  dataBr,
  jsonLdDoPost,
  paginaDoEndereco,
  paragrafos,
  rotuloDeFotos,
  slugValido,
} from '../src/lib/blog'

describe('categoriaDoEndereco', () => {
  test('aceita só notícia e evento; o resto vira "todas"', () => {
    expect(categoriaDoEndereco('noticia')).toBe('noticia')
    expect(categoriaDoEndereco('evento')).toBe('evento')
    expect(categoriaDoEndereco('xyz')).toBe('')
    expect(categoriaDoEndereco(undefined)).toBe('')
  })
})

describe('paginaDoEndereco', () => {
  test('número inteiro de 1 em diante; valor estranho vira 1', () => {
    expect(paginaDoEndereco('3')).toBe(3)
    expect(paginaDoEndereco(2)).toBe(2)
    expect(paginaDoEndereco('0')).toBe(1)
    expect(paginaDoEndereco('-5')).toBe(1)
    expect(paginaDoEndereco('2.5')).toBe(1)
    expect(paginaDoEndereco('abc')).toBe(1)
    expect(paginaDoEndereco(undefined)).toBe(1)
  })
})

describe('buscaLimpa', () => {
  test('guarda só o que é válido e diferente do padrão', () => {
    expect(buscaLimpa({ categoria: 'evento', pagina: '2' })).toEqual({ categoria: 'evento', pagina: 2 })
    expect(buscaLimpa({ categoria: 'xyz', pagina: '1' })).toEqual({})
    expect(buscaLimpa({})).toEqual({})
  })
})

describe('caminhoDaLista', () => {
  test('pede 12 por página e só manda a categoria quando filtra', () => {
    expect(caminhoDaLista(1, '')).toBe('/api/publico/blog?quantos=12&pagina=1')
    expect(caminhoDaLista(2, 'evento')).toBe('/api/publico/blog?quantos=12&pagina=2&categoria=evento')
  })
})

describe('slugValido', () => {
  test('aceita o formato da plataforma e recusa o resto', () => {
    expect(slugValido('formacao-no-estande')).toBe(true)
    expect(slugValido('post-2')).toBe(true)
    expect(slugValido('../senha')).toBe(false)
    expect(slugValido('Com Espaço')).toBe(false)
    expect(slugValido('')).toBe(false)
  })
})

describe('paragrafos', () => {
  test('cada linha em branco separa um parágrafo; sem texto, nenhum', () => {
    expect(paragrafos('Primeiro.\n\nSegundo.\r\n\r\n  Terceiro.  ')).toEqual(['Primeiro.', 'Segundo.', 'Terceiro.'])
    expect(paragrafos('Linha 1\nLinha 2')).toEqual(['Linha 1\nLinha 2'])
    expect(paragrafos(null)).toEqual([])
    expect(paragrafos('\n\n')).toEqual([])
  })

  test('HTML digitado continua sendo texto (a página nunca o executa)', () => {
    expect(paragrafos('<script>alert(1)</script>')).toEqual(['<script>alert(1)</script>'])
  })
})

describe('jsonLdDoPost', () => {
  const post = {
    slug: 'formacao-no-estande',
    titulo: 'Formação </script><script>alert(1)</script>',
    categoria: 'Eventos',
    resumo: 'Turma no estande.',
    data: '2026-10-14',
    capa_url: null,
    capa_descricao: null,
    texto: null,
    credito: null,
    video: null,
    curso: null,
    fotos: [],
  }

  test('descreve a publicação no padrão schema.org', () => {
    const dados = JSON.parse(jsonLdDoPost(post, 'https://ib-to.org/blog/formacao-no-estande'))
    expect(dados['@type']).toBe('BlogPosting')
    expect(dados.datePublished).toBe('2026-10-14')
    expect(dados.url).toBe('https://ib-to.org/blog/formacao-no-estande')
    // Sem capa: o campo nem aparece (nada de "image": null).
    expect('image' in dados).toBe(false)
  })

  test('um título com </script> nunca fecha a etiqueta (sem "<" no texto)', () => {
    expect(jsonLdDoPost(post, 'https://ib-to.org/blog/x')).not.toContain('<')
  })
})

describe('dataBr e rotuloDeFotos', () => {
  test('formatos do Brasil', () => {
    expect(dataBr('2026-10-15')).toBe('15/10/2026')
    expect(rotuloDeFotos(1)).toBe('1 foto')
    expect(rotuloDeFotos(12)).toBe('12 fotos')
  })
})
