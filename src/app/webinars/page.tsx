import type { Metadata } from "next";
import Nav from "@/components/landing/nav";
import Reveal from "@/components/landing/reveal";
import { LogoSymbol } from "@/components/landing/icons";
import { Footer } from "@/components/landing/sections";
import { UpcomingWebinars } from "@/components/landing/webinar";
import { UPCOMING_WEBINAR } from "@/lib/webinars";

export const metadata: Metadata = {
  title: `Live Webinar — ${UPCOMING_WEBINAR.title}? · harnext`,
  description: `${UPCOMING_WEBINAR.episode} of ${UPCOMING_WEBINAR.series}: ${UPCOMING_WEBINAR.title}. Live on ${UPCOMING_WEBINAR.dateLabel}, ${UPCOMING_WEBINAR.timeLabel} — free, with recording and slides for everyone who registers.`,
};

export default function WebinarsPage() {
  return (
    <>
      <LogoSymbol />
      <Nav startHref="#register" startLabel="Save my seat" />
      <span id="top" />
      <main className="flex-1">
        <section className="web-head">
          <div className="container">
            <Reveal>
              <p className="eyebrow"><span className="sq" /> Webinars · built in the open</p>
              <h1>Live sessions on context<br /><span className="l2">engineering for agents.</span></h1>
              <p className="lede">
                A hands-on series from the team building harnext and the open-source
                Context Engine. Register once — the recording and slides go to everyone
                who signs up.
              </p>
            </Reveal>
          </div>
        </section>
        <UpcomingWebinars />
      </main>
      <Footer />
    </>
  );
}
