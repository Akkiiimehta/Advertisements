import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yash Mehta — Advertising Portfolio",
  description: "Creative production work across TVCs, brand films, and social campaigns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
