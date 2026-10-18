/**
 * Links de tradução automática pelo Google Tradutor (#54 no site; #53 na
 * plataforma; decisão do Gleyson de 07/10/2026). Cópia da lógica da plataforma
 * (resources/js/lib/traducao.ts): se mudar lá, mude aqui também.
 *
 * Para que serve: o menu de idiomas do SITE (#54, mesma regra da plataforma,
 * #53) leva para a MESMA página traduzida pelo endereço "translate.goog" do
 * Google. Nenhum script do Google é carregado no nosso site.
 * É o mesmo método do site da CBSA (_traducao.php), escrito em TypeScript.
 *
 * Limites conhecidos:
 * - Telas com login NÃO usam isto: na página do Google a pessoa perde a sessão.
 * - O Google precisa abrir o site sozinho. No computador (localhost) e na
 *   homologação (que tem senha) o link é montado certo, mas a tradução só
 *   funciona num domínio público e sem senha (o site no ar, no lançamento).
 *
 * Fica separado do componente para poder ser testado sem navegador
 * (tests/traducao.test.ts).
 */

/** Código de cada idioma oferecido. 'pt' é a página original, sem tradução. */
export type CodigoIdioma = 'pt' | 'en' | 'es'

/** Dados de um idioma do menu. */
export type Idioma = {
    // Código que o Google entende. Ex.: 'es'.
    codigo: CodigoIdioma
    // Nome escrito NO PRÓPRIO idioma: quem fala espanhol procura "Español".
    nome: string
    // Texto lido pelo leitor de tela, também no próprio idioma.
    aviso: string
}

// Os três idiomas da regra do projeto (português é o padrão), na ordem do menu.
// Guardamos aqui, num lugar só, para o menu e os testes usarem a mesma lista.
export const IDIOMAS: readonly Idioma[] = [
    {
        codigo: 'pt',
        nome: 'Português',
        aviso: 'Português: página original, sem tradução',
    },
    {
        codigo: 'en',
        nome: 'English',
        aviso: 'English: automatic translation of this page (Google)',
    },
    {
        codigo: 'es',
        nome: 'Español',
        aviso: 'Español: traducción automática de esta página (Google)',
    },
]

/**
 * Transforma o domínio do site no "apelido" que o Google Tradutor usa.
 * Regra do Google: cada hífen vira dois hífens e cada ponto vira um hífen.
 *
 * @param host Domínio do site. Ex.: 'cursos-homolog.ib-to.org'
 * @returns Ex.: 'cursos--homolog-ib--to-org'
 */
export function hostGoogle(host: string): string {
    // 1) Cada hífen vira dois hífens. Tem que vir ANTES do passo 2: se viesse
    //    depois, os hífens criados a partir dos pontos também seriam dobrados.
    const comHifens = host.replaceAll('-', '--')

    // 2) Cada ponto vira um hífen.
    return comHifens.replaceAll('.', '-')
}

/**
 * Faz o caminho contrário da hostGoogle: descobre o nosso domínio a partir do
 * endereço da página traduzida. Serve para os links do menu, quando a pessoa
 * já está na página do Google.
 *
 * @param hostname Domínio atual, sem porta. Ex.: 'cursos--homolog-ib--to-org.translate.goog'
 * @returns Ex.: 'cursos-homolog.ib-to.org'. Fora do Google, devolve o próprio domínio.
 */
export function hostOriginal(hostname: string): string {
    // Fora da página do Google, o domínio já é o nosso: devolve como está.
    if (!hostname.endsWith('.translate.goog')) {
        return hostname
    }

    // Tira o final ".translate.goog" (ex.: sobra "cursos--homolog-ib--to-org").
    const apelido = hostname.slice(0, -'.translate.goog'.length)

    // Desfaz a regra do Google, separando primeiro nos hífens DUPLOS (que eram
    // hífens de verdade); dentro de cada pedaço, os hífens simples eram pontos.
    return apelido
        .split('--')
        .map((pedaco) => pedaco.replaceAll('-', '.'))
        .join('-')
}

/**
 * Tira da busca ("?...") os parâmetros que o Google acrescenta (_x_tr_...),
 * para o link do menu não levar sobras da tradução anterior.
 *
 * @param busca Parte "?..." do endereço. Ex.: '?aba=2&_x_tr_sl=pt&_x_tr_tl=es'
 * @returns Ex.: '?aba=2'. Se não sobrar nada, devolve ''.
 */
