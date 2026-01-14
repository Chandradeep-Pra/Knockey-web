import WelcomeScreen from "@/screens/WelcomeScreen";

type ViewState = "welcome";

export default function VisitorPage({ params }: { params: { doorId: string } }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <WelcomeScreen doorName="Chandradeep" />
    </main>
  );
}
