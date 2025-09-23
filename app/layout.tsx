// app/layout.tsx
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

// Menggunakan modul next/font/google untuk memuat font
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mulatama [RAW]",
  description: "Functional Web Experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>
        {children}
      </body>
    </html>
  );
}