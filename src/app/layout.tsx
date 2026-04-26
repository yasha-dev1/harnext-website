import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "harnext — AI coding agent with harness engineering",
  description:
    "An interactive terminal coding agent that drives your repo through staged GitHub Actions pipelines. Read, write, edit, run shell, drive MCP — and let AI pick up issues end to end.",
  metadataBase: new URL("https://harnext.dev"),
  openGraph: {
    title: "harnext — AI coding agent with harness engineering",
    description:
      "Terminal AI coding agent + auto-generated GitHub Actions pipelines that turn issues into PRs.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
