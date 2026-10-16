/**
 * FAIXA "INSTALE O APP DO IBTO" (PWA, 16/10/2026).
 *
 * Aparece embaixo da tela, 3 segundos depois de abrir o site, com o emblema e
 * os botões "Instalar" e "Agora não". Não é uma janela que bloqueia a página:
 * a pessoa pode ignorar e continuar navegando.
 * - Android, computador (Chrome/Edge): o botão "Instalar" abre a confirmação do
 *   próprio navegador.
 * - iPhone/iPad (Safari): não existe botão de instalar; a faixa ensina o caminho.
 * - Já instalado, ou "Agora não" nos últimos 30 dias: a faixa não aparece.
 * Regras em lib/instalar.ts.
 */
import { useEffect, useState } from 'react'
import {
  ESPERA_PARA_CONVIDAR_MS,
  ehSafariDoIphone,
  guardarRecusa,
  lerRecusa,
  podeConvidar,
} from '../lib/instalar'

/**
 * O evento que o Chrome/Edge dispara quando o site pode ser instalado. Ele ainda
 * não tem tipo oficial no TypeScript, por isso a descrição aqui.
 */
interface EventoDeInstalacao extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * O site está aberto como app instalado?
 *
 * @returns true no app (Android, computador ou iPhone).
 */
function abertoComoApp(): boolean {
  // display-mode standalone: aberto pelo ícone do app. navigator.standalone: o mesmo, no iPhone.
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

/**
 * @returns A faixa de convite, ou nada (já instalado, recusado há pouco ou o navegador não permite).
 */
export function ConviteInstalar() {
  // O evento guardado para abrir a confirmação do navegador (Chrome/Edge).
  const [eventoGuardado, setEventoGuardado] = useState<EventoDeInstalacao | null>(null)
  // Qual faixa mostrar: a com botão, a com o passo a passo do iPhone, ou nenhuma.
  const [modo, setModo] = useState<'botao' | 'iphone' | null>(null)

  useEffect(() => {
    // Já instalado ou recusado há menos de 30 dias: não convida.
    if (!podeConvidar(abertoComoApp(), lerRecusa(), Date.now())) {
      return
    }

    let relogio: number | undefined

    // iPhone/iPad no Safari: mostra o passo a passo depois de 3 segundos.
    if (ehSafariDoIphone(navigator.userAgent)) {
      relogio = window.setTimeout(() => setModo('iphone'), ESPERA_PARA_CONVIDAR_MS)

      return () => window.clearTimeout(relogio)
    }

    // Chrome/Edge: o navegador avisa quando dá para instalar; guardamos o aviso
    // (preventDefault impede a janelinha automática dele) e mostramos a nossa faixa.
    const aoPoderInstalar = (evento: Event) => {
      evento.preventDefault()
      setEventoGuardado(evento as EventoDeInstalacao)
      relogio = window.setTimeout(() => setModo('botao'), ESPERA_PARA_CONVIDAR_MS)
    }
    // Instalou (pelo nosso botão ou pelo menu do navegador): some a faixa.
    const aoInstalar = () => setModo(null)

    window.addEventListener('beforeinstallprompt', aoPoderInstalar)
    window.addEventListener('appinstalled', aoInstalar)

    // Saiu do site: desliga os "ouvintes" e o relógio.
    return () => {
      window.removeEventListener('beforeinstallprompt', aoPoderInstalar)
      window.removeEventListener('appinstalled', aoInstalar)
      window.clearTimeout(relogio)
    }
  }, [])

  /** "Instalar": abre a confirmação do navegador. */
  const instalar = async () => {
    // Sem o evento guardado (não deveria acontecer): só fecha a faixa.
    if (!eventoGuardado) {
      setModo(null)
      return
    }
    await eventoGuardado.prompt()
    const escolha = await eventoGuardado.userChoice
    // Cancelou a confirmação do navegador: conta como "Agora não" (não insiste por 30 dias).
    if (escolha.outcome === 'dismissed') {
      guardarRecusa(Date.now())
    }
    setEventoGuardado(null)
    setModo(null)
  }

  /** "Agora não": esconde e guarda a data, para não convidar de novo por 30 dias. */
  const agoraNao = () => {
    guardarRecusa(Date.now())
    setModo(null)
  }

  // Nada a mostrar.
  if (modo === null) {
    return null
  }

  return (
    // aria-live="polite": o leitor de tela anuncia a faixa sem interromper o que a pessoa ouvia.
    // pb-safe-4 / px-safe-4: respeita a barra de gestos e o entalhe do celular.
    <aside
      aria-live="polite"
      aria-label="Instalar o app do IBTO"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-950/95 px-safe-4 pt-4 pb-safe-4 backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
        <img src="/icons/icon-192.png" alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="flex-1 text-sm">
          <p className="font-semibold text-white">Instale o app do IBTO</p>
          {modo === 'iphone' ? (
            <p className="text-white/75">
              No Safari, toque em <strong>Compartilhar</strong> (o quadrado com a seta) e depois em{' '}
              <strong>Adicionar à Tela de Início</strong>.
            </p>
          ) : (
            <p className="text-white/75">Abre mais rápido, direto da tela do celular, e funciona até sem internet.</p>
          )}
        </div>
        <div className="flex gap-3">
          {/* No iPhone não há botão de instalar: só "Entendi" (que também conta como recusa por 30 dias). */}
          {modo === 'botao' && (
            <button
              type="button"
              onClick={instalar}
              className="min-h-11 rounded-full bg-brand-gold px-5 text-sm font-semibold text-white hover:bg-brand-gold-light hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light"
            >
              Instalar
            </button>
          )}
          <button
            type="button"
            onClick={agoraNao}
            className="min-h-11 rounded-full border border-white/30 px-5 text-sm text-white hover:border-brand-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light"
          >
            {modo === 'iphone' ? 'Entendi' : 'Agora não'}
          </button>
        </div>
      </div>
    </aside>
  )
}
