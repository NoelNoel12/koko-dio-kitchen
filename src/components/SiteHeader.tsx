import { site } from "@/data/site"

export function SiteHeader() {
  return (
    <header
      id="top"
      className="page-gutter mx-auto flex w-full max-w-[1100px] items-center pt-[max(0.75rem,env(safe-area-inset-top))] pb-1"
    >
      <a href="#top" className="-ml-1.5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-1.5">
        {/* Pre-sized 1x/2x files from scripts/prepare-assets.mjs, so the image optimizer adds nothing here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-header.webp"
          srcSet="/brand/logo-header.webp 82w, /brand/logo-header@2x.webp 163w"
          sizes="41px"
          width={41}
          height={60}
          alt={site.name}
          className="h-[60px] w-auto"
        />
      </a>
    </header>
  )
}
