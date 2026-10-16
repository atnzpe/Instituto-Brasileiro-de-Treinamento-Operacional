/**
 * Testes do CONVITE PARA INSTALAR O APP (src/lib/instalar.ts): quando aparece,
 * a pausa de 30 dias depois do "Agora não" e a detecção do Safari do iPhone.
 * Rodam sem navegador: `bun test`.
 */
import { describe, expect, test } from 'bun:test'
import { DIAS_SEM_CONVITE, ehSafariDoIphone, podeConvidar } from '../src/lib/instalar'

// Um dia em milissegundos.
const DIA = 24 * 60 * 60 * 1000

describe('podeConvidar', () => {
  test('já instalado: nunca convida', () => {
    expect(podeConvidar(true, null, Date.now())).toBe(false)
  })

  test('nunca recusou: convida', () => {
    expect(podeConvidar(false, null, Date.now())).toBe(true)
  })

  test('recusou: espera 30 dias para convidar de novo', () => {
    const agora = Date.now()
    expect(podeConvidar(false, agora - (DIAS_SEM_CONVITE - 1) * DIA, agora)).toBe(false)
    expect(podeConvidar(false, agora - DIAS_SEM_CONVITE * DIA, agora)).toBe(true)
  })
})

describe('ehSafariDoIphone', () => {
  test('Safari do iPhone e do iPad: sim', () => {
    expect(
      ehSafariDoIphone('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile Safari/604.1'),
    ).toBe(true)
    expect(ehSafariDoIphone('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1')).toBe(true)
  })

  test('Chrome do iPhone e Android: não', () => {
    expect(ehSafariDoIphone('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) CriOS/120.0 Mobile Safari/604.1')).toBe(false)
    expect(ehSafariDoIphone('Mozilla/5.0 (Linux; Android 14) Chrome/120.0 Mobile Safari/537.36')).toBe(false)
  })
})
