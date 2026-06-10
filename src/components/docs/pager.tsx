"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pagerFor } from "@/lib/docs-nav";

export function Pager() {
  const pathname = usePathname();
  const { prev, next } = pagerFor(pathname);

  if (!prev && !next) return null;

  return (
    <div className="mt-16 grid gap-3 border-t border-[var(--border)] pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="glass group rounded-xl p-4 transition hover:border-white/25"
        >
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
            Previous
          </div>
          <div className="mt-1 font-medium text-white group-hover:text-[var(--accent-cyan)]">
            {prev.title}
          </div>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="glass group rounded-xl p-4 text-right transition hover:border-white/25"
        >
          <div className="flex items-center justify-end gap-1.5 text-xs text-[var(--muted)]">
            Next
            <ArrowIcon className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1 font-medium text-white group-hover:text-[var(--accent-cyan)]">
            {next.title}
          </div>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

function ArrowIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
