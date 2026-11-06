type Props = {
  names: string[]
}

// Decorative running strip of flavor names, like a booth banner. The same names are listed below, so it is hidden from screen readers.
export function FlavorTicker({ names }: Props) {
  const run = (copy: number) =>
    names.map((name) => (
      <span key={`${copy}-${name}`} className="flex shrink-0 items-center gap-5 pr-5">
        {name}
        <span className="inline-block size-2 rotate-45 bg-orange" />
      </span>
    ))

  return (
    <div aria-hidden="true" className="overflow-hidden bg-ink py-2.5 font-display text-lg tracking-wide text-cream">
      <div className="ticker-track flex w-max">
        <div className="flex">{run(0)}</div>
        <div className="flex">{run(1)}</div>
      </div>
    </div>
  )
}
