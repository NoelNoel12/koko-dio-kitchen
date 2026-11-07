import Image from "next/image"
import { menu } from "@/data/menu"
import { site } from "@/data/site"
import { formatPrice } from "@/lib/menu"
import { EventDate } from "@/components/EventDate"
import { WhatsAppButton } from "@/components/WhatsAppButton"

export const HERO_LOGO_ID = "hero-logo"

// Each group lands like a separate sticker; "rice box" stays together as one product name.
const HEADLINE = ["Mau", "rice box", "rasa apa?"]

export function Hero() {
  const cheapest = Math.min(...menu.map((item) => item.price))

  return (
    <header
      id="top"
      className="page-gutter mx-auto grid w-full max-w-[1100px] grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-x-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-6 sm:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] sm:gap-x-10 sm:pt-8 sm:pb-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:pb-10"
    >
      <Image
        id={HERO_LOGO_ID}
        src="/brand/logo-hero.webp"
        alt={`Logo ${site.name}: koki tersenyum mengacungkan jempol sambil memegang spatula`}
        width={900}
        height={1325}
        preload
        sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 42vw"
        className="mx-auto h-auto max-h-[min(44dvh,340px)] w-auto sm:row-span-2"
      />
      <div className="min-w-0 sm:self-end">
        <h1
          id="hero-title"
          className="max-w-[11ch] font-display text-[clamp(1.75rem,8.4vw,6rem)] leading-[0.95] tracking-[-0.01em] text-balance"
        >
          {HEADLINE.map((words, index) => (
            <span key={words}>
              <span style={{ "--i": index } as React.CSSProperties} className="hero-word">
                {words}
              </span>
              {index < HEADLINE.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p
          style={{ "--i": 5 } as React.CSSProperties}
          className="hero-enter mt-3 max-w-[30ch] text-[clamp(0.95rem,3.9vw,1.375rem)] leading-snug font-medium sm:mt-5"
        >
          {menu.length} rasa, mulai {formatPrice(cheapest)}.
        </p>
      </div>
      <div className="col-span-2 mt-5 flex flex-col gap-4 sm:col-span-1 sm:col-start-2 sm:mt-0 sm:self-start sm:pt-6">
        <div
          style={{ "--i": 6 } as React.CSSProperties}
          className="hero-enter space-y-1 text-[0.95rem] leading-snug sm:text-base"
        >
          {site.event.date ? <EventDate date={site.event.date} place={site.event.place} /> : null}
          {site.payment.length > 0 ? (
            <p>
              <span className="font-bold">Bayar langsung di booth</span>: {site.payment.join(" atau ")}
            </p>
          ) : null}
        </div>
        <div className="grid empty:hidden sm:block">
          <WhatsAppButton />
        </div>
      </div>
    </header>
  )
}
