import Image from 'next/image';
import type { RefObject } from 'react';

type PhysicalChapterBackdropProps = {
  visible: boolean;
  glowRef: RefObject<HTMLDivElement | null>;
};

export function PhysicalChapterBackdrop({ visible, glowRef }: PhysicalChapterBackdropProps) {
  return (
    <div
      className={`absolute inset-0 z-0 transition-all duration-[2200ms] ease-out ${visible ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}
      aria-hidden="true"
    >
      <Image
        src="/lat-stage-bg.png"
        alt="Knockey mounted beside a modern front door at night"
        fill
        sizes="100vw"
        className="object-cover object-[55%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 opacity-0 transition-opacity duration-[1400ms] ease-out"
      >
        <div className="absolute h-[6.5rem] w-[6.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B5CFF]/30 blur-[22px] md:h-52 md:w-52 md:blur-[42px]" />
        <div className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B47AFF]/45 shadow-[0_0_22px_6px_rgba(139,92,255,0.3)] md:h-36 md:w-36 md:shadow-[0_0_45px_12px_rgba(139,92,255,0.3)]" />
      </div>
    </div>
  );
}
