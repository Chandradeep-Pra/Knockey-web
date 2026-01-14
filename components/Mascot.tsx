interface Props {
  state?: "idle" | "ringing" | "sad";
}


export default function Mascot({ state = "idle" }: Props) {
  return (
    <div className="flex justify-center">
      <div
        className={`
          w-28 h-28 rounded-full
          flex items-center justify-center
          text-4xl
          transition-all
          ${
            state === "ringing"
              ? "bg-accent animate-bounce"
              : state === "sad"
              ? "bg-muted"
              : "bg-secondary"
          }
        `}
      >
        {state === "ringing"
          ? "🔔"
          : state === "sad"
          ? "😔"
          : "😊"}
      </div>
    </div>
  );
}

