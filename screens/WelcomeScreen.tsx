"use client";

import { useEffect, useRef, useState } from "react";
import Mascot from "@/components/Mascot";
import PrimaryButton from "@/components/PrimaryButton";
import CameraPreview from "@/components/CameraPreview";
import MessageComposer from "@/components/MessageComposer";
import { CameraIcon, MicrophoneIcon, ArrowPathIcon, ChatBubbleLeftRightIcon,
 } from "@heroicons/react/24/outline";
import MessagePanel from "@/components/MessagePanel";
import Image from "next/image";

interface Props {
  doorName: string;
}

type CallState = "idle" | "waiting" | "no-answer" | "leave-note";
type SentMessage =
  | { id: number; type: "text"; text: string }
  | { id: number; type: "image"; file: Blob; previewUrl: string }
  | {
      id: number;
      type: "mixed";
      text: string;
      file: Blob;
      previewUrl: string;
    };


export default function WelcomeScreen({ doorName, }: Props) {
  const [state, setState] = useState<CallState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [visitorName, setVisitorName] = useState("");
const [visitorPurpose, setVisitorPurpose] = useState("");




  // ---- Ring Bell ----
  const onRing = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {}

  console.log("Visitor:", {
    name: visitorName,
    purpose: visitorPurpose,
  });

  setSecondsLeft(10);
  setState("waiting");

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
  };

  // ---- Timer end ----
  useEffect(() => {
    if (secondsLeft <= 0 && state === "waiting") {
      if (timerRef.current) clearInterval(timerRef.current);
      setState("no-answer");
      disableCamera();
    }
  }, [secondsLeft, state]);

  // ---- Cleanup ----
 useEffect(() => {
  return () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
    }
  };
}, [cameraStream]);


  // ---- Enable camera ----
  const startCamera = async (mode: "user" | "environment") => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((t) => t.stop());
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode },
    });
    setCameraStream(stream);
    setFacingMode(mode);
  } catch {
    alert("Camera permission denied");
  }
};

const flipCamera = () => {
  const next =
    facingMode === "user" ? "environment" : "user";
  startCamera(next);
};

const dualMode = () => {
  flipCamera();
};


// ---- Disable camera ----
const disableCamera = () => {
  if (!cameraStream) return;
  cameraStream.getTracks().forEach((t) => t.stop());
  setCameraStream(null);
};

// ---- Send Message ----
const handleSendMessage = (msg: {
  type: "text" | "image" | "mixed";
  text?: string;
  file?: Blob;
}) => {
  const previewUrl =
    msg.file ? URL.createObjectURL(msg.file) : undefined;

  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      type: msg.type,
      text: msg.text,
      file: msg.file,
      previewUrl,
    } as SentMessage,
  ]);
};




  return (
    <div className="w-full max-w-sm bg-card rounded-3xl shadow-xl px-6 py-8 space-y-6">
      <Mascot
        state={
          state === "waiting"
            ? "ringing"
            : state === "no-answer"
            ? "sad"
            : "idle"
        }
      />

      {/* CAMERA PREVIEW */}
      {cameraStream && (
  <CameraPreview
    stream={cameraStream}
    onClose={disableCamera}
    onFlip={flipCamera}
    onDualMode={dualMode}
  />
)}



      {/* IDLE */}
      {state === "idle" && (
  <div className="space-y-6">
    {/* Header */}
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-semibold">
        You’re at {doorName}’s door 👋
      </h1>
      <p className="text-muted text-sm">
        Let them know who’s here.
      </p>
    </div>

    {/* Inputs */}
    <div className="space-y-3">
      {/* Name */}
      <input
        type="text"
        placeholder="Your name"
        value={visitorName}
        onChange={(e) => setVisitorName(e.target.value)}
        className="
          w-full rounded-2xl px-4 py-3
          bg-muted/10 text-sm
          outline-none
        "
      />

      {/* Purpose */}
      <input
        type="text"
        placeholder="Purpose (delivery, friend, meeting…) — optional"
        value={visitorPurpose}
        onChange={(e) => setVisitorPurpose(e.target.value)}
        className="
          w-full rounded-2xl px-4 py-3
          bg-muted/10 text-sm
          outline-none
        "
      />
    </div>

    {/* CTA */}
    <PrimaryButton
      onClick={onRing}
      disabled={!visitorName.trim()}
    >
      🔔 Ring Bell
    </PrimaryButton>

    {/* Helper text */}
    <p className="text-xs text-muted text-center">
      Your name and purpose will be shared with the owner
    </p>
  </div>
)}


      {/* WAITING */}
    {state === "waiting" && (
  <div className="space-y-6">
    {/* Status */}
    <div className="text-center space-y-1">
      <h2 className="text-xl font-semibold">
        Ringing…
      </h2>
      <p className="text-muted text-sm">
        Waiting for response ({secondsLeft}s)
      </p>
    </div>

    {/* Primary call controls */}
    <div className="flex justify-center gap-6 pt-2">
      <button
        onClick={() => startCamera("user")}
        className="
          w-14 h-14 rounded-full
          bg-secondary/30
          flex items-center justify-center
        "
      >
        <CameraIcon className="w-6 h-6" />
      </button>

      <button
        className="
          w-14 h-14 rounded-full
          bg-muted/20
          flex items-center justify-center
        "
      >
        <MicrophoneIcon className="w-6 h-6" />
      </button>
    </div>

    {/* Optional message area */}
    <div className="pt-4 mt-2 border-t border-border">
      <MessagePanel />
    </div>
  </div>
)}



      {/* NO ANSWER */}
      {state === "no-answer" && (
  <>
    <h2 className="text-xl font-semibold text-center">No response</h2>
    <p className="text-muted text-sm text-center">
      Would you like to try again or leave a message?
    </p>

    <div className="space-y-3">
      <PrimaryButton onClick={onRing}>
        <span className="flex items-center justify-center gap-2">
          <ArrowPathIcon className="w-5 h-5" />
          Call again
        </span>
      </PrimaryButton>

      <button
        onClick={() => setState("leave-note")}
        className="
          w-full border border-border rounded-2xl py-3
          flex items-center justify-center gap-2
          text-sm font-medium
        "
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5 text-muted" />
        Leave a message
      </button>
    </div>
  </>
)}


      {/* LEAVE NOTE */}
      {state === "leave-note" && (
  <>
    <h2 className="text-xl font-semibold text-center">
      Leave a message
    </h2>

    {/* Message thread */}
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-muted/10 rounded-2xl p-3 text-sm"
        >
          {(msg.type === "text" || msg.type === "mixed") && (
  <p>{msg.text}</p>
)}


          {(msg.type === "image" || msg.type === "mixed") && (
  <Image
    src={msg.previewUrl}
    className="mt-2 rounded-xl max-h-48 object-cover"
    alt="message-image"
  />
)}

        </div>
      ))}
    </div>

    {/* Composer */}
    <MessageComposer onSend={handleSendMessage} onEndSession={() => {
    // cleanup if needed
    setMessages([]);
    setState("idle"); // or redirect / close modal
  }} />
  </>
)}

    </div>
  );
}
