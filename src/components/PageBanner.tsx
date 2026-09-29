import type { PageBannerImage } from '../../shared/content'

// Banners from the original site (issue #20). The artwork already carries
// the emblem and the page name, so it is shown whole (no crop) above the
// page's <h1>; on a phone it is ~150px tall and doesn't push the heading away.
export function PageBanner({ banner }: { banner: PageBannerImage }) {
  return (
    <div className="bg-ink">
      <img
        src={`${banner.src}-1600.webp`}
        srcSet={`${banner.src}-800.webp 800w, ${banner.src}-1600.webp 1600w`}
        sizes="100vw"
        width={1600}
        height={640}
        alt={banner.alt}
        fetchPriority="high"
        className="mx-auto block h-auto w-full max-w-[1600px]"
      />
    </div>
  )
}
