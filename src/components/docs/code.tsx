"use client";

import { useState } from "react";

export type Lang =
  | "python"
  | "ts"
  | "tsx"
  | "js"
  | "bash"
  | "json"
  | "yaml"
  | "text";

const KEYWORDS = new Set([
  // shared / js / ts
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "import", "from", "export", "default", "class", "extends", "implements",
  "interface", "type", "enum", "new", "async", "await", "try", "catch",
  "finally", "throw", "of", "in", "typeof", "instanceof", "void", "as",
  "public", "private", "protected", "readonly", "static", "switch", "case",
  "break", "continue", "yield", "this", "super", "null", "undefined",
  // python
  "def", "lambda", "elif", "pass", "raise", "with", "and", "or", "not", "is",
  "None", "True", "False", "self", "global", "nonlocal", "del", "assert",
]);

const BUILTINS = new Set([
  "print", "len", "range", "str", "int", "float", "dict", "list", "set",
  "tuple", "bool", "open", "enumerate", "zip", "map", "filter", "console",
  "process", "JSON", "Promise", "Object", "Array", "Number", "String",
  "require", "module", "exports", "__name__",
]);

const TOKEN_RE =
  /(#.*$|\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/gm;

function highlight(code: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > last) out.push(code.slice(last, match.index));
    const [full, comment, string, number, ident] = match;

    if (comment !== undefined) {
      out.push(<span key={key++} className="tok-c">{comment}</span>);
    } else if (string !== undefined) {
      out.push(<span key={key++} className="tok-s">{string}</span>);
    } else if (number !== undefined) {
      out.push(<span key={key++} className="tok-n">{number}</span>);
    } else if (ident !== undefined) {
      const after = code[match.index + full.length];
      if (KEYWORDS.has(ident)) {
        out.push(<span key={key++} className="tok-k">{ident}</span>);
      } else if (after === "(") {
        out.push(<span key={key++} className="tok-f">{ident}</span>);
      } else if (BUILTINS.has(ident)) {
        out.push(<span key={key++} className="tok-b">{ident}</span>);
      } else {
        out.push(ident);
      }
    }
    last = match.index + full.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

const LANG_LABEL: Record<Lang, string> = {
  python: "Python",
  ts: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  bash: "Shell",
  json: "JSON",
  yaml: "YAML",
  text: "Text",
};

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-black/40 px-2 py-1 text-[11px] text-[var(--muted)] transition hover:text-white"
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <CheckIcon className="h-3 w-3 text-emerald-400" /> Copied
        </>
      ) : (
        <>
          <CopyIcon className="h-3 w-3" /> Copy
        </>
      )}
    </button>
  );
}

function Pre({ code, lang }: { code: string; lang: Lang }) {
  return (
    <pre className="code-block overflow-x-auto px-4 py-3.5 text-[13px] leading-[1.65]">
      <code>{lang === "text" ? code : highlight(code)}</code>
    </pre>
  );
}

export function CodeBlock({
  code,
  lang = "text",
  filename,
}: {
  code: string;
  lang?: Lang;
  filename?: string;
}) {
  const trimmed = code.replace(/\n$/, "");
  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-black/20 px-4 py-2">
        <span className="font-mono text-[11px] text-[var(--muted)]">
          {filename ?? LANG_LABEL[lang]}
        </span>
        <CopyButton code={trimmed} />
      </div>
      <Pre code={trimmed} lang={lang} />
    </div>
  );
}

export type Tab = {
  label?: string;
  lang: Lang;
  code: string;
  filename?: string;
};

export function CodeTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  const trimmed = tab.code.replace(/\n$/, "");
  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-black/20 pr-3">
        <div className="flex items-stretch overflow-x-auto">
          {tabs.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`whitespace-nowrap border-b-2 px-4 py-2 text-[12.5px] transition ${
                i === active
                  ? "border-[var(--accent-cyan)] text-white"
                  : "border-transparent text-[var(--muted)] hover:text-white"
              }`}
            >
              {t.label ?? LANG_LABEL[t.lang]}
            </button>
          ))}
        </div>
        <CopyButton code={trimmed} />
      </div>
      {tab.filename && (
        <div className="border-b border-[var(--border)] px-4 py-1.5 font-mono text-[11px] text-[var(--muted)]">
          {tab.filename}
        </div>
      )}
      <Pre code={trimmed} lang={tab.lang} />
    </div>
  );
}

function CopyIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12l4.5 4.5L19 7" />
    </svg>
  );
}
