import { describe, expect, test } from 'bun:test'
import { IDIOMAS, buscaSemGoogle, hostGoogle, hostOriginal, idiomaAtual, linkTraducao, traducaoDisponivel } from '../src/lib/traducao'

/*
 * Testes da TRADUÇÃO PELO GOOGLE no site (#54): o apelido do domínio, a volta,
 * os links de cada idioma e a leitura do idioma atual. Mesmas regras da plataforma.
 */

describe('tradução pelo Google Tradutor', () => {
  test('três idiomas, português primeiro', () => {
    expect(IDIOMAS.map((idioma) => idioma.codigo)).toEqual(['pt', 'en', 'es'])
  })

  test('o domínio vira o apelido do Google e volta', () => {
    expect(hostGoogle('homolog.ib-to.org')).toBe('homolog-ib--to-org')
    expect(hostOriginal('homolog-ib--to-org.translate.goog')).toBe('homolog.ib-to.org')
    expect(hostOriginal('ib-to.org')).toBe('ib-to.org')
  })

  test('o link traduzido leva a mesma página e os parâmetros do Google', () => {
    expect(linkTraducao('es', 'ib-to.org', '/contato')).toBe('https://ib--to-org.translate.goog/contato?_x_tr_sl=pt&_x_tr_tl=es&_x_tr_hl=es')
    expect(linkTraducao('en', 'ib-to.org:443', '/cursos?aba=2')).toBe('https://ib--to-org.translate.goog/cursos?aba=2&_x_tr_sl=pt&_x_tr_tl=en&_x_tr_hl=en')
  })

  test('o idioma atual vem do endereço do Google; no site é português', () => {
    expect(idiomaAtual('ib--to-org.translate.goog', '?_x_tr_tl=en')).toBe('en')
    expect(idiomaAtual('ib-to.org', '')).toBe('pt')
    expect(idiomaAtual('ib--to-org.translate.goog', '?_x_tr_tl=fr')).toBe('pt')
  })

  test('as sobras do Google saem da busca, e localhost não traduz', () => {
    expect(buscaSemGoogle('?aba=2&_x_tr_sl=pt&_x_tr_tl=es')).toBe('?aba=2')
    expect(buscaSemGoogle('?_x_tr_tl=es')).toBe('')
    expect(traducaoDisponivel('localhost:5173')).toBe(false)
    expect(traducaoDisponivel('ib-to.org')).toBe(true)
  })
})
