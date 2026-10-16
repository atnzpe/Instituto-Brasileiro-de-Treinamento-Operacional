// Real content extracted from https://ib-to.org (Brizy-built site).
// Shared between the Vite/React frontend and the Bun/Redis cache backend
// so both sides work off exactly the same data shape.

export interface NavLink {
  label: string
  href: string
}

export const nav: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'Áreas de atuação', href: '/areas-de-atuacao' },
  { label: 'Quem somos', href: '/quem-somos' },
  // Blog e eventos (#61, B4): o conteúdo cadastrado na plataforma, mostrado no site.
  { label: 'Blog', href: '/blog' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Contato', href: '/contato' },
]

/** Um cartão de diferencial (linha "por que o IBTO" da página inicial). */
export interface FeatureCard {
  title: string
  description: string
  /** Página do site para onde o cartão leva. Sem link: o cartão só informa (e não mostra seta). */
  href?: string
  /** Foto real do IBTO no alto do cartão, com o texto alternativo para o leitor de tela. */
  image?: { src: string; alt: string }
}

/**
 * Um botão de ação (ex.: "Ver cursos").
 * naPlataforma = true: o href é um caminho DENTRO da plataforma de cursos (outro
 * endereço, do mesmo ambiente). Ex.: '/cursos' abre https://cursos-homolog.ib-to.org/cursos
 * no site de testes. Sem o campo: página deste site.
 */
export interface ChamadaParaAcao {
  label: string
  href: string
  naPlataforma?: boolean
}

/**
 * A PÁGINA INICIAL (reorganizada em 16/10/2026 com conceitos de web design):
 * uma mensagem por seção, nenhuma frase repetida, e toda ação levando a um
 * lugar real. Ordem: quem é e o que fazer (topo) → por que confiar
 * (diferenciais) → o que acontece agora (próximos cursos) → o que se aprende
 * (áreas) → novidades (blog) → quem está por trás (quem somos) → convite final.
 */
export interface HomeContent {
  hero: {
    eyebrow: string
    heading: string[]
    /** Uma frase dizendo para quem é. */
    subheading: string
    image: string
    /** A ação principal e a secundária. */
    ctas: ChamadaParaAcao[]
  }
  features: FeatureCard[]
  proximosCursos: {
    eyebrow: string
    heading: string
    intro: string
    cta: ChamadaParaAcao
  }
  areasTeaser: {
    eyebrow: string
    heading: string
    intro: string
    cta: ChamadaParaAcao
  }
  quemSomosTeaser: {
    eyebrow: string
    heading: string
    paragraph: string
    cta: ChamadaParaAcao
  }
  banner: {
    heading: string[]
    body: string
    ctas: ChamadaParaAcao[]
  }
}

