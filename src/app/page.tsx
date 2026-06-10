import Nav from "@/components/landing/nav";
import Reveal from "@/components/landing/reveal";
import TrustedBy from "@/components/landing/trusted-by";
import NewsletterPopup from "@/components/landing/newsletter-popup";
import { WebinarStrip } from "@/components/landing/webinar";
import { LogoSymbol } from "@/components/landing/icons";
import {
  HarnextPanel,
  ContextEnginePanel,
  HarnextSection,
  ContextEngineSection,
  CompatStrip,
  QuickStart,
  OpenSource,
  Footer,
} from "@/components/landing/sections";

export default function Home() {
  return (
    <>
      <LogoSymbol />
      <Nav />
      <span id="top" />
      <main className="flex-1">
        <Hero />
        <WebinarStrip />
        <OpenSource />
        <HarnextSection />
        <ContextEngineSection />
        <CompatStrip />
        <QuickStart />
      </main>
      <Footer />
      <NewsletterPopup />
    </>
  );
}

/* ============================ HERO ============================ */

function Hero() {
  return (
    <section className="hero">
      <div className="aurora" aria-hidden="true"><i className="a1" /><i className="a2" /><i className="a3" /></div>
      <div className="container">
        <Reveal className="hero-top">
          <p className="eyebrow"><span className="sq" /> Open source · MIT licensed</p>
          <h1>Build the harness.<br /><span className="l2">Engineer the context.</span></h1>
          <p className="lede">
            Two open-source tools that work as one — a terminal-native coding
            agent harness, and the context engine that feeds its brain.
          </p>
        </Reveal>

        <div className="hero-split">
          <HarnextPanel />
          <ContextEnginePanel />
        </div>

        <Reveal className="d2">
          <TrustedBy />
        </Reveal>
      </div>
    </section>
  );
}
