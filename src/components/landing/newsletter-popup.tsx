"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SubscribeForm from "./subscribe-form";
import { UPCOMING_WEBINAR as W } from "@/lib/webinars";

const DISMISSED_KEY = "hx-popup-dismissed-at";
const SUBSCRIBED_KEY = "hx-subscribed";
const DISMISS_DAYS = 7;

/**
 * Scroll-triggered subscribe popup. Opens once the visitor scrolls about
 * 1.4 viewports down; stays away for a week after dismissal and forever
 * after a successful subscribe.
 */
export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY)) return;
      const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
      if (Date.now() - dismissedAt < DISMISS_DAYS * 864e5) return;
    } catch {
      /* storage unavailable — still show the popup */
    }
    const onScroll = () => {
      if (shownRef.current) return;
      if (window.scrollY > window.innerHeight * 1.4) {
        shownRef.current = true;
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
  }

  function onSubscribed() {
    try {
      localStorage.setItem(SUBSCRIBED_KEY, "1");
    } catch {}
    window.setTimeout(() => setOpen(false), 2000);
  }

  if (!open) return null;

  return (
    <div className="popup-ovl" onClick={dismiss}>
      <div
        className="popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="popup-x" onClick={dismiss} aria-label="Close">
          ✕
        </button>
        <p className="eyebrow">
          <span className="sq" /> Upcoming webinar · {W.dateLabel}
        </p>
        <h3 id="popup-title">{W.title}</h3>
        <p className="popup-desc">
          Live walkthrough + Q&amp;A at {W.timeLabel}. Drop your email and we&apos;ll send the
          joining link — plus occasional release notes. No spam, unsubscribe anytime.
        </p>
        <SubscribeForm source="popup" cta="Save my seat" onSuccess={onSubscribed} />
        <Link href="/webinars" className="popup-more" onClick={dismiss}>
          See webinar details →
        </Link>
      </div>
    </div>
  );
}
