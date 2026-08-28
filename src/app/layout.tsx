import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeTrace — Visualize Algorithms",
  description: "Watch algorithms run line by line.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
