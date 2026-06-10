"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GithubIcon } from "./icons";

const GITHUB_URL = "https://github.com/QualityUnit/harnext";

export default function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${stuck ? " stuck" : ""}`}>
      <div className="container nav-in">
        <a className="brand" href="#top">
          <svg className="mark" width={21} height={22} viewBox="0 0 60 64" aria-hidden="true">
            <use href="#logoMark" />
          </svg>
          <span>harnext</span>
        </a>
        <nav className="nav-links">
          <a href="#harnext" className="has-dot">harnext</a>
          <a href="#context" className="has-dot">Context Engine</a>
          <a href="#start">Quick start</a>
          <Link href="/docs">Docs</Link>
        </nav>
        <span className="nav-spacer" />
        <a
          className="nav-gh"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="harnext on GitHub"
        >
          <GithubIcon />
        </a>
        <a className="btn btn-ghost nav-demo" href="#">Book a call</a>
        <a className="btn btn-amber" href="#start">Get started</a>
      </div>
    </header>
  );
}
