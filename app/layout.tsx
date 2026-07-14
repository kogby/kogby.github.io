import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Jerry Chen (kogby) | ML Infra & Backend Engineer",
  description:
    "Jerry Chen — CMU MS student working on LLM inference serving, distributed systems, and cloud infrastructure. Open to AI/Cloud Infra, MLE & Solutions Architect roles.",
  openGraph: {
    title: "Jerry Chen (kogby) | ML Infra & Backend Engineer",
    description:
      "LLM inference serving, distributed systems, and cloud infrastructure. Graduating Dec 2026.",
    url: "https://kogby.github.io",
    siteName: "kogby.github.io",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${caveat.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
