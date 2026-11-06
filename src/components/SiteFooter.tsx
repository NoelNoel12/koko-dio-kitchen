import Image from "next/image"
import { site } from "@/data/site"
import { instagramUrl, whatsappUrl } from "@/lib/contact"
import { EventDate } from "@/components/EventDate"
import { WhatsAppButton } from "@/components/WhatsAppButton"

export function SiteFooter() {
  const instagram = instagramUrl()

  return (
    <footer className="mt-10 border-t-[2.5px] border-ink bg-orange sm:mt-16">
      <div className="page-gutter mx-auto w-full max-w-[1100px] pt-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:pt-14 sm:pb-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <Image
            src="/brand/logo-hero.webp"
            alt={`Logo ${site.name}`}
            width={900}
            height={1325}
            sizes="(min-width: 640px) 136px, 109px"
            className="h-40 w-auto shrink-0 self-start sm:h-[200px] sm:self-center"
          />
          <div className="scroll-reveal grid gap-1 text-base leading-snug sm:text-lg">
            {site.event.date ? <EventDate date={site.event.date} place={site.event.place} /> : null}
            {site.payment.length > 0 ? (
              <p>
                <span className="font-bold">Bayar langsung di booth</span>: {site.payment.join(" atau ")}
              </p>
            ) : null}
            <p>Website ini hanya untuk melihat menu. Pesan dan bayar langsung di kasir.</p>
          </div>
        </div>

        {instagram || whatsappUrl() ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
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

        <p className="mt-10 text-sm font-semibold sm:mt-12">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  )
}
