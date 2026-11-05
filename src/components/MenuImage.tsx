import Image from "next/image"
import type { MenuItem } from "@/data/menu"

type Props = {
  item: MenuItem
  eager?: boolean
  tilt: "left" | "right"
  compact?: boolean
}

// Rasio dikunci 4:3 supaya foto asli nanti tidak menggeser layout.
// `compact` hanya memendekkan placeholder; foto asli selalu tampil 4:3.
export function MenuImage({ item, eager = false, tilt, compact = false }: Props) {
  const ratio = compact && !item.image ? "aspect-[5/2]" : "aspect-[4/3]"

  return (
    <div className={`relative ${ratio} overflow-hidden border-b-[2.5px] border-ink bg-peach`}>
      {item.image ? (
        <Image
          src={item.image}
          alt={`Rice box ${item.name}`}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1100px) 260px, (min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
          className="object-cover"
        />
      ) : (
        <RiceBoxPlaceholder tilt={tilt} />
      )}
    </div>
  )
}

function RiceBoxPlaceholder({ tilt }: { tilt: "left" | "right" }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pt-1">
      <svg
        viewBox="0 0 120 84"
        className={`h-[58%] w-auto ${tilt === "left" ? "-rotate-3" : "rotate-3"}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M50 8c-4 4 4 7 0 11M60 4c-4 5 4 8 0 13M70 8c-4 4 4 7 0 11" strokeWidth="3" />
        <path d="M24 44c2-12 16-20 36-20s34 8 36 20" fill="var(--color-paper)" />
        <path d="M42 36l4-2M55 31l3 2M70 34l4-1M62 39l3-2M49 40l3 1" strokeWidth="2.5" />
        <path d="M14 44h92l-9 34H23z" fill="var(--color-orange)" />
        <path d="M30 56h60" strokeWidth="3" />
      </svg>
      <span className="font-display text-[0.8rem] tracking-wide sm:text-sm">Foto menyusul</span>
    </div>
  )
}
