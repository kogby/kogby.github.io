import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";
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
    <html lang="en" className={`${inter.variable} ${caveat.variable} scroll-smooth motion-reduce:scroll-auto`}>
      <body className="antialiased min-h-screen flex flex-col">
        <GridBackground />
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        {/* GoatCounter, pinned version + SRI so a tampered CDN file is refused; to upgrade take version + hash from goatcounter.com/help/countjs-versions.
            ponytail: counts full page loads only, client-side route changes are not tracked. Add usePathname + goatcounter.count() if per-page stats matter */}
        <Script
          data-goatcounter="https://kogby.goatcounter.com/count"
          src="https://gc.zgo.at/count.v5.js"
          integrity="sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
