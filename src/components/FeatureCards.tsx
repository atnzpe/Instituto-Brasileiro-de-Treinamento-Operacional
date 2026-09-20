import type { FeatureCard } from '../../shared/content'
import { ArrowRightIcon } from './Icon'

export function FeatureCards({ features }: { features: FeatureCard[] }) {
  return (
    <section className="mx-auto -mt-20 max-w-6xl px-4 sm:px-6">
      <div className="relative z-10 grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-xl shadow-black/10"
          >
            <h3 className="text-xl">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-body">{feature.description}</p>
            <ArrowRightIcon className="mt-auto h-5 w-5 text-brand-blue" />
          </div>
        ))}
      </div>
    </section>
  )
}
