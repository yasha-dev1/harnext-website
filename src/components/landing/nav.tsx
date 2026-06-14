"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GithubIcon } from "./icons";

const GITHUB_URL = "https://github.com/QualityUnit/harnext";

export default function Nav({
  startHref = "#start",
  startLabel = "Get started",
}: {
  startHref?: string;
  startLabel?: string;
}) {
  const [stuck, setStuck] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (href: string) => (pathname === href ? " active" : "");

  return (
    <header className={`nav${stuck ? " stuck" : ""}`}>
      <div className="container nav-in">
        <Link className="brand" href="/">
          <svg className="mark" width={21} height={22} viewBox="0 0 60 64" aria-hidden="true">
            <use href="#logoMark" />
          </svg>
          <span>harnext</span>
        </Link>
        <nav className="nav-links">
          <Link href="/harnext" className={`has-dot${active("/harnext")}`}>harnext</Link>
          <Link href="/context-engine" className={`has-dot${active("/context-engine")}`}>Context Engine</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/blog" className={pathname?.startsWith("/blog") ? "active" : undefined}>Blog</Link>
          <Link href="/webinars" className={pathname === "/webinars" ? "active" : undefined}>Webinars</Link>
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
        <a className="btn btn-ghost nav-demo" href="https://calendly.com/liveagentsession/flowhunt-demo" target="_blank" rel="noreferrer">Book a call</a>
        <a className="btn btn-amber" href={startHref}>{startLabel}</a>
      </div>
    </header>
  );
}