export const home: HomeContent = {
  // TOPO: quem é, para quem é e o que fazer agora (uma ação principal e uma secundária).
  hero: {
    // Frase do próprio IBTO (perfil @ibto_pernambuco); não repete o banner do fim da página.
    eyebrow: 'Formação real. Resultado operacional.',
    heading: ['Instituto Brasileiro de', 'Treinamento Operacional'],
    subheading: 'Treinamento para civis, profissionais de segurança, policiais e militares.',
    image: '/images/hero.webp',
    ctas: [
      { label: 'Ver cursos', href: '/cursos', naPlataforma: true },
      { label: 'Fale com o IBTO', href: '/contato' },
    ],
  },
  // POR QUE O IBTO: três diferenciais reais, cada um com uma foto real que combina com o texto.
  // Só informam (sem link), então nenhum mostra seta:
  // antes, um levava a uma página ainda vazia (/rede-nacional) e os outros a lugar nenhum.
  features: [
    {
      title: 'Atuação Nacional',
      description:
        'Rede de instrutores, representantes e centros de treinamento em expansão por todo o território brasileiro.',
      image: {
        src: '/images/training/treinamentos-especializados.webp',
        alt: 'Instrutor do IBTO orienta um aluno em treinamento prático de retenção de arma.',
      },
    },
    {
      title: 'Metodologia de Instrução',
      description:
        'Demonstrar, explicar, praticar, corrigir e avaliar: o mesmo método em todos os treinamentos, para o aluno aprender de verdade.',
      image: {
        src: '/images/training/formacao-operacional.webp',
        alt: 'Instrutor do IBTO apresenta os princípios operacionais a uma turma em sala de aula.',
      },
    },
    {
      title: 'Certificado Verificável',
      description:
        'Todo certificado tem QR code: qualquer pessoa confere na hora, pela internet, se ele é verdadeiro.',
      image: {
        src: '/images/training/certificacao-e-credenciamento.webp',
        alt: 'Turma formada pelo IBTO posa com os certificados em campo de treinamento.',
      },
    },
  ],
  // O QUE ACONTECE AGORA: os próximos cursos, vindos da plataforma (a fonte única dos cursos).
  proximosCursos: {
    eyebrow: 'PRÓXIMOS CURSOS',
    heading: 'Inscrições abertas',
    intro: 'Presenciais e online, com inscrição, pagamento e certificado pela plataforma de cursos do IBTO.',
    cta: { label: 'Ver todos os cursos', href: '/cursos', naPlataforma: true },
  },
  // O QUE SE APRENDE: os emblemas das áreas, vindos da plataforma.
  areasTeaser: {
    eyebrow: 'ÁREAS DE ATUAÇÃO',
    heading: 'Do combate corpo a corpo ao APH tático',
    intro:
      'Com uma abordagem prática e orientada para resultados, buscamos oferecer conhecimentos aplicáveis a diferentes contextos.',
    cta: { label: 'Ver todas as áreas', href: '/areas-de-atuacao' },
  },
  // QUEM ESTÁ POR TRÁS: um parágrafo só (o texto completo fica em /quem-somos).
  quemSomosTeaser: {
    eyebrow: 'QUEM SOMOS',
    // Frase do anúncio oficial do IBTO em Pernambuco.
    heading: 'Treinamento sério, estruturado e orientado para resultados',
    paragraph:
      'O Instituto Brasileiro de Treinamento Operacional (IBTO) é uma organização dedicada à formação, capacitação e desenvolvimento de profissionais e cidadãos que buscam excelência em preparação operacional, defesa, segurança e sobrevivência.',
    cta: { label: 'Conheça o IBTO', href: '/quem-somos' },
  },
  // CONVITE FINAL: repete a ação principal no fim da rolagem (quem leu tudo está pronto para agir).
  banner: {
    heading: ['FORMAÇÃO OPERACIONAL', 'DE ALTO NÍVEL'],
    body: 'Capacitação para civis, profissionais de segurança, policiais e militares que buscam elevar seu nível de preparo técnico, físico e operacional.',
    ctas: [
      { label: 'Ver cursos', href: '/cursos', naPlataforma: true },
      { label: 'Fale com o IBTO', href: '/contato' },
    ],
  },
}

export interface TeamMember {
  slug: string
  name: string
  role: string
  photo: string
  bio: string[]
  sections: { title: string; items: string[] }[]
}

/**
 * Top banner of an inner page, from the original site (issue #20). `src` has
 * no extension: the files are `${src}-800.webp` and `${src}-1600.webp`.
 */
export interface PageBannerImage {
  src: string
  alt: string
}

export interface QuemSomosContent {
  banner: PageBannerImage
  intro: { heading: string; paragraphs: string[] }
  oQueFazemos: { heading: string; paragraphs: string[] }
  missaoVisaoValores: {
    missao: string
    visao: string
    valores: string[]
  }
  diretoria: TeamMember[]
}

