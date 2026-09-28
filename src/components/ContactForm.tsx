import { useMutation } from '@tanstack/react-query'
import { useId, useState, type FormEvent } from 'react'
import { submitContact } from '../lib/api'

const inputClassName =
  'mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-brand-gold-light focus:outline-none'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      setName('')
      setEmail('')
      setMessage('')
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate({ name, email, message, website })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-xl text-left">
      <div>
        <label htmlFor={nameId} className="block text-sm font-semibold text-white">
          Nome
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={200}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={emailId} className="block text-sm font-semibold text-white">
          E-mail
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={messageId} className="block text-sm font-semibold text-white">
          Mensagem
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          maxLength={5000}
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={inputClassName}
        />
      </div>

      {/* Anti-bot trap: off screen, out of the tab order and hidden from screen
          readers, so only bots fill it in (mensagem.php then sends nothing). */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Não preencha este campo
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-6 w-full rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold-light hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Enviando…' : 'Enviar mensagem'}
      </button>

      <p aria-live="polite" className="mt-4 min-h-5 text-sm">
        {mutation.isSuccess && (
          <span className="text-brand-gold-light">Mensagem enviada! Responderemos em breve.</span>
        )}
        {mutation.isError && <span className="text-red-400">{mutation.error.message}</span>}
      </p>
    </form>
  )
}