export function buscaSemGoogle(busca: string): string {
    // Lê os parâmetros da busca.
    const parametros = new URLSearchParams(busca)

    // Junta os nomes primeiro e apaga depois: apagar durante a leitura pularia itens.
    const doGoogle = [...parametros.keys()].filter((nome) =>
        nome.startsWith('_x_tr_'),
    )
    doGoogle.forEach((nome) => parametros.delete(nome))

    // Monta de novo; se ficou vazio, não coloca o "?".
    const resto = parametros.toString()

    return resto === '' ? '' : `?${resto}`
}

/**
 * Diz se o domínio é público, isto é, se o Google consegue chegar ao site nele.
 * Público = tem ponto, não é "localhost" e não é um IP (ex.: 127.0.0.1).
 *
 * @param host Domínio atual. Ex.: 'cursos.ib-to.org' (true) ou 'localhost:8000' (false)
 * @returns true quando o domínio pode ser aberto pelo Google
 */
export function traducaoDisponivel(host: string): boolean {
    // Tira a porta (ex.: "localhost:8000" vira "localhost") e passa para minúsculas.
    const semPorta = host.split(':')[0].toLowerCase()

    // Um IP versão 4 é feito só de números e pontos (ex.: 192.168.0.10).
    const ehIp = /^[\d.]+$/.test(semPorta)

    // Precisa ter ponto, não pode ser localhost nem IP; se algo falhar, é false.
    return semPorta.includes('.') && semPorta !== 'localhost' && !ehIp
}

/**
 * Monta o link da página atual traduzida para um idioma.
 *
 * @param idioma  Idioma de destino. Ex.: 'es'
 * @param host    Domínio do site. Ex.: 'cursos.ib-to.org'
 * @param caminho Caminho da página, com a busca. Ex.: '/cursos/tiro?aba=2'
 * @returns Ex.: 'https://cursos-ib--to-org.translate.goog/cursos/tiro?aba=2&_x_tr_sl=pt&_x_tr_tl=es&_x_tr_hl=es'
 */
export function linkTraducao(
    idioma: Exclude<CodigoIdioma, 'pt'>,
    host: string,
    caminho: string,
): string {
    // Garante que o caminho começa com "/" (ex.: "" vira "/", a página inicial).
    const caminhoCerto = '/' + caminho.replace(/^\/+/, '')

    // Se a página já tem busca (?aba=2), os parâmetros do Google entram com "&";
    // senão, entram com "?".
    const separador = caminhoCerto.includes('?') ? '&' : '?'

    // _x_tr_sl = idioma de origem (pt); _x_tr_tl = idioma de destino;
    // _x_tr_hl = idioma da barra do próprio Google Tradutor.
    const parametros = new URLSearchParams({
        _x_tr_sl: 'pt',
        _x_tr_tl: idioma,
        _x_tr_hl: idioma,
    }).toString()

    // Tira a porta do domínio (o Google não usa porta) e passa para minúsculas.
    const semPorta = host.split(':')[0].toLowerCase()

    // Junta tudo: apelido do domínio + ".translate.goog" + caminho + parâmetros.
    return `https://${hostGoogle(semPorta)}.translate.goog${caminhoCerto}${separador}${parametros}`
}

/**
 * Descobre o idioma atual pelo endereço da página.
 * Na página do Google o idioma vem em "_x_tr_tl"; no nosso site é sempre 'pt'.
 *
 * @param hostname Domínio sem porta. Ex.: 'cursos-ib--to-org.translate.goog'
 * @param busca    Parte "?..." do endereço. Ex.: '?_x_tr_sl=pt&_x_tr_tl=es'
 * @returns Código do idioma. Ex.: 'es'. Valor desconhecido vira 'pt'.
 */
export function idiomaAtual(hostname: string, busca: string): CodigoIdioma {
    // Fora da página do Google, a página é a original, em português.
    if (!hostname.endsWith('.translate.goog')) {
        return 'pt'
    }

    // Lê o idioma de destino que o Google recebeu.
    const destino = new URLSearchParams(busca).get('_x_tr_tl')

    // Só aceita um dos nossos idiomas; qualquer outro valor vira português.
    const conhecido = IDIOMAS.find((idioma) => idioma.codigo === destino)

    return conhecido ? conhecido.codigo : 'pt'
}