export const quemSomos: QuemSomosContent = {
  banner: {
    src: '/images/banners/quem-somos',
    alt: 'Emblema do IBTO entre operadores equipados e uma bandeira do Brasil no alto de uma montanha, com o título "Quem somos: propósito, valores, missão".',
  },
  intro: {
    heading: 'Quem somos',
    paragraphs: [
      'O Instituto Brasileiro de Treinamento Operacional (IBTO) é uma organização dedicada à formação, capacitação e desenvolvimento de competências operacionais voltadas para civis, profissionais de segurança, policiais, militares e todos aqueles que buscam elevar seu nível de preparo técnico, físico e mental.',
      'Fundado por militares e ex-militares com experiência em combate treinamento operacional, defesa, segurança e gestão de instrução, o IBTO nasceu com um propósito claro: desenvolver capacidade real por meio de treinamento sério, estruturado e orientado para resultados.',
      'Acreditamos que conhecimento sem aplicação tem valor limitado. Por isso, nossos programas são construídos sobre três pilares fundamentais: preparação técnica, desenvolvimento operacional e aperfeiçoamento contínuo.',
      'Mais do que transmitir conhecimento, buscamos formar indivíduos mais preparados, disciplinados, resilientes e capazes de responder com eficiência aos desafios encontrados em diferentes ambientes e contextos.',
    ],
  },
  oQueFazemos: {
    heading: 'O que fazemos',
    paragraphs: [
      'O IBTO desenvolve programas de treinamento, capacitação, aperfeiçoamento profissional, seminários, workshops e atividades voltadas para o desenvolvimento de competências operacionais e técnicas.',
      'Nossas áreas de atuação abrangem diferentes segmentos relacionados à preparação operacional, defesa, segurança, sobrevivência, atendimento em situações críticas, desenvolvimento profissional e formação especializada.',
    ],
  },
  missaoVisaoValores: {
    missao:
      'Promover treinamentos de alto nível que contribuam para o desenvolvimento de profissionais e cidadãos mais preparados, disciplinados e capazes.',
    visao:
      'Ser referência nacional em treinamento operacional, reconhecida pela qualidade de seus programas, pela seriedade de sua metodologia e pelo compromisso com a excelência.',
    valores: [
      'Disciplina',
      'Integridade',
      'Responsabilidade',
      'Profissionalismo',
      'Meritocracia',
      'Excelência',
      'Evolução Contínua',
    ],
  },
  diretoria: [
    {
      slug: 'eduardo-lopes',
      name: 'Eduardo Lopes',
      role: 'Presidente',
      photo: '/images/team/eduardo-lopes.webp',
      bio: [
        'Fundador do Instituto Brasileiro de Treinamento Operacional (IBTO)',
        'Ex-integrante do Diretório Principal de Inteligência da Ucrânia (GUR)',
        'Ex-integrante da Guarda Nacional da Ucrânia',
        'Ex-integrante da 3ª Brigada de Assalto da Ucrânia',
        'Experiência em Operações Especiais, Inteligência e Combate Real',
      ],
      sections: [
        {
          title: 'Experiência Operacional',
          items: [
            'Operações Especiais',
            'Coordenação em Centros de Comando e Inteligência',
            'Participação em operações nas regiões de Kharkiv e Zaporizhzhia',
            'Missões de reconhecimento e coleta de inteligência',
            'Apoio a operações logísticas em zona de combate',
            'Integração de dados provenientes de drones, rádio e sistemas de comunicação',
            'Instrutor de Combate Corpo a Corpo reconhecido pela ONU e OTAN',
          ],
        },
        {
          title: 'Artes Marciais e Combate',
          items: [
            '22 anos de experiência em Artes Marciais',
            'Faixa Preta 4º Grau de Krav Maga (Itália)',
            'Faixa Preta 4º Grau de Kapap – Sistema de Combate Israelense (Itália)',
            'Faixa Preta 4º Dan de Karate (Japão)',
            'Faixa Preta 3º Dan de Kickboxing (Argentina)',
            'Faixa Preta 1º Dan de Taekwondo (Brasil)',
            'Faixa Preta de Sanda Kung Fu (Brasil)',
            'Instrutor de Muay Thai – 11º Khan',
          ],
        },
        {
          title: 'Formação de Instrutores',
          items: [
            'Instrutor de Defesa Pessoal – Nível Avançado',
            'Instrutor de Combate Corpo a Corpo Militar',
            'Instrutor de Imobilizações Táticas Israelenses',
            'Instrutor de Imobilizações Táticas Operacionais',
            'Instrutor de Kravot – Combate Israelense',
            'Instrutor de Combate com Faca',
          ],
        },
        {
          title: 'Treinamentos Operacionais',
          items: [
            'Operador de Armas de Fogo',
            'Tiro Tático I e II',
            'Tiro Tático Israelense',
            'Operador de Tonfa PR-24',
            'Combate com Bastão Curto e Bastão Longo',
            'Combate com Bastão Retrátil',
            'Sobrevivência Urbana',
            'Retenção e Contra-Retenção de Arma de Fogo',
            'Operações Especiais',
            'Topografia Militar',
            'Orientação e Navegação Terrestre',
            'Operador de Rádio Militar',
            'Engenharia de Drones',
            'Segurança e Defesa Cibernética',
          ],
        },
        {
          title: 'Resgate e Atendimento Tático',
          items: [
            'Bombeiro Profissional Civil',
            'APH Tático – Protocolo TCCC',
            'Supervisão de Resgate em Altura',
            'Supervisão de Resgate em Espaço Confinado',
          ],
        },
        {
          title: 'Formação Acadêmica',
          items: [
            'Graduado em Análise e Desenvolvimento de Sistemas',
            'Pós-Graduação em Cybersegurança',
            'Pós-Graduação em Arquitetura de Software',
            'Pós-Graduação em Ciência de Dados',
          ],
        },
        {
          title: 'Cargos e Representações',
          items: [
            'Representante Geral e Diretor Nacional da World Krav Maga Federation Ukraine',
            'Vice-presidente da Confederação Brasileira de Artes Marciais',
            'Vice-Presidente da Federação Catarinense de Artes Marciais',
            'Diretor de Divisão do Karate Otokojyuku Brasil/Japão',
            'Secretário Geral da Martial Arts International Confederation (Japão)',
          ],
        },
        {
          title: 'Reconhecimentos',
          items: [
            'Reconhecimento por Ação Heroica em Combate na Ucrânia',
            'Nomeado Instrutor Internacional de Krav Maga na Itália',
            'Nomeado Shibuchou (Diretor de Divisão) pelo Karate Otokojyuku no Japão',
            'Membro mais jovem da história a integrar a obra Grandes Mestres das Artes Marciais',
            'Biografia publicada por três edições consecutivas da principal obra sobre Artes Marciais do Brasil',
          ],
        },
      ],
    },
    {
      slug: 'julio-cesar-moura',
      name: 'Julio Cesar Moura',
      role: 'Vice-presidente',
      photo: '/images/team/julio-cesar-moura.webp',
      bio: [
        'Co-fundador do Instituto Brasileiro de Treinamento Operacional',
        'Major do Exército Brasileiro',
      ],
      sections: [
        {
          title: 'Graduação',
          items: [
            'Bacharel em ciências militares (ACADEMIA MILITAR DAS AGULHAS NEGRAS - AMAN)',
            'Bacharel em Educação Física (Escola de educação física do Exército - EsEFEx)',
            'Bacharel em Administração',
            'Bacharel em História',
            'Licenciatura Plena em Pedagogia',
            'Licenciatura Plena em Educação Física',
          ],
        },
        {
          title: 'Pós-Graduação Lato Sensu',
          items: [
            'Cinesiologia, biomecânica e treinamento físico',
            'Nutrição na prática esportiva',
            'Psicomotricidade',
            'Gestão em segurança pública',
            'História do Brasil',
            'História e cultura afro Brasileira',
            'Metodologia do ensino de geografia',
            'Ciências Militares',
            'MBA',
            'Segurança pública',
          ],
        },
        {
          title: 'Pós-Graduação Stictu Sensu',
          items: [
            'Curso de Mestrado em Educação Física - Biodinâmica do Movimento Humano',
          ],
        },
        {
          title: 'Cursos e Estágios Militares',
          items: [
            'Curso de formação de oficias – Infantaria (Academia Militar das Agulhas Negras – AMAN)',
            'Curso de Aperfeiçoamento de Oficiais (Escola de Aperfeiçoamento de Oficiais – EsAO)',
            'Curso de Instrutor de Educação Física (Escola de educação física do Exército - EsEFEx)',
            'Especialidade - Aperfeiçoamento em Operações Militares (Pós Graduação – EsAO)',
            'Especialidade - Instrutor de Educação Física (EsEFEx)',
            'Estágio de Adaptação a Vida na Selva',
            'Escalador Militar (MONTANHA)',
            'Estágio de Instrutor de Armamento Munição e Tiro',
            'Segurança de Autoridade (SEG AUT)',
            'Combate Corpo a Corpo',
            'Combate com Facas',
            'Caçador Militar',
            'Operações Aeromóveis',
            'Resgate',
            'Estágio de Atendimento Pré Hospitalar (Corpo de Bombeiros Militar de Rondônia - APH)',
            'Estágio de Atendimento Pré Hospitalar (Corpo de Bombeiros Militar do Rio de Janeiro - APH)',
            'Operações Urbanas (BOPE RJ)',
            'Estágio de Blindados',
            'Curso Básico de Instrutor de Tiro Tático (GUNSIGHT)',
            'Preparação de Instrutores e Monitores para missão no exterior',
            'Preparação de Instrutores e Monitores',
            'Piloto de Embarcação Pública (Marinha do Brasil)',
            'Tripulante de Embarcação Pública (Marinha do Brasil)',
          ],
        },
        {
          title: 'Artes Marciais e Combate',
          items: [
            'Contramestre de Capoeira',
            'Faixa preta 3º Dan de Kickboxing',
            'Faixa preta 2º Dan da Taekwondo',
            'Faixa Preta de Sanda',
            'Kru Yai de Muaythai',
            'Instrutor Nível G II de Krava Maga e Kapap',
          ],
        },
      ],
    },
    {
      slug: 'wagner-dabalos',
      name: 'Wagner Dabalos',
      role: 'Diretor Técnico',
      photo: '/images/team/wagner-dabalos.webp',
      bio: [
        'Ex-Militar do Exército Brasileiro, com sólida experiência em defesa pessoal, segurança e treinamento operacional. Atua como instrutor especializado em Krav Maga, Kapap e técnicas de proteção pessoal, dedicando-se à capacitação de civis e profissionais da área de segurança por meio de treinamentos fundamentados em técnicas modernas e eficazes.',
        'Possui mais de 8 anos de experiência contínua em artes marciais e sistemas de combate, sendo reconhecido pela busca constante por aperfeiçoamento técnico e atualização profissional.',
      ],
      sections: [
        {
          title: 'Graduações e Certificações',
          items: [
            'Instrutor G4 de Krav Maga e Kapap – WKMF (World Krav Maga Federation)',
            'Instrutor de Defesa Pessoal – COBRAM (Confederação Brasileira de Artes Marciais)',
          ],
        },
        {
          title: 'Formação Acadêmica',
          items: [
            'Cursando Gestão de Segurança Privada',
            'Universidade de Marília – UNIMAR',
          ],
        },
        {
          title: 'Experiência e Atuação',
          items: [
            'Instrutor de Defesa Pessoal',
            'Diretor de APH (Atendimento Pré-Hospitalar)',
            'Vice-Presidente da Equipe Vulcan',
          ],
        },
        {
          title: 'Áreas de Atuação',
          items: [
            'Defesa Pessoal',
            'Krav Maga e Kapap',
            'Imobilizações Táticas Israelenses',
            'Tiro Tático Israelense',
            'Retenção e Contra-Retenção de Armas',
            'Combate Corpo a Corpo',
            'Sobrevivência Urbana',
            'Combate com armas improvisadas',
            'Desarme de arma branca',
            'Manuseio de arma de fogo',
            'Combate com bastão curto e longo',
            'Técnicas de Controle e Condução',
            'Bombeiro civil',
            'Guarda vidas',
            'APH Tático',
            'Capacitação para atividade de Defesa Civil',
            'Psicologia do confronto',
            'Instrutor de defesa pessoal no curso de formação de cabos 2024 exército brasileiro',
            'Menção honrosa Exército brasileiro 2025',
            'Menção honrosa Marinha do Brasil 2026',
          ],
        },
      ],
    },
  ],
}

