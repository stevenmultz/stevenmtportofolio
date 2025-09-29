import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
})

export const metadata: Metadata = {
  title: 'Steven MT - Software Engineer Portfolio',
  description: 'A retro-futuristic portfolio with a CRT terminal interface.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} font-vt323`}>{children}</body>
    </html>
  )
}