"use client";

import { useEffect, useState } from "react";

const PHRASE = "harnext";

const LINES = [
  <>
    <span className="dim">task ·</span> <span className="usr">add a dark-mode toggle to settings</span>
  </>,
  <>
    <span className="badge read">read</span> <span className="dim">src/settings/page.tsx · 142 lines</span>
  </>,
  <>
    <span className="badge edit">edit</span> <span className="dim">+ useTheme() toggle · 3 hunks</span>
  </>,
  <>
    <span className="badge bash">bash</span> <span className="dim">npm test</span>{"  "}
    <span className="ok">✓ 41 passing</span>
  </>,
];

/** Self-typing hero terminal: types `harnext`, then streams a task → reviewed-change run. */
export default function HeroTerminal() {
  const [typedChars, setTypedChars] = useState(0);
  const [doneTyping, setDoneTyping] = useState(false);
  const [shownLines, setShownLines] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      timers.push(
        window.setTimeout(() => {
          setTypedChars(PHRASE.length);
          setDoneTyping(true);
          setShownLines(LINES.length + 1);
        }, 0)
      );
      return () => timers.forEach(window.clearTimeout);
    }
    let i = 0;
    const tick = () => {
      if (i <= PHRASE.length) {
        setTypedChars(i);
        i++;
        timers.push(window.setTimeout(tick, 55 + Math.random() * 50));
      } else {
        setDoneTyping(true);
        for (let l = 1; l <= LINES.length + 1; l++) {
          timers.push(window.setTimeout(() => setShownLines(l), 300 + (l - 1) * 360));
        }
      }
    };
    timers.push(window.setTimeout(tick, 650));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <div className="term">
      <div className="term-bar">
        <span className="dot r" /><span className="dot y" /><span className="dot g" />
        <span className="ttl">~/projects/api — harnext</span>
      </div>
      <div className="term-body">
        <div className="ln">
          <span className="pmt">❯ </span>
          <span className="usr">{PHRASE.slice(0, typedChars)}</span>
          {!doneTyping && <span className="cursor" />}
        </div>
        {LINES.map((line, i) =>
          shownLines > i ? (
            <div key={i} className="ln doc-fade-in">
              {line}
            </div>
          ) : null
        )}
        {shownLines > LINES.length && (
          <div className="ln rail doc-fade-in">
            change ready · <span className="usr">3 files</span> · <span className="ok">review ✓</span>
          </div>
        )}
      </div>
    </div>
  );
}
