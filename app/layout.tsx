import type { Metadata } from "next";
import "./globals.css";
import { SoundProvider } from "@/components/SoundProvider";

export const metadata: Metadata = {
  title: "Yash Mehta — Advertising Portfolio",
  description: "Creative production work across TVCs, brand films, and social campaigns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
