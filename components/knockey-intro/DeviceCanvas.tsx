import type { RefObject } from 'react';

type DeviceCanvasProps = {
  canvasMountRef: RefObject<HTMLDivElement | null>;
};

export function DeviceCanvas({ canvasMountRef }: DeviceCanvasProps) {
  return (
    <div
      ref={canvasMountRef}
      className="absolute inset-0 w-full h-full z-10 flex items-center justify-center pointer-events-auto"
    />
  );
}
