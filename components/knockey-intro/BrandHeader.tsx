import type { RefObject } from 'react';

type BrandHeaderProps = {
  logoRef: RefObject<HTMLDivElement | null>;
};

export function BrandHeader({ logoRef }: BrandHeaderProps) {
  return (
    <header className="relative z-20 pt-8 sm:pt-10 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
      <div
        ref={logoRef}
        className="opacity-0 flex items-center font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-semibold tracking-[-0.045em] text-white"
      >
        <span>Knock</span>
        <span className="text-[#8B5CFF]">e</span>
        <span>y</span>
      </div>
    </header>
  );
}
