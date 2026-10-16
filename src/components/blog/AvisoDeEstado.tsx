/**
 * AVISO DE ESTADO das páginas do blog e dos eventos (#61): o que aparece
 * enquanto carrega, quando a plataforma não responde, ou quando não há nada.
 * Tom calmo: nunca uma tela quebrada nem mensagem técnica.
 */

/** Os estados possíveis. */
export type Estado = 'carregando' | 'erro' | 'vazio' | 'nao-encontrado'

// O texto de cada estado.
const TEXTOS: Record<Estado, string> = {
  carregando: 'Carregando…',
  erro: 'Não conseguimos carregar agora. Tente de novo em alguns minutos.',
  vazio: 'Ainda não há publicações aqui. Volte em breve.',
  'nao-encontrado': 'Esta publicação não existe ou saiu do ar.',
}

/**
 * Desenha o aviso.
 *
 * @param estado Qual aviso mostrar. Ex.: 'carregando'
 * @returns Um parágrafo centralizado. "role=status" faz o leitor de tela anunciar a mudança.
 */
export function AvisoDeEstado({ estado }: { estado: Estado }) {
  return (
    <p role="status" className="mx-auto max-w-md py-12 text-center text-white/70">
      {TEXTOS[estado]}
    </p>
  )
}
