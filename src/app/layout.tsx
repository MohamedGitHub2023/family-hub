import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FamilyHub - Organisation Familiale",
  description:
    "Application d'organisation familiale : planning, taches, vacances et plus encore.",
  keywords: [
    "famille",
    "organisation",
    "planning",
    "taches",
    "vacances",
    "expatriation",
  ],
  authors: [{ name: "FamilyHub" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366F1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans">
        <div className="app-container">
          <main className="main-content">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