export interface ServiceTile {
  title: string
  image: string
}

export interface AreasDeAtuacaoContent {
  banner: PageBannerImage
  heading: string
  subheading: string
  services: ServiceTile[]
}

export const areasDeAtuacao: AreasDeAtuacaoContent = {
  banner: {
    src: '/images/banners/areas-de-atuacao',
    alt: 'Emblema do IBTO ao centro de seis cenas: defesa pessoal, tiro e armamento, sobrevivência, atendimento pré-hospitalar, segurança e proteção, e desenvolvimento profissional.',
  },
  heading: 'Áreas de Atuação',
  subheading: 'Matérias credenciadas no Instituto Brasileiro de Treinamento Operacional',
  services: [
    { title: 'Operador de Armas de Fogo', image: '/images/services/operador-armas-de-fogo.webp' },
    { title: 'Tactical Combat Casualty Care', image: '/images/services/tccc.webp' },
    { title: 'Sobrevivência Urbana', image: '/images/services/sobrevivencia-urbana.webp' },
    { title: 'Krav Maga', image: '/images/services/krav-maga.webp' },
    { title: 'Combate com Faca', image: '/images/services/combate-com-faca.webp' },
    { title: 'Selva', image: '/images/services/selva.webp' },
    { title: 'Tiro Tático', image: '/images/services/tiro-tatico.webp' },
    { title: 'APH Tático', image: '/images/services/aph-tatico.webp' },
    { title: 'Combate Corpo-a-corpo', image: '/images/services/combate-corpo-a-corpo.webp' },
    { title: 'Defesa Pessoal', image: '/images/services/defesa-pessoal.webp' },
    { title: 'Combate com Bastão', image: '/images/services/combate-com-bastao.webp' },
    { title: 'KAPAP', image: '/images/services/kapap.webp' },
    { title: 'Operações com Drones', image: '/images/services/operacoes-com-drones.webp' },
    { title: 'Imobilizações Táticas', image: '/images/services/imobilizacoes-taticas.webp' },
    { title: 'Close Quarters Battle', image: '/images/services/close-quarters-battle.webp' },
  ],
}

