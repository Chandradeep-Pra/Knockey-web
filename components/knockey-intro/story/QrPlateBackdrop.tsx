import Image from 'next/image';

export function QrPlateBackdrop({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 z-0 hidden transition-all duration-[1400ms] ease-out md:block ${visible ? 'scale-100 opacity-100' : 'scale-[1.025] opacity-0'}`}
      aria-hidden="true"
    >
      <Image
        src="/qr-plate-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/5" />
    </div>
  );
}
