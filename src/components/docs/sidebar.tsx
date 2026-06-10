"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { docsNav } from "@/lib/docs-nav";

function NavTree({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-7">
      {docsNav.map((group) => (
        <div key={group.title}>
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {group.title}
          </div>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center rounded-md px-3 py-1.5 text-[13.5px] transition ${
                      active
                        ? "bg-[var(--accent-cyan)]/10 font-medium text-white"
                        : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="mr-2 h-3.5 w-0.5 rounded-full bg-[var(--accent-cyan)]" />
                    )}
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Desktop rail — sticky, hidden below lg. */
export function DocsSidebar() {
  return (
    <aside className="hidden md:block">
      <div className="doc-scroll sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4">
        <NavTree />
      </div>
    </aside>
  );
}

/** Mobile hamburger + slide-over drawer. Rendered inside the top bar. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-white"
      >
        <MenuIcon className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="doc-scroll absolute left-0 top-0 h-full w-[19rem] max-w-[85vw] overflow-y-auto border-r border-[var(--border)] bg-[var(--background)] p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Documentation
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-white"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <NavTree onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function CloseIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
