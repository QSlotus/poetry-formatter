import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_SC } from "next/font/google"
import "./globals.css"

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-noto-serif-sc",
  display: "block",
  preload: true,
})

export const metadata: Metadata = {
  title: "古诗文排版工具",
  description: "自动排版古诗文，生成便于打印的三栏小册子",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${notoSerifSC.variable}`}>
      <body className="font-serif antialiased">{children}</body>
    </html>
  )
}
