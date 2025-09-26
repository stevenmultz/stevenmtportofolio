'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import Loading from './components/Loading';
import StartPage from './components/StartPage';
import Homepage from './components/HomePage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  // useEffect dengan setTimeout tidak lagi diperlukan.
  // Dihapus untuk sinkronisasi yang lebih baik.

  const handleEnter = () => {
    setHasStarted(true);
  };

  return (
    <>
      <AnimatePresence>
        {/*
          - Tampilkan Loading selama isLoading=true.
          - Saat animasi di Loading selesai, ia akan memanggil onLoadingComplete.
          - onLoadingComplete akan menjalankan setIsLoading(false), yang menyembunyikan komponen ini.
        */}
        {isLoading && (
          <Loading onLoadingComplete={() => setIsLoading(false)} />
        )}
        
        {/*
          - Tampilkan StartPage setelah loading selesai DAN sebelum user menekan "Enter".
        */}
        {!isLoading && !hasStarted && <StartPage onEnter={handleEnter} />}
      </AnimatePresence>

      {/*
        - Tampilkan Homepage secara permanen setelah user menekan "Enter" di StartPage.
        - Komponen ini tidak perlu di dalam AnimatePresence karena tidak akan pernah hilang (unmount).
      */}
      {hasStarted && <Homepage />}
    </>
  );
}