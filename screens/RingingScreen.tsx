import Mascot from "@/components/Mascot";

export default function RingingScreen() {
  return (
    <div className="w-full max-w-sm bg-card rounded-3xl shadow-xl px-6 py-10 text-center space-y-6">
      <Mascot state="ringing" />

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          Ringing the bell…
        </h2>
        <p className="text-muted text-sm">
          Chandradeep is being notified
        </p>
      </div>
    </div>
  );
}
