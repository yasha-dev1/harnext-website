import Image from "next/image";
import Link from "next/link";
import Reveal from "./reveal";
import WebinarRegister from "./webinar-register";
import { UPCOMING_WEBINAR as W } from "@/lib/webinars";

/* Card-based "Upcoming webinars" section with the featured episode (webinars page) */
export function UpcomingWebinars() {
  return (
    <section className="section upcoming" id="upcoming" style={{ paddingTop: "clamp(28px,5vh,56px)" }}>
      <div className="container">
        <Reveal className="up-label">
          <h2>Upcoming webinars</h2>
          <span className="count">Next session · {W.series}</span>
        </Reveal>

        <Reveal as="article" className="feat d1">
          <span id="register" />
          <div className="feat-grid">
            <div className="feat-main">
              <div className="feat-badges">
                <span className="feat-ep">{W.episode}</span>
                <span className="live-pill"><span className="ld" /> Next up</span>
                <span className="feat-tag">Featured</span>
              </div>
              <h3>{W.titleLine1}<br /><span className="l2">{W.titleLine2}</span></h3>
              <p className="feat-desc">{W.description}</p>

              <div className="feat-agenda">
                {W.agenda.map((item, i) => (
                  <div className="fa" key={item.lead}>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t"><b>{item.lead}</b> — {item.text}</span>
                  </div>
                ))}
              </div>

              <div className="feat-foot">
                <div className="feat-hosts">
                  <div className="avatar-stack">
                    {W.speakers.map((sp) => (
                      <Image key={sp.name} src={sp.image} alt={sp.name} width={34} height={34} />
                    ))}
                  </div>
                  <span className="names">
                    <b>{W.speakers[0].name}</b>, {W.speakers[1].name}<br />&amp; {W.speakers[2].name}
                  </span>
                </div>
                <a className="btn btn-ghost" href="#register">Save my seat →</a>
              </div>
            </div>

            <WebinarRegister />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Compact homepage banner pointing at the webinars page */
export function WebinarStrip() {
  return (
    <section className="section" style={{ paddingTop: "clamp(36px,5vh,56px)", paddingBottom: "clamp(36px,5vh,56px)" }}>
      <Reveal className="container">
        <Link href="/webinars" className="webstrip">
          <span className="ws-pill">Webinar</span>
          <span className="ws-date">
            {W.dateLabel} · {W.timeLabel}
          </span>
          <span className="ws-title">{W.title}</span>
          <span className="ws-cta">Save your seat →</span>
        </Link>
      </Reveal>
    </section>
  );
}
