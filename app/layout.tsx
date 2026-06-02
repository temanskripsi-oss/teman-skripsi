import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import AuthHandler from "@/components/AuthHandler";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sg",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Teman Skripsi | Skripsi itu gampang. Asal sama orang yang tepat.",
  description: "340+ mahasiswa se-Indonesia sudah buktiin. Bimbingan skripsi online terpercaya dengan mentor berpengalaman.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <AuthHandler />
        {children}
      </body>
    </html>
  );
}
