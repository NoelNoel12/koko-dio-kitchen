"use client"

import { useEffect, useRef, useState } from "react"

// Marks the price sticker as stuck once a marker just above it slides under the sticky line, so it can shrink.
// IntersectionObserver works in every mobile browser, unlike CSS scroll-state queries.
export function StickyTag({ children }: { children: React.ReactNode }) {
  const markerRef = useRef<HTMLDivElement>(null)
  const holderRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const marker = markerRef.current
    const holder = holderRef.current
    if (!marker || !holder) return
    const stickyTop = parseFloat(getComputedStyle(holder).top) || 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setStuck(!entry.isIntersecting && entry.boundingClientRect.top < stickyTop + 1)
      },
      { rootMargin: `-${Math.ceil(stickyTop) + 1}px 0px 0px 0px` },
    )
    observer.observe(marker)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={markerRef} aria-hidden="true" className="h-px" />
      <div ref={holderRef} data-stuck={stuck} className="tier-sticky mb-6 w-fit sm:mb-8">
        <div className="tier-shrink">{children}</div>
      </div>
    </>
  )
}
