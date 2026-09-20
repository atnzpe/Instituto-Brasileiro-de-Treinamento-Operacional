import { createFileRoute, redirect } from '@tanstack/react-router'

// QA_REPORT.html P3: /services was the legacy URL on the old site, kept
// working so old bookmarks/backlinks don't 404.
export const Route = createFileRoute('/services')({
  beforeLoad: () => {
    throw redirect({ to: '/areas-de-atuacao' })
  },
})
