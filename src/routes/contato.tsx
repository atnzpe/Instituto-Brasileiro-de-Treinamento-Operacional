import { createFileRoute } from '@tanstack/react-router'
import { contato } from '../../shared/content'
import { ContactForm } from '../components/ContactForm'
import { ContactLinks } from '../components/ContactLinks'
import { PageBanner } from '../components/PageBanner'
import { useContatoContent } from '../hooks/useContent'

const TITLE = `${contato.heading} | Instituto Brasileiro de Treinamento Operacional`
const DESCRIPTION =
  'Fale com o IBTO por WhatsApp, redes sociais ou pelo formulário de contato — dúvidas, parcerias e informações sobre treinamentos.'

export const Route = createFileRoute('/contato')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: 'https://ib-to.org/contato' },
    ],
  }),
  component: ContatoPage,
})

function ContatoPage() {
  const { data } = useContatoContent()

  return (
    <>
      <PageBanner banner={data.banner} />
      <div className="bg-ink px-4 py-16 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl text-white sm:text-5xl">{data.heading}</h1>

          <div className="mt-12">
            <ContactForm />
          </div>

          <div className="mt-16 border-t border-white/10 pt-12">
            <p className="text-sm font-semibold tracking-[0.2em] text-brand-gold-light">
              OU FALE PELAS REDES
            </p>
            <div className="mt-8">
              <ContactLinks links={data.links} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
