/**
 * CONVITE PARA INSTALAR O APP (PWA, 16/10/2026): as regras de QUANDO mostrar.
 *
 * - Quem já instalou (o site aberto como app) nunca vê o convite.
 * - Quem tocou em "Agora não" fica 30 dias sem ver o convite.
 * - No iPhone/iPad não existe botão de instalar: o convite ensina o caminho
 *   (Compartilhar → Adicionar à Tela de Início).
 *
 * Só funções puras aqui (testadas em tests/instalar.test.ts); quem desenha a
 * faixa é o componente ConviteInstalar.
 */

// Quantos dias o convite fica escondido depois do "Agora não".
export const DIAS_SEM_CONVITE = 30

// Onde o navegador guarda a data do "Agora não" (só neste aparelho).
export const CHAVE_RECUSA = 'ibto-instalar-recusado-em'

// Espera antes de mostrar o convite (milissegundos): a pessoa vê a página primeiro.
export const ESPERA_PARA_CONVIDAR_MS = 3000

/**
 * O convite pode aparecer agora?
 *
 * @param jaInstalado true quando o site está aberto como app instalado.
 * @param recusadoEm A data (em milissegundos) do último "Agora não", ou null se nunca recusou.
 * @param agora O momento atual em milissegundos. Ex.: Date.now()
 * @returns true se não está instalado e não recusou nos últimos 30 dias.
 */
export function podeConvidar(jaInstalado: boolean, recusadoEm: number | null, agora: number): boolean {
  // Já é app: não tem o que instalar.
  if (jaInstalado) {
    return false
  }
  // Nunca recusou: pode convidar.
  if (recusadoEm === null) {
    return true
  }

  // Recusou: só volta a convidar depois de 30 dias.
  return agora - recusadoEm >= DIAS_SEM_CONVITE * 24 * 60 * 60 * 1000
}

/**
 * O aparelho é um iPhone ou iPad no Safari (onde a instalação é manual)?
 *
 * @param agenteDoNavegador O "user agent" do navegador. Ex.: navigator.userAgent
 * @returns true no Safari do iOS; false no Chrome/Firefox do iOS (que não instalam PWA) e nos outros aparelhos.
 */
export function ehSafariDoIphone(agenteDoNavegador: string): boolean {
  const ehIos = /iphone|ipad|ipod/i.test(agenteDoNavegador)
  // CriOS = Chrome do iOS; FxiOS = Firefox do iOS; EdgiOS = Edge do iOS.
  const outroNavegador = /crios|fxios|edgios/i.test(agenteDoNavegador)

  return ehIos && !outroNavegador
}

/**
 * Lê a data do último "Agora não", sem quebrar se o navegador bloquear o armazenamento
 * (ex.: janela anônima ou dados do site bloqueados).
 *
 * @returns A data em milissegundos, ou null.
 */
export function lerRecusa(): number | null {
  try {
    const valor = window.localStorage.getItem(CHAVE_RECUSA)
    const numero = valor === null ? Number.NaN : Number(valor)

    return Number.isFinite(numero) ? numero : null
  } catch {
    // Armazenamento bloqueado: trata como "nunca recusou".
    return null
  }
}

/**
 * Guarda o "Agora não" (data de hoje), sem quebrar se o armazenamento estiver bloqueado.
 *
 * @param agora O momento em milissegundos. Ex.: Date.now()
 */
export function guardarRecusa(agora: number): void {
  try {
    window.localStorage.setItem(CHAVE_RECUSA, String(agora))
  } catch {
    // Armazenamento bloqueado: o convite pode voltar na próxima visita (aceitável).
  }
}
