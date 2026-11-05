import { site } from "@/data/site"
import { instagramUrl, whatsappUrl } from "@/lib/contact"
import { WhatsAppButton } from "@/components/WhatsAppButton"

export function SiteFooter() {
  const instagram = instagramUrl()

  return (
    <footer className="mt-10 border-t-[2.5px] border-ink bg-orange sm:mt-16">
      <div className="page-gutter mx-auto flex w-full max-w-[1100px] flex-col gap-5 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-end sm:justify-between sm:pt-12 sm:pb-12">
        <div>
          <p className="font-display text-[clamp(2rem,9vw,3.75rem)] leading-[0.95]">{site.name}</p>
          <p className="mt-2 text-sm font-semibold">© {new Date().getFullYear()} {site.name}</p>
        </div>
        {instagram || whatsappUrl() ? (
          <div className="flex flex-wrap items-center gap-3">
            <WhatsAppButton onOrange />
            {instagram ? (
              <a
                href={instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="sticker press inline-flex min-h-12 items-center bg-paper px-5 font-bold hover:bg-peach"
              >
                Instagram @{instagram.handle}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  )
}
