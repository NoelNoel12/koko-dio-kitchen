import type { MetadataRoute } from "next"
import { site } from "@/data/site"
import { browserColors } from "@/lib/colors"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Koko Dio",
    start_url: "/",
    display: "browser",
    background_color: browserColors.cream,
    theme_color: browserColors.orange,
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  }
}
