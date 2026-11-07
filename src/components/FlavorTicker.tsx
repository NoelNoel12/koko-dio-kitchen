type Props = {
  names: string[]
}

// Each half repeats the names enough times to stay wider than any screen, so the loop never shows a gap.
const REPEATS_PER_HALF = 4

// Decorative running strip of flavor names, like a booth banner. The same names are listed below, so it is hidden from screen readers.
export function FlavorTicker({ names }: Props) {
  const half = (copy: number) => (
    <div className="flex shrink-0">
      {Array.from({ length: REPEATS_PER_HALF }, (_, round) =>
        names.map((name) => (
          <span key={`${copy}-${round}-${name}`} className="flex shrink-0 items-center gap-5 pr-5">
            {name}
            <span className="inline-block size-2 rotate-45 bg-orange" />
          </span>
        )),
      )}
    </div>
  )

  return (
    <div aria-hidden="true" className="overflow-hidden bg-ink py-2.5 font-display text-lg tracking-wide text-cream">
      {/* The outer layer shifts with page scroll, so the strip speeds up while scrolling down. */}
      <div className="ticker-scroll w-max">
        <div className="ticker-track flex w-max">
          {half(0)}
          {half(1)}
        </div>
      </div>
    </div>
  )
}
