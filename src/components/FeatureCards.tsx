import { Link } from '@tanstack/react-router'
import type { FeatureCard } from '../../shared/content'
import { ArrowRightIcon } from './Icon'

export function FeatureCards({ features }: { features: FeatureCard[] }) {
  return (
    <section className="mx-auto -mt-20 max-w-6xl px-safe-4 sm:px-safe-6">
      <div className="relative z-10 grid gap-6 sm:grid-cols-3">
        {features.map((feature) => {
          const cardClassName =
            'flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-xl shadow-black/10 transition-shadow'
          const content = (
            <>
              <h3 className="text-xl">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-body">{feature.description}</p>
              <ArrowRightIcon className="mt-auto h-5 w-5 text-brand-gold" />
            </>
          )

          return feature.href ? (
            <Link
              key={feature.title}
              to={feature.href}
              className={`${cardClassName} hover:shadow-2xl`}
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
