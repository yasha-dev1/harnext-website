import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "harnext × Context Engine — open-source infrastructure for AI coding agents",
  description:
    "Two open-source tools that work as one — a terminal-native coding agent harness, and the context engine that turns every event in your org into token-efficient context.",
  metadataBase: new URL("https://harnext.dev"),
  openGraph: {
    title: "harnext × Context Engine — open-source infrastructure for AI coding agents",
    description:
      "The coding agent harness + the context engine that feeds its brain. Open source, MIT licensed.",
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
      className={`${bricolage.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