export interface ContatoContent {
  banner: PageBannerImage
  heading: string
  links: { label: string; href: string; icon: string }[]
}

export const contato: ContatoContent = {
  banner: {
    src: '/images/banners/contato',
    alt: 'Emblema do IBTO sobre um mapa-múndi, com equipamentos de comunicação e os ícones de telefone, e-mail e localização.',
  },
  heading: 'Contato',
  links: [
    {
      label: 'WhatsApp',
      href: 'https://wa.me/5519983669878?text=Olá%20vi%20o%20site%20ib-to.org%20e%20gostaria%20de%20mais%20informações',
      icon: '/images/social/whatsapp.webp',
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=100089250625788',
      icon: '/images/social/facebook.webp',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/i.b.t.o_/',
      icon: '/images/social/instagram.webp',
    },
  ],
}

// Directory of affiliated representatives/instructors/monitors by state,
// modeled after https://www.wkmf.com.br/monitoresfiliados and
// /instrutoresfiliados (a sister federation's site). No real entries yet —
// `representantes` stays empty until IBTO provides the actual roster
// (name, role, city/state, phone, optional photo) to fill it in.
export interface Representative {
  name: string
  role: string
  city: string
  state: string
  phone?: string
  photo?: string
  instrutorResponsavel?: string
}

