import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UAE Crisis Warning Dashboard",
  description: "Real-time OSINT-based decision support for UAE residents during the 2026 Iran-Gulf conflict",
  openGraph: {
    title: "UAE Crisis Warning Dashboard",
    description: "Live conflict monitoring: intercept rates, attack volumes, evacuation triggers, market signals",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950">{children}</body>
    </html>
  );
}
