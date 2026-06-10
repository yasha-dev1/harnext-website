import type { Metadata } from "next";
import { DocsTopBar } from "@/components/docs/topbar";
import { DocsSidebar } from "@/components/docs/sidebar";
import { Toc } from "@/components/docs/toc";

export const metadata: Metadata = {
  title: {
    default: "Harnext Docs",
    template: "%s · Harnext Docs",
  },
  description:
    "Documentation for harnext — the AI coding agent, its harness, and the Python & TypeScript SDKs.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DocsTopBar />
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 md:grid md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[15rem_minmax(0,1fr)_14rem]">
        <DocsSidebar />
        <main className="min-w-0 py-10 lg:py-12">{children}</main>
        <Toc />
      </div>
    </div>
  );
}
