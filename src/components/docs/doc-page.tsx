import type { ReactNode } from "react";
import { Lead } from "./mdx";
import { Pager } from "./pager";

export function DocPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-3xl">
      <article className="doc-prose doc-fade-in">
        {eyebrow && (
          <div className="not-prose mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent-cyan)]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-[2.1rem] font-semibold leading-tight tracking-tight text-[var(--doc-heading)]">
          {title}
        </h1>
        {description && <Lead>{description}</Lead>}
        {children}
      </article>
      <Pager />
    </div>
  );
}
