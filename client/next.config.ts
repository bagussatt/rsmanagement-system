import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // Tambahkan baris ini
  },
}

export default nextConfig
