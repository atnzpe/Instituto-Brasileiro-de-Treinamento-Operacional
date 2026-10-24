/**
 * PÁGINA REDE NACIONAL (#11, pedido do Mestre Eduardo em 23/10/2026).
 *
 * Mostra a foto personalizada dos monitores e instrutores credenciados pelo
 * IBTO, organizados por estado. Modelo de referência: as páginas de
 * instrutores e monitores da WKMF, com a cara e a objetividade do IBTO:
 * - duas abas, Instrutores e Monitores, cada uma com endereço próprio
 *   (?aba=instrutores ou ?aba=monitores), para o link ir direto;
 * - no topo, a grade das 27 siglas: clicar leva ao bloco do estado; estado
 *   sem ninguém fica apagado;
 * - os cartões por estado (A→Z) e, dentro dele, pela hierarquia;
 * - filtro por área de atuação (pedido de 16/10/2026), também no endereço
 *   (?area=Krav%20Maga), para mandar o link já filtrado.
 *
 * Os dados vêm da plataforma (API pública, só de quem autorizou a imagem).
 * Sem resposta da plataforma, a página mostra "Rede em expansão" e o resto do
 * site segue normal. Contato só pela página de Contato do IBTO.
 */
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CredenciadoCard } from '../components/CredenciadoCard'
import { useRedeNacionalContent } from '../hooks/useContent'
import { areasDaLista, buscarRedeNacional, contarPorUf, filtrarPorArea } from '../lib/plataforma'
import { redeNacional } from '../../shared/content'

// O título da aba do navegador e do compartilhamento.
const TITULO = `${redeNacional.heading} | Instituto Brasileiro de Treinamento Operacional`

/** As duas abas da página. */
type Aba = 'instrutores' | 'monitores'

/**
 * Lê a aba e a área do endereço e LIMPA os valores: qualquer coisa diferente
 * de 'monitores' vira 'instrutores' (a aba padrão); área vazia ou estranha
 * (não é texto, ou tem mais de 60 letras) vira "sem filtro".
 *
 * @param busca Os parâmetros do endereço. Ex.: { aba: 'monitores', area: 'Kapap' }
 * @returns A aba válida e a área (ou undefined). Ex.: { aba: 'monitores', area: 'Kapap' }
 */
function buscaLimpa(busca: Record<string, unknown>): { aba: Aba; area?: string } {
  const aba: Aba = busca.aba === 'monitores' ? 'monitores' : 'instrutores'
  // Área só se for um texto curto; senão, o filtro fica desligado.
  const area = typeof busca.area === 'string' && busca.area.trim() !== '' && busca.area.length <= 60 ? busca.area.trim() : undefined

  return area ? { aba, area } : { aba }
}

export const Route = createFileRoute('/rede-nacional')({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: 'description', content: redeNacional.subheading },
      { property: 'og:title', content: TITULO },
      { property: 'og:description', content: redeNacional.subheading },
      { property: 'og:url', content: 'https://ib-to.org/rede-nacional' },
    ],
  }),
  validateSearch: buscaLimpa,
  component: RedeNacionalPage,
})

/**
 * A página inteira: título, abas, grade de estados e os cartões.
 *
 * @returns A página.
 */
