import type { Metadata } from "next";
import Nav from "@/components/landing/nav";
import Reveal from "@/components/landing/reveal";
import { LogoSymbol } from "@/components/landing/icons";
import {
  HarnextPanel,
  HarnextSection,
  CompatStrip,
  QuickStart,
  OpenSource,
  Footer,
} from "@/components/landing/sections";

export const metadata: Metadata = {
  title: "harnext — the coding agent harness",
  description:
    "harnext reads, writes, and edits code, runs shell, and drives MCP — on open-source, local, or any provider. Run it interactively, hand it a task, or let it ship unattended.",
};

export default function HarnextPage() {
  return (
    <>
      <LogoSymbol />
      <Nav />
      <span id="top" />
      <main className="flex-1">
        <Hero />
        <OpenSource />
        <HarnextSection />
        <CompatStrip />
        <QuickStart />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="aurora" aria-hidden="true"><i className="a1" /><i className="a2" /><i className="a3" /></div>
      <div className="container">
        <Reveal className="hero-top">
          <p className="eyebrow"><span className="sq" /> Open source · MIT licensed</p>
          <h1>A coding agent,<br /><span className="l2">harnessed end{" "}to{" "}end.</span></h1>
          <p className="lede">
            harnext reads, writes, and edits code, runs shell, and drives MCP —
            on open-source, local, or any provider. Run it interactively, hand
            it a task, or let it ship unattended.
          </p>
        </Reveal>

        <div className="hero-split solo">
          <HarnextPanel cta={{ href: "/docs", label: "Read the docs →" }} />
        </div>
      </div>
    </section>
  );
}
