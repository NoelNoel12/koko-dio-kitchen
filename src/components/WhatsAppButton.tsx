import { whatsappUrl } from "@/lib/contact"

type Props = {
  onOrange?: boolean
}

export function WhatsAppButton({ onOrange = false }: Props) {
  const href = whatsappUrl()
  if (!href) return null

  const tone = onOrange ? "bg-paper hover:bg-peach" : "bg-orange hover:bg-orange-deep"

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`sticker press inline-flex min-h-12 items-center justify-center px-5 text-base font-bold whitespace-nowrap text-ink ${tone}`}
    >
      Pesan lewat WhatsApp
    </a>
  )
}