export interface RedeNacionalContent {
  heading: string
  subheading: string
  representantes: Representative[]
}

export const redeNacional: RedeNacionalContent = {
  heading: 'Rede Nacional',
  subheading:
    'Representantes, instrutores, monitores e centros de treinamento credenciados pelo IBTO em todo o Brasil.',
  representantes: [],
}

// In-person trainings shown on /cursos (online courses will live on a separate
// platform, linked via `onlinePlatform`). Optional fields stay unset when the
// poster doesn't give them — never fill them with guessed data.
export type CourseAccess = 'gratuito-filiados' | 'pago-publico' | 'pago-filiados'

export interface CourseAccessModel {
  id: CourseAccess
  label: string
  badge: string
  description: string
}

// `status` is the manual state; once `endsAt` (last day of the class,
// YYYY-MM-DD) has passed, the page shows "Encerrado" on its own — see
// src/lib/courseStatus.ts. A new class of the same course reuses the entry:
// update the dates, `endsAt`, `status` and `poster`.
export type CourseStatus = 'aberto' | 'em-breve' | 'encerrado'

export interface CourseModule {
  title: string
  instructor: string
}

export interface Course {
  slug: string
  title: string
  format?: 'Online' | 'Presencial'
  summary?: string
  access?: CourseAccess
  status?: CourseStatus
  schedule?: string
  endsAt?: string
  poster?: { src: string; alt: string }
  location?: string
  instructor?: string
  workload?: string
  price?: string
  modules?: CourseModule[]
  topics?: string[]
  includes?: string[]
  whatsapp?: string[]
}

