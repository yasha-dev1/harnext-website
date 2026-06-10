import type { Metadata } from "next";
import Nav from "@/components/landing/nav";
import Reveal from "@/components/landing/reveal";
import { LogoSymbol } from "@/components/landing/icons";
import {
  ContextEnginePanel,
  ContextEngineSection,
  CompatStrip,
  OpenSource,
  Footer,
} from "@/components/landing/sections";

export const metadata: Metadata = {
  title: "harnext Context Engine — token-efficient context for any agent",
  description:
    "Every event across your org — Stripe, Slack, GitHub, Jira, LiveAgent, HubSpot, your site — streams into the Context Engine. It ranks, prunes, and caches so every agent call carries only what matters.",
};

export default function ContextEnginePage() {
  return (
    <>
      <LogoSymbol />
      <Nav startHref="https://meaninggrid.harnext.dev" />
      <span id="top" />
      <main className="flex-1">
        <Hero />
        <OpenSource />
        <ContextEngineSection />
        <CompatStrip />
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
          <h1>The brain<br /><span className="l2">of your agent.</span></h1>
          <p className="lede">
            Every event across your org — Stripe, Slack, GitHub, Jira,
            LiveAgent, HubSpot, your site — streams into the Context Engine.
            It ranks, prunes, and caches so every agent call carries only what
            matters.
          </p>
        </Reveal>

        <div className="hero-split solo">
          <ContextEnginePanel cta={{ href: "/docs", label: "Read the docs →" }} />
        </div>
      </div>
    </section>
  );
}
