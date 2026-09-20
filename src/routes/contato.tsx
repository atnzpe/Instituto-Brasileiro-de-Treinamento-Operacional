import { createFileRoute } from '@tanstack/react-router'
import { ContactLinks } from '../components/ContactLinks'
import { useContatoContent } from '../hooks/useContent'

export const Route = createFileRoute('/contato')({
  component: ContatoPage,
})

function ContatoPage() {
  const { data } = useContatoContent()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-4xl sm:text-5xl">{data.heading}</h1>
      <div className="mt-12">
        <ContactLinks links={data.links} />
      </div>
    </div>
  )
}
