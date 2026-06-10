"use client";

import { useEffect, useRef } from "react";

const BARS: { h: string; lo?: boolean }[] = [
  { h: "18%", lo: true }, { h: "24%", lo: true },
  { h: "14%", lo: true }, { h: "30%", lo: true },
  { h: "22%", lo: true }, { h: "38%", lo: true },
  { h: "28%", lo: true }, { h: "44%", lo: true },
  { h: "34%", lo: true }, { h: "60%" },
  { h: "96%" }, { h: "72%" },
  { h: "20%", lo: true },
];

function animateNum(
  el: HTMLElement,
  to: number,
  opts: { dur?: number; dec?: number; comma?: boolean; fromHigh?: boolean } = {}
) {
  const dur = opts.dur ?? 1100;
  const dec = opts.dec ?? 0;
  const startVal = opts.fromHigh ? to * 5 : 0;
  const start = performance.now();
  const frame = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    const val = startVal + (to - startVal) * e;
    el.textContent = opts.comma ? Math.round(val).toLocaleString("en-US") : val.toFixed(dec);
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = opts.comma ? Math.round(to).toLocaleString("en-US") : to.toFixed(dec);
  };
  requestAnimationFrame(frame);
}

/** Context Engine dashboard mock — bars grow and stats count up when scrolled into view. */
export default function Dashboard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const evRef = useRef<HTMLElement>(null);
  const tokRef = useRef<HTMLElement>(null);
  const buildsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    const bars = Array.from(root.querySelectorAll<HTMLElement>(".bars .bar"));
    bars.forEach((b) => { b.style.height = "0%"; });

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || fired) return;
          fired = true;
          if (evRef.current) animateNum(evRef.current, 4796, { comma: true, dur: 1300 });
          if (buildsRef.current) animateNum(buildsRef.current, 334, { dur: 1100 });
          if (tokRef.current) animateNum(tokRef.current, 14.2, { dec: 1, fromHigh: true, dur: 1400 });
          bars.forEach((b) => {
            window.setTimeout(() => { b.style.height = b.style.getPropertyValue("--h"); }, 60);
          });
          io.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      bars.forEach((b) => { b.style.height = ""; });
    };
  }, []);

  return (
    <div className="dash" ref={rootRef}>
      <div className="card glow chart">
        <div className="chart-hd">
          <div>
            <div className="t">Events processed</div>
            <div className="sub"><b ref={evRef}>4,796</b> events indexed · last 14 days</div>
          </div>
          <div className="seg"><span>7d</span><span className="on">14d</span></div>
        </div>
        <div className="bars">
          {BARS.map((b, i) => (
            <div
              key={i}
              className={`bar${b.lo ? " lo" : ""}`}
              style={{ "--h": b.h } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="axis"><span>14d ago</span><span>7d</span><span>today</span></div>
      </div>

      <div className="card glow dstats">
        <div className="dstat">
          <div className="l">Tokens / query</div>
          <div className="big amb"><span ref={tokRef}>14.2</span><span className="u">k · −89%</span></div>
        </div>
        <div className="dstat">
          <div className="l">Context builds</div>
          <div className="big"><span ref={buildsRef}>334</span></div>
        </div>
        <div className="dstat">
          <div className="l">Sources · status</div>
          <div className="live"><span className="pulse" /> 10 live</div>
        </div>
      </div>
    </div>
  );
}
