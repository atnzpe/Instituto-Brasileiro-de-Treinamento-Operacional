import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import { contato } from '../../shared/content'
import { ConviteInstalar } from '../components/ConviteInstalar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

const SITE_NAME = 'Instituto Brasileiro de Treinamento Operacional'
const SITE_URL = 'https://ib-to.org'
const DEFAULT_DESCRIPTION =
  'Instituto Brasileiro de Treinamento Operacional (IBTO) — formação operacional de alto nível para civis, profissionais de segurança, policiais e militares.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: SITE_NAME },
      { name: 'description', content: DEFAULT_DESCRIPTION },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: SITE_NAME },
      { property: 'og:description', content: DEFAULT_DESCRIPTION },
      { property: 'og:url', content: `${SITE_URL}/` },
      { 'script:ld+json': ldJson() },
    ],
  }),
  component: RootLayout,
})

function ldJson() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    alternateName: 'IBTO',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/images/logo.webp`,
    image: `${SITE_URL}/images/hero.webp`,
    description: DEFAULT_DESCRIPTION,
    address: { '@type': 'PostalAddress', addressCountry: 'BR' },
    sameAs: contato.links.map((link) => link.href),
  }
}

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeadContent />
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      {/* bg-ink no <main>: em página curta (ex.: "não encontrado"), o fundo escuro vai até
          o rodapé, sem a faixa branca que aparecia antes (ajuste de 16/10/2026). */}
      <main id="main-content" className="flex-1 bg-ink">
        <Outlet />
      </main>
      <Footer />
      {/* Convite para instalar o app (PWA): faixa embaixo, 3 s depois de abrir; some se já instalado ou recusado. */}
      <ConviteInstalar />
    </div>
  )
}
