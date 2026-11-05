import Image from "next/image"
import { menu } from "@/data/menu"
import { site } from "@/data/site"
import { formatPrice } from "@/lib/menu"
import { WhatsAppButton } from "@/components/WhatsAppButton"

export function Hero() {
  const cheapest = Math.min(...menu.map((item) => item.price))

  return (
    <section
      aria-labelledby="hero-title"
      className="page-gutter mx-auto grid w-full max-w-[1100px] grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-x-4 pt-2 pb-6 sm:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] sm:gap-x-10 sm:pb-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:pb-10"
    >
      <Image
        src="/brand/logo-hero.webp"
        alt={`Logo ${site.name}: koki tersenyum mengacungkan jempol sambil memegang spatula`}
        width={900}
        height={1325}
        preload
        sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 42vw"
        className="hero-logo mx-auto h-auto max-h-[min(44dvh,340px)] w-auto sm:row-span-2"
      />
      <div className="min-w-0 sm:self-end">
        <h1
          id="hero-title"
          className="max-w-[11ch] font-display text-[clamp(1.75rem,8.4vw,6rem)] leading-[0.95] tracking-[-0.01em] text-balance"
        >
          Mau rice box rasa apa?
        </h1>
        <p className="mt-3 max-w-[30ch] text-[clamp(0.95rem,3.9vw,1.375rem)] leading-snug font-medium sm:mt-5">
          {menu.length} rasa, mulai {formatPrice(cheapest)}.
        </p>
      </div>
      <div className="col-span-2 mt-5 grid empty:hidden sm:col-span-1 sm:col-start-2 sm:mt-0 sm:block sm:self-start sm:pt-6">
        <WhatsAppButton />
      </div>
    </section>
  )
}
