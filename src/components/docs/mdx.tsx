import Link from "next/link";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Page intro paragraph — larger, lighter. */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="not-prose mb-2 text-lg leading-relaxed text-[var(--muted)]">
      {children}
    </p>
  );
}

export function H2({ children }: { children: string }) {
  const id = slugify(children);
  return (
    <h2 id={id}>
      {children}
      <a href={`#${id}`} className="anchor" aria-hidden>
        #
      </a>
    </h2>
  );
}

export function H3({ children }: { children: string }) {
  const id = slugify(children);
  return (
    <h3 id={id}>
      {children}
      <a href={`#${id}`} className="anchor" aria-hidden>
        #
      </a>
    </h3>
  );
}

type CalloutKind = "note" | "tip" | "warning" | "info" | "check";

const CALLOUT: Record<
  CalloutKind,
  { border: string; bg: string; fg: string; icon: ReactNode }
> = {
  note: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/[0.07]",
    fg: "text-sky-300",
    icon: <InfoIcon className="h-4 w-4" />,
  },
  info: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/[0.07]",
    fg: "text-violet-300",
    icon: <InfoIcon className="h-4 w-4" />,
  },
  tip: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/[0.07]",
    fg: "text-emerald-300",
    icon: <BulbIcon className="h-4 w-4" />,
  },
  check: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/[0.07]",
    fg: "text-emerald-300",
    icon: <CheckCircleIcon className="h-4 w-4" />,
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/[0.07]",
    fg: "text-amber-300",
    icon: <WarnIcon className="h-4 w-4" />,
  },
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutKind;
  title?: string;
  children: ReactNode;
}) {
  const c = CALLOUT[type];
  return (
    <div
      className={`not-prose my-5 flex gap-3 rounded-xl border ${c.border} ${c.bg} px-4 py-3.5`}
    >
      <span className={`mt-0.5 shrink-0 ${c.fg}`}>{c.icon}</span>
      <div className="text-[0.9rem] leading-relaxed text-[var(--doc-body)]">
        {title && (
          <div className={`mb-0.5 font-semibold ${c.fg}`}>{title}</div>
        )}
        {children}
      </div>
    </div>
  );
}

export function CardGroup({
  cols = 2,
  children,
}: {
  cols?: 1 | 2 | 3;
  children: ReactNode;
}) {
  const grid =
    cols === 3
      ? "sm:grid-cols-3"
      : cols === 1
        ? "grid-cols-1"
        : "sm:grid-cols-2";
  return (
    <div className={`not-prose my-6 grid gap-3 ${grid}`}>{children}</div>
  );
}

export function Card({
  title,
  href,
  icon,
  children,
}: {
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const inner = (
    <>
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="rounded-md border border-[var(--border)] bg-black/30 p-1.5 text-[var(--accent-cyan)]">
            {icon}
          </span>
        )}
        <span className="font-semibold text-white">{title}</span>
      </div>
      {children && (
        <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--muted)]">
          {children}
        </p>
      )}
    </>
  );
  const cls =
    "doc-card glass block rounded-xl p-4 transition hover:border-white/25";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  let i = 0;
  const numbered = Children.map(children, (child) =>
    isValidElement<{ n?: number }>(child)
      ? cloneElement(child, { n: ++i })
      : child,
  );
  return (
    <div className="not-prose my-6 flex flex-col gap-6 border-l border-[var(--border)] pl-7">
      {numbered}
    </div>
  );
}

export function Step({
  title,
  n,
  children,
}: {
  title: string;
  n?: number;
  children: ReactNode;
}) {
  const num = n ?? 1;
  return (
    <div className="relative">
      <span className="absolute -left-[2.55rem] flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel)] font-mono text-xs text-[var(--accent-cyan)]">
        {num}
      </span>
      <div className="mb-1 font-semibold text-white">{title}</div>
      <div className="text-[0.9rem] leading-relaxed text-[var(--doc-body)]">
        {children}
      </div>
    </div>
  );
}

export function Properties({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-[var(--border)]">
      {children}
    </div>
  );
}

export function Property({
  name,
  type,
  required,
  defaultValue,
  children,
}: {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border)] px-4 py-3 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <code className="font-mono text-[13px] font-medium text-white">
          {name}
        </code>
        <span className="font-mono text-[11.5px] text-[var(--accent-purple)]">
          {type}
        </span>
        {required ? (
          <span className="rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-rose-300">
            required
          </span>
        ) : (
          <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            optional
          </span>
        )}
        {defaultValue && (
          <span className="font-mono text-[11px] text-[var(--muted)]">
            default: <span className="text-[var(--accent-cyan)]">{defaultValue}</span>
          </span>
        )}
      </div>
      <div className="mt-1.5 text-[0.875rem] leading-relaxed text-[var(--muted)]">
        {children}
      </div>
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="not-prose inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--panel)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]">
      {children}
    </span>
  );
}

/* --- icons --- */
function InfoIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" />
    </svg>
  );
}
function BulbIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
    </svg>
  );
}
function WarnIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}
function CheckCircleIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}
