import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  description:
    "Immersive digital experiences with modern web technology, 3D and motion design.",
  openGraph: {
    description:
      "Immersive digital experiences with modern web technology, 3D and motion design.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&family=Space+Grotesk&family=Geist+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise flex min-h-full flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
