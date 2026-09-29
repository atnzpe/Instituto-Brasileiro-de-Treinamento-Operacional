import { Link } from '@tanstack/react-router'
import type { FeatureCard } from '../../shared/content'
import { ArrowRightIcon } from './Icon'

export function FeatureCards({ features }: { features: FeatureCard[] }) {
  return (
    <section className="mx-auto -mt-20 max-w-6xl px-safe-4 sm:px-safe-6">
      <div className="relative z-10 grid gap-6 sm:grid-cols-3">
        {features.map((feature) => {
          const cardClassName =
            'flex flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-950/90 p-8 shadow-xl shadow-black/40 backdrop-blur transition-colors'
          const content = (
            <>
              <h3 className="text-xl text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-white/75">{feature.description}</p>
              <ArrowRightIcon className="mt-auto h-5 w-5 text-brand-gold-light" />
            </>
          )

          return feature.href ? (
            <Link
              key={feature.title}
              to={feature.href}
              className={`${cardClassName} hover:border-brand-gold-light/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold-light`}
            >
              {content}
            </Link>
          ) : (
            <div key={feature.title} className={cardClassName}>
              {content}
            </div>
          )
        })}
      </div>
    </section>
  )
}
