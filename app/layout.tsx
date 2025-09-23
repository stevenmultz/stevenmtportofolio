// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
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
      <head>
        {/* Memuat font Roboto Mono dari Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      {/* Terapkan font-family dan warna dasar */}
      <body 
        className="bg-black text-white" 
        style={{ fontFamily: "'Roboto Mono', monospace" }}
      >
        {children}
      </body>
    </html>
  );
}