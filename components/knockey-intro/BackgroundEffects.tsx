import type { RefObject } from 'react';

type BackgroundEffectsProps = {
  auraRef: RefObject<HTMLDivElement | null>;
  lightningRef: RefObject<HTMLDivElement | null>;
  sideDockedGlowRef: RefObject<HTMLDivElement | null>;
};

export function BackgroundEffects({
  auraRef,
  lightningRef,
  sideDockedGlowRef,
}: BackgroundEffectsProps) {
  return (
    <>
      <div
        ref={auraRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[720px] h-[600px] sm:h-[720px] rounded-full pointer-events-none blur-[140px] opacity-0 scale-75 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 92, 255, 0.35) 0%, rgba(108, 69, 184, 0.18) 45%, transparent 72%)',
        }}
      />

      <div
        ref={lightningRef}
        className="absolute top-1/2 left-1/2 pointer-events-none z-0 overflow-visible transition-transform duration-75"
        style={{ transform: 'translate(40px, 40px)' }}
      >
        <div
          className="w-[450px] h-[450px] rounded-full blur-[100px] opacity-75 animate-pulse pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 60% 60%, rgba(180, 122, 255, 0.65) 0%, rgba(139, 92, 255, 0.45) 30%, rgba(108, 69, 184, 0.25) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[360px] h-[180px] -translate-x-1/4 -translate-y-1/4 rounded-full blur-[60px] opacity-80 rotate-[35deg] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(215, 175, 255, 0.9) 0%, rgba(139, 92, 255, 0.7) 40%, rgba(108, 69, 184, 0) 100%)',
          }}
        />
      </div>

      <div
        ref={sideDockedGlowRef}
        className="absolute top-1/2 left-1/2 pointer-events-none z-0 overflow-visible opacity-0 transition-opacity duration-300"
        style={{ transform: 'translate(350px, 55px)' }}
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full blur-[70px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 60% 60%, rgba(255, 255, 255, 0.45) 0%, rgba(240, 225, 255, 0.30) 25%, rgba(192, 132, 252, 0.15) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full blur-[100px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 60% 60%, rgba(216, 180, 254, 0.40) 0%, rgba(147, 51, 234, 0.25) 35%, rgba(108, 69, 184, 0.12) 60%, transparent 80%)',
          }}
        />
      </div>
    </>
  );
}
