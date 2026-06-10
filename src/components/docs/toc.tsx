"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

export function Toc() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  // Re-scan the article for headings on every navigation. The scan is deferred
  // to the next frame so it reads the freshly-painted DOM (and avoids a
  // synchronous setState inside the effect body).
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const article = document.querySelector("article.doc-prose");
      const nodes = article
        ? Array.from(article.querySelectorAll<HTMLElement>("h2[id], h3[id]"))
        : [];
      setHeadings(
        nodes.map((n) => ({
          id: n.id,
          text: n.textContent?.replace(/#$/, "").trim() ?? "",
          level: n.tagName === "H3" ? 3 : 2,
        })),
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Highlight the heading nearest the top of the viewport.
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return <div className="hidden xl:block" />;

  return (
    <aside className="hidden xl:block">
      <div className="doc-scroll sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pl-2">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          On this page
        </div>
        <ul className="flex flex-col gap-1.5 border-l border-[var(--border)]">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`-ml-px block border-l py-0.5 text-[13px] transition ${
                  h.level === 3 ? "pl-6" : "pl-3"
                } ${
                  active === h.id
                    ? "border-[var(--accent-cyan)] text-white"
                    : "border-transparent text-[var(--muted)] hover:text-white"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
