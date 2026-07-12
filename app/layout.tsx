import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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
      data-mode="professional"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="noise-overlay" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
