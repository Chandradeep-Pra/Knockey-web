import "./globals.css";

export const metadata = {
  title: "KnockeY",
  description: "A smarter way to know who is at your door.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  );
}
