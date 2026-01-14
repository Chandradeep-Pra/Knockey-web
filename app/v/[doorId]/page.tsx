"use client";

import { useState } from "react";
import WelcomeScreen from "@/screens/WelcomeScreen";
import RingingScreen from "@/screens/RingingScreen";

type ViewState = "welcome" | "ringing";

export default function VisitorPage({
  params,
}: {
  params: { doorId: string };
}) {
  const [state, setState] = useState<ViewState>("welcome");

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      {state === "welcome" && (
        <WelcomeScreen
          doorName="Chandradeep"
          onRing={() => setState("ringing")}
        />
      )}

      {state === "ringing" && <RingingScreen />}
    </main>
  );
}
