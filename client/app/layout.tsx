import type { Metadata } from "next";
import { Figtree, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amir — Creative Developer",
  description:
    "Portfolio of Amir — a creative developer crafting immersive digital experiences with modern web technology, 3D and motion design.",
  openGraph: {
    title: "Amir — Creative Developer",
    description:
      "Immersive digital experiences with modern web technology, 3D and motion design.",
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
      className={`${figtree.variable} ${grotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="noise min-h-full flex flex-col">{children}</body>
    </html>
  );
}
