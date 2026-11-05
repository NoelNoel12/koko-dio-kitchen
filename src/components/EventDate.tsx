"use client"

import { useSyncExternalStore } from "react"

type Props = {
  date: string
  place: string
}

type Status = "upcoming" | "today" | "past"

const toJakartaDay = (value: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(value)

const noop = () => () => {}

// The page is built once, so the "today / past" check has to happen in the visitor's browser.
export function EventDate({ date, place }: Props) {
  const status = useSyncExternalStore<Status>(
    noop,
    () => {
      const today = toJakartaDay(new Date())
      if (today === date) return "today"
      return today > date ? "past" : "upcoming"
    },
    () => "upcoming",
  )

  if (status === "past") return null

  const label = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${date}T12:00:00+07:00`))

  return (
    <p>
      <span className="font-bold">{status === "today" ? `Hari ini jualan di ${place}` : `Jualan di ${place}`}</span>
      {status === "today" ? null : <span>: {label}</span>}
    </p>
  )
}
