/**
 * AVISO "FOTOS EXCLUSIVAS PARA FILIADOS" (16/10/2026).
 *
 * As fotos dos eventos do IBTO são privadas: muitos alunos e instrutores são
 * operadores de segurança, e foto com rosto ou distintivo na internet pode pôr
 * essas pessoas em risco. No site aparecem só o nome, a data e o local do
 * evento; as fotos ficam na plataforma, para filiados, com login. Este aviso
 * explica o porquê e leva para a página certa na plataforma.
 */
import { BotaoDeAcao } from '../BotaoDeAcao'

/**
 * @param destino O caminho na plataforma onde estão as fotos. Ex.: '/eventos/estande-de-tiro-pe'.
 * @returns O quadro com o aviso e o botão "Entrar para ver as fotos".
 */
export function AvisoFotosRestritas({ destino }: { destino: string }) {
  return (
    <section
      aria-labelledby="t-fotos-restritas"
      className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/85"
    >
      <h2 id="t-fotos-restritas" className="text-lg text-white">
        Fotos exclusivas para filiados
      </h2>
      <p className="mt-2 max-w-2xl">
        Muitos dos nossos alunos e instrutores são operadores de segurança. Por isso, as fotos dos treinamentos ficam na
        plataforma do IBTO, só para filiados, com login.
      </p>
      <div className="mt-4">
        <BotaoDeAcao acao={{ label: 'Entrar para ver as fotos', href: destino, naPlataforma: true }} />
      </div>
    </section>
  )
}
