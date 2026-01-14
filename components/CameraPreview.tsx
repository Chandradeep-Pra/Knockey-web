"use client";

import { useEffect, useRef } from "react";
import {
  ArrowPathIcon,
  ViewfinderCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Props {
  stream: MediaStream;
  onClose: () => void;
  onFlip: () => void;
  onDualMode: () => void;
}

export default function CameraPreview({
  stream,
  onClose,
  onFlip,
  onDualMode,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-black aspect-[9/16]">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Top controls */}
      <div className="absolute top-3 right-3">
        <button
          onClick={onClose}
          className="bg-black/60 text-white rounded-full p-2"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
        <button
          onClick={onFlip}
          className="bg-black/60 text-white rounded-full p-3"
          title="Flip camera"
        >
          <ArrowPathIcon className="w-6 h-6" />
        </button>

        {/* <button
          onClick={onDualMode}
          className="bg-black/60 text-white rounded-full p-3"
          title="Dual view"
        >
          <ViewfinderCircleIcon className="w-6 h-6" />
        </button> */}
      </div>
    </div>
  );
}
