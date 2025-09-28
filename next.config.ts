import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    // Peringatan: Opsi ini akan membuat proses build tetap berhasil 
    // meskipun proyek Anda memiliki error ESLint.
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // GANTI 'assets.example.com' dengan domain tempat gambar Anda di-hosting
        // Contoh: 'res.cloudinary.com' jika menggunakan Cloudinary
        hostname: 'assets.example.com', 
        port: '',
        pathname: '/**', // Izinkan semua path di dalam hostname tersebut
      },
      // Anda bisa menambahkan objek lain di sini untuk domain yang berbeda
      // {
      //   protocol: 'https',
      //   hostname: 'another-domain.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
  /* config options lain bisa ditambahkan di sini */
};

export default nextConfig;