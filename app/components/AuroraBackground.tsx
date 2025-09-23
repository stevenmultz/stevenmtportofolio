// app/components/AuroraBackground.tsx
'use client';

// Komponen ini HANYA bertugas untuk menyuntikkan style global
export default function AuroraBackground() {
  return (
    <style jsx global>{`
      @keyframes aurora-flow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .aurora-background {
        background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #0f172a, #1e3a8a);
        background-size: 400% 400%;
        animation: aurora-flow 30s ease-in-out infinite;
      }
    `}</style>
  );
}