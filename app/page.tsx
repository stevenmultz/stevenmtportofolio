// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Loading from './components/Loading';
import StartPage from './components/StartPage';
import Homepage from './components/HomePage';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Durasi diubah agar sesuai dengan animasi loading yang lebih panjang
    // Memberi waktu 4.5 detik sebelum pindah ke StartPage
    const timer = setTimeout(() => setLoading(false), 7000); // <-- UBAH ANGKA INI
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setStarted(true);
  };

  return (
    <>
      <AnimatePresence>
        {loading && <Loading />}
        {!loading && !started && <StartPage onEnter={handleEnter} />}
      </AnimatePresence>

      {started && <Homepage />}
    </>
  );
}