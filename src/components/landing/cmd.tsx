"use client";

import { useEffect, useRef, useState } from "react";

/** Click-to-copy command pill. */
export default function Cmd({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = () => {
    const done = () => {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1400);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(command).then(done, done);
    } else {
      done();
    }
  };

  return (
    <button className={`cmd${copied ? " copied" : ""}`} onClick={copy} type="button">
      <span className="pmt">$</span>
      {command}
      <span className="copy">
        <span className="copy-t">{copied ? "Copied" : "Copy"}</span>
      </span>
    </button>
  );
}
