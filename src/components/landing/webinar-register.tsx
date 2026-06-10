"use client";

import { useEffect, useState } from "react";
import { UPCOMING_WEBINAR as W } from "@/lib/webinars";

const pad = (n: number) => (n < 10 ? "0" : "") + n;

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(W.dateISO).getTime();
    const tick = () => setLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (left === 0) {
    return <div className="cd-live">● We&apos;re live now — join from the link in your inbox.</div>;
  }

  const s = left ?? 0;
  const cells: Array<[string, string]> = [
    [pad(Math.floor(s / 86400)), "days"],
    [pad(Math.floor((s % 86400) / 3600)), "hrs"],
    [pad(Math.floor((s % 3600) / 60)), "min"],
    [pad(s % 60), "sec"],
  ];

  return (
    <div className="countdown" suppressHydrationWarning>
      {cells.map(([num, lab]) => (
        <div className="cd-cell" key={lab}>
          <div className="num">{num}</div>
          <div className="lab">{lab}</div>
        </div>
      ))}
    </div>
  );
}

function downloadIcs() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//harnext//Context Engine Webinar//EN",
    "BEGIN:VEVENT",
    `UID:webinar-${W.slug}@harnext.dev`,
    `DTSTART:${W.icsStartUTC}`,
    `DTEND:${W.icsEndUTC}`,
    `SUMMARY:Webinar — ${W.title}`,
    `DESCRIPTION:${W.episode} of ${W.series} with ${W.speakers.map((sp) => sp.name).join(", ").replace(/,([^,]*)$/, " and$1")}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = `${W.slug}-webinar.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

export default function WebinarRegister() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const email = new FormData(e.currentTarget).get("email");
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "webinar" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong — try again.");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong — try again.");
    }
  }

  return (
    <div className="feat-side">
      <Countdown />

      <div className="ticket-meta">
        <div className="row">
          <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          <span className="mk">When</span>
          <span className="mv">{W.dateShort} <span className="sub">· {W.timeLabel}</span></span>
        </div>
        <div className="row">
          <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <span className="mk">Format</span>
          <span className="mv">45 min talk <span className="sub">+ live Q&amp;A</span></span>
        </div>
        <div className="row">
          <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.55-2.28A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.45.89L15 14M4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /></svg>
          <span className="mk">Where</span>
          <span className="mv">Online <span className="sub">· link sent on signup</span></span>
        </div>
      </div>

      {status === "ok" ? (
        <div className="reg-done">
          <div className="ck">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h4>You&apos;re on the list.</h4>
          <p>Check your inbox for the join link and a calendar invite. See you on the 25th.</p>
        </div>
      ) : (
        <form className="reg-form" onSubmit={submit}>
          <div className="field">
            <input
              className="reg-input"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              autoComplete="email"
              aria-label="Email address"
              disabled={status === "loading"}
            />
            <button className="btn btn-amber" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Saving…" : "Save my seat"}
            </button>
          </div>
          {status === "error" && <p className="sub-msg err" style={{ textAlign: "center", marginTop: 0 }}>{error}</p>}
          <p className="reg-note">
            Free · the recording &amp; slides go to <span className="amb">everyone who registers</span>.<br />
            <a
              className="reg-cal"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                downloadIcs();
              }}
            >
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" /></svg>
              Add to calendar
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
