import type { Metadata } from "next";
import "./globals.css";
import { SoundProvider } from "@/components/SoundProvider";

export const metadata: Metadata = {
  title: "Ads by Aki",
  description: "Creative work across TVCs, brand films, Events and social campaigns.",
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
