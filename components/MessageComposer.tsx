"use client";

import { useRef, useState } from "react";
import {
  CameraIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Props {
  onSend: (message: {
    type: "text" | "image" | "mixed";
    text?: string;
    file?: Blob;
  }) => void;
  onEndSession?: () => void;
}


export default function MessageComposer({ onSend, onEndSession }: Props) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend = text.trim().length > 0 || imageFile !== null;

  /* ---- Handle camera click ---- */
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  /* ---- Handle image capture ---- */
  const onImageSelected = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ---- Remove image ---- */
  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  /* ---- Send message ---- */
  const sendMessage = () => {
    if (!canSend) return;

    if (text.trim() && imageFile) {
      onSend({ type: "mixed", text: text.trim(), file: imageFile });
    } else if (imageFile) {
      onSend({ type: "image", file: imageFile });
    } else {
      onSend({ type: "text", text: text.trim() });
    }

    // reset
    setText("");
    removeImage();
  };

  return (
    <div className="space-y-3">
      {/* Image preview */}
      {imagePreview && (
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={imagePreview}
            alt="preview"
            className="w-full max-h-48 object-cover rounded-2xl"
          />

          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2 bg-muted/10 rounded-full px-4 py-2">
        {/* Camera */}
        <button
          onClick={openCamera}
          type="button"
          className="text-muted"
          title="Take a photo"
        >
          <CameraIcon className="w-5 h-5" />
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 bg-transparent outline-none text-sm"
        />

        {/* Send */}
        <button
          onClick={sendMessage}
          disabled={!canSend}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center
            ${
              canSend
                ? "bg-primary text-white"
                : "bg-muted/20 text-muted"
            }
          `}
          title="Send"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onImageSelected(e.target.files[0]);
          }
        }}
      />
      <button
  type="button"
  onClick={onEndSession}
  className="
    w-full mt-2 py-2
    text-sm text-muted
    rounded-xl
    hover:bg-muted/10
    transition
  "
>
  End session
</button>

    </div>
  );
}
