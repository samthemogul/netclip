import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google"
import "@/styles/globals.css";

const interFont = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", '600'], 
  variable: "--font-inter",
});
const ibmPlexSerifFont = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400","500","600"],
  variable: "--font-ibm",
});

export const metadata: Metadata = {
  title: "NetClip",
  description: "Stream your favourite movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} ${ibmPlexSerifFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