export interface CursosContent {
  heading: string
  subheading: string
  accessModels: CourseAccessModel[]
  cursos: Course[]
  // Online courses will live on a separate platform; `href` stays unset until
  // that platform has a public address, and the page shows "Em breve" meanwhile.
  onlinePlatform: { title: string; description: string; label: string; href?: string }
  footnote: string
  cta: { label: string; href: string }
}

export const cursos: CursosContent = {
  heading: 'Cursos e Treinamentos',
  subheading:
    'Treinamentos, cursos e seminários presenciais do IBTO em defesa pessoal, combate, tiro, sobrevivência e atendimento tático.',
  accessModels: [
    {
      id: 'gratuito-filiados',
      label: 'Gratuito e privado aos filiados',
      badge: 'Gratuito · Filiados',
      description: 'Sem custo, disponível apenas para filiados do IBTO.',
    },
    {
      id: 'pago-publico',
      label: 'Pago e aberto ao público',
      badge: 'Pago · Público',
      description: 'Com investimento, aberto a qualquer pessoa interessada.',
    },
    {
      id: 'pago-filiados',
      label: 'Pago e restrito aos filiados',
      badge: 'Pago · Filiados',
      description: 'Com investimento, disponível apenas para filiados do IBTO.',
    },
  ],
  cursos: [
    // A Formação de Instrutores NÃO aparece no site (decisão do Gleyson,
    // 14/10/2026): é um curso FECHADO, só para quem o IBTO matricula, e fica
    // apenas na plataforma de cursos. Por isso ela não está nesta lista.
    {
      slug: 'combate-corpo-a-corpo',
      title: 'Treinamento para Combate Corpo a Corpo',
      format: 'Presencial',
      summary: 'Treinamento de combate corpo a corpo conduzido pelo instrutor Trinca.',
      access: 'pago-publico',
      status: 'aberto',
      schedule: '10 de outubro de 2026 · 09h às 13h',
      endsAt: '2026-10-10',
      location: 'Recife',
      instructor: 'Trinca — Especialista em Artes Marciais',
      price: 'R$ 250',
      includes: ['Certificado', 'Camisa do evento', 'E muito mais'],
      whatsapp: ['(81) 99162-3046', '(81) 99809-8742'],
    },
    {
      slug: 'combate-com-faca',
      title: 'Treinamento para Combate com Faca',
      format: 'Presencial',
      summary: 'Treinamento de combate com faca conduzido pelo instrutor Marcelo.',
      access: 'pago-publico',
      status: 'aberto',
      schedule: '10 de outubro de 2026 · 14h às 18h',
      endsAt: '2026-10-10',
      location: 'Recife',
      instructor: 'Marcelo — Especialista em Kali',
      price: 'R$ 250',
      includes: ['Certificado', 'Camisa do evento', 'E muito mais'],
      whatsapp: ['(81) 99162-3046', '(81) 99809-8742'],
    },
    {
      slug: 'seminario-bastao-tatico',
      title: 'Seminário Bastão Tático',
      format: 'Presencial',
      summary: 'Domine. Defenda. Proteja. Seminário de bastão tático e proteção pessoal.',
      access: 'pago-publico',
      status: 'aberto',
      schedule: 'Sem data fixa · turmas sob consulta pelo WhatsApp',
      location: 'Caxias do Sul - RS (sede da FIGAM)',
      instructor: 'Mestre Rodrigo dos Santos — Faixa preta em Krav Maga, Kapap e Kenjutsu',
      price: 'R$ 150',
      topics: [
        'Fundamentos do bastão tático',
        'Defesa pessoal',
        'Técnicas de controle e imobilização',
        'Aplicações práticas para segurança e proteção pessoal',
        'Treinamento técnico e tático',
      ],
      includes: ['Bastão tático', 'Certificado de participação'],
      whatsapp: ['(54) 99662-7066'],
    },
    {
      slug: 'sobrevivencia-urbana-nivel-1',
      title: 'Curso Sobrevivência Urbana — Nível 1',
      format: 'Presencial',
      summary:
        'Testes de resistência física e mental para avaliar todo o conhecimento adquirido no decorrer das instruções. Focado na realidade urbana hostil.',
      status: 'em-breve',
      schedule: 'Data a definir',
      workload: '50 horas',
      topics: [
        'Combate corpo a corpo',
        'Combate e defesa com facas',
        'Sobrevivência urbana',
        'Arma curta e longa',
        'Preparação para emergências',
        'Preparação física e mental',
      ],
    },
  ],
  onlinePlatform: {
    // Presenciais e online: a seção mostra os cursos publicados na plataforma (#52).
    title: 'Na plataforma de cursos',
    // A plataforma de cursos está no ar (#48, 15/10/2026); o botão leva ao catálogo dela.
    description:
      'Os cursos do IBTO ficam na nossa plataforma: aulas em vídeo, apostilas, chamada dos encontros presenciais e certificado com QR code para conferência.',
    label: 'Acessar a plataforma de cursos',
  },
  footnote: 'Novos treinamentos em breve.',
  cta: { label: 'Tenho interesse', href: '/contato' },
}

export const siteContent = { nav, home, quemSomos, areasDeAtuacao, contato, redeNacional, cursos }
export type SiteContent = typeof siteContent
export type PageSlug =
  | 'home'
  | 'quem-somos'
  | 'areas-de-atuacao'
  | 'contato'
  | 'rede-nacional'
  | 'cursos'

export function getPageContent(slug: PageSlug) {
  switch (slug) {
    case 'home':
      return home
    case 'quem-somos':
      return quemSomos
    case 'areas-de-atuacao':
      return areasDeAtuacao
    case 'contato':
      return contato
    case 'rede-nacional':
      return redeNacional
    case 'cursos':
      return cursos
  }
}
