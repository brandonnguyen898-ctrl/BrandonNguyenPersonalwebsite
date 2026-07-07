import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brandon Luu Nguyen",
  description:
    "Yale University student in Economics & Chemistry — investor, researcher, and founder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`}>
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