function RedeNacionalPage() {
  // Título e subtítulo (editáveis no conteúdo do site).
  const { data: textos } = useRedeNacionalContent()
  // A aba e a área escolhidas (já limpas pelo validateSearch).
  const { aba, area } = Route.useSearch()
  // A lista da plataforma; guardada por 5 minutos (a plataforma também guarda por 5).
  const { data: rede, isPending } = useQuery({
    queryKey: ['plataforma', 'rede-nacional'],
    queryFn: buscarRedeNacional,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Os estados da aba escolhida (vazio enquanto carrega ou se a plataforma falhar).
  const daAba = rede ? rede[aba] : []
  // As áreas que existem nesta aba, para as etiquetas do filtro.
  const areas = areasDaLista(daAba)
  // A área só filtra se existir nesta aba (um link antigo com área sumida mostra todos).
  const areaAtiva = area && areas.includes(area) ? area : null
  // Os estados depois do filtro de área (é o que a grade e os cartões mostram).
  const estados = filtrarPorArea(daAba, areaAtiva)
  // Quantas pessoas por estado, para a grade de siglas.
  const contagem = contarPorUf(estados)
  // O rótulo da aba no singular/plural, para os textos. Ex.: 'instrutores'.
  const nomeDaAba = aba === 'instrutores' ? 'instrutores' : 'monitores'

  return (
    <div className="bg-ink px-safe-4 py-16 sm:px-safe-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl text-white sm:text-5xl">{textos.heading}</h1>
          <p className="mt-4 text-brand-gold-light">{textos.subheading}</p>
        </div>

        {/* ABAS: links de verdade (o endereço muda), com a atual marcada para o leitor de tela. */}
        <nav aria-label="Instrutores ou monitores" className="mt-10 flex justify-center gap-2">
          {(['instrutores', 'monitores'] as const).map((opcao) => {
            const atual = opcao === aba
            // Quantas pessoas a aba tem (só depois de carregar).
            const total = rede ? rede[opcao].reduce((soma, estado) => soma + estado.pessoas.length, 0) : null

            return (
              <Link
                key={opcao}
                to="/rede-nacional"
                search={{ aba: opcao }}
                aria-current={atual ? 'page' : undefined}
                className={`min-h-11 rounded-full border px-5 py-2 text-sm font-semibold tracking-wide uppercase ${
                  atual
                    ? 'border-brand-gold-light bg-brand-gold-light text-ink'
                    : 'border-white/20 text-white/80 hover:border-brand-gold-light'
                }`}
              >
                {opcao === 'instrutores' ? 'Instrutores' : 'Monitores'}
                {total !== null && ` (${total})`}
              </Link>
            )
          })}
        </nav>

        {/* FILTRO POR ÁREA: etiquetas; "Todas" desliga. Só aparece com 2 áreas ou mais. */}
        {areas.length > 1 && (
          <nav aria-label="Áreas de atuação" className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
            {[null, ...areas].map((opcao) => {
              const atual = opcao === areaAtiva

              return (
                <Link
                  key={opcao ?? 'todas'}
                  to="/rede-nacional"
                  search={opcao ? { aba, area: opcao } : { aba }}
                  aria-current={atual ? 'true' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm ${
                    atual
                      ? 'border-brand-gold-light bg-brand-gold-light/15 text-brand-gold-light'
                      : 'border-white/15 text-white/70 hover:border-brand-gold-light'
                  }`}
                >
                  {opcao ?? 'Todas as áreas'}
                </Link>
              )
            })}
          </nav>
        )}

        {/* GRADE DOS ESTADOS: as 27 siglas; com gente = link para o bloco; sem ninguém = apagada. */}
        {rede && (
          <nav aria-label="Estados" className="mx-auto mt-8 grid max-w-3xl grid-cols-6 gap-2 sm:grid-cols-9">
            {Object.entries(rede.estados).map(([uf, nome]) =>
              contagem[uf] ? (
                <a
                  key={uf}
                  href={`#uf-${uf}`}
                  title={`${nome}: ${contagem[uf]} ${nomeDaAba}`}
                  className="flex min-h-11 items-center justify-center rounded-md border border-brand-gold-light/60 text-sm font-semibold text-brand-gold-light hover:bg-brand-gold-light hover:text-ink"
                >
                  {uf}
                </a>
              ) : (
                <span
                  key={uf}
                  title={`${nome}: nenhum credenciado ainda`}
                  className="flex min-h-11 items-center justify-center rounded-md border border-white/10 text-sm text-white/30"
                >
                  {uf}
                </span>
              ),
            )}
          </nav>
        )}

        <div className="mt-12">
          {isPending ? (
            // Carregando: aviso curto (anunciado pelo leitor de tela).
            <p role="status" className="text-center text-white/70">
              Carregando a Rede Nacional…
            </p>
          ) : estados.length === 0 ? (
            // Ninguém nesta aba (ou a plataforma não respondeu): a mensagem de expansão.
            <p className="mx-auto max-w-md text-center text-white/70">
              {areaAtiva
                ? `Nenhum dos ${nomeDaAba} credenciados atua em ${areaAtiva} ainda.`
                : `Rede em expansão: em breve, os ${nomeDaAba} credenciados pelo IBTO aparecerão aqui, organizados por estado.`}
            </p>
          ) : (
            <div className="space-y-12">
              {estados.map((estado) => (
                // scroll-mt: ao clicar na sigla, o título do estado não fica escondido sob o menu fixo.
                <section key={estado.uf} id={`uf-${estado.uf}`} className="scroll-mt-28">
                  <h2 className="border-b border-brand-gold-light/30 pb-2 text-2xl text-white">
                    {estado.estado}{' '}
                    <span className="text-base text-brand-gold-light">({estado.uf})</span>
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {estado.pessoas.map((pessoa) => (
                      <CredenciadoCard key={pessoa.foto_url} pessoa={pessoa} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* CONTATO: sempre pelo IBTO (os credenciados não têm telefone publicado). */}
        <div className="mt-16 text-center">
          <p className="text-white/70">Quer falar com um credenciado da sua região?</p>
          <Link
            to="/contato"
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-gold-light px-7 py-2 font-semibold text-ink"
          >
            Falar com o IBTO
          </Link>
        </div>
      </div>
    </div>
  )
}
