import type { Metadata } from "next";
import { Antonio, Caveat, Spectral } from "next/font/google";
import "./globals.css";

// Film-title condensed display face — headings in both chapters.
const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
  display: "swap",
});

// Literary serif — the body voice of the novel (DESIGN.md).
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Handwritten face for grease-pencil captions and margin notes on /creator.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kirtiraj Chaudhari — AI/ML Engineer & Creative",
  description:
    "Portfolio of Kirtiraj Nitin Chaudhari — M.Tech AI/ML student at MIT WPU, B.E. Computer Engineering (Hons. AI/ML). Applied ML, full-stack development, and creative work.",
  keywords: [
    "AI/ML Engineer",
    "Machine Learning",
    "Portfolio",
    "Full-Stack Developer",
    "Kirtiraj Chaudhari",
  ],
  authors: [{ name: "Kirtiraj Nitin Chaudhari" }],
  openGraph: {
    title: "Kirtiraj Chaudhari — AI/ML Engineer & Creative",
    description:
      "Applied ML, full-stack development, and creative work by Kirtiraj Chaudhari.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${antonio.variable} ${spectral.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body className="noise-overlay" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
