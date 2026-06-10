import Image from "next/image";
import Link from "next/link";

const variations = [
  {
    file: "01-pixel-h.svg",
    name: "Pixel h · chunky",
    note: "Current primary. 2-pixel stroke, white, sharp edges.",
  },
  {
    file: "02-pixel-h-thin.svg",
    name: "Pixel h · thin",
    note: "Single-pixel stroke. Lighter, more like a monospace font glyph.",
  },
  {
    file: "03-pixel-h-dot.svg",
    name: "Dot h",
    note: "Same shape, circles instead of squares. LED / dot-matrix vibe.",
  },
  {
    file: "04-pixel-h-outline.svg",
    name: "Pixel h · outline",
    note: "Hollow squares. Reads as a structural / wireframe mark.",
  },
  {
    file: "05-mono-h.svg",
    name: "Mono h",
    note: "Smooth geometric h, not pixelated. Clean sans-serif feel.",
  },
  {
    file: "06-bracket-h.svg",
    name: "Bracket h · [h]",
    note: "Pixel h enclosed in brackets — calls out the CLI / scripting vibe.",
  },
  {
    file: "07-prompt-h.svg",
    name: "Prompt h · > h",
    note: "Chevron + pixel h. Reads as a terminal prompt. Wider canvas.",
  },
  {
    file: "08-pixel-h-glow.svg",
    name: "Pixel h · glow",
    note: "Chunky h with soft white bloom. Hero-only — too soft at small sizes.",
  },
];

export const metadata = {
  title: "Logo variations · harnext",
};

export default function LogosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/" className="text-sm text-[var(--muted)] hover:text-white">
        ← Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        Logo variations
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Eight white pixel-art and geometric explorations for the harnext mark.
        Each is shown at three sizes (24, 64, 128) on a dark panel and a light
        panel. Pick one (or mix) and I&apos;ll wire it through the site.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {variations.map((v, i) => (
          <article
            key={v.file}
            className="glass overflow-hidden rounded-xl"
          >
            <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  {String(i + 1).padStart(2, "0")} · {v.name}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">
                  /logos/{v.file}
                </div>
              </div>
              <a
                href={`/logos/${v.file}`}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-[var(--border)] px-2 py-1 font-mono text-[10px] text-[var(--muted)] hover:text-white"
              >
                open
              </a>
            </header>
            <p className="px-5 pt-3 text-sm text-[var(--muted)]">{v.note}</p>

            <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
              <PreviewBox bg="dark" file={v.file} />
              <PreviewBox bg="light" file={v.file} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function PreviewBox({
  bg,
  file,
}: {
  bg: "dark" | "light";
  file: string;
}) {
  const isDark = bg === "dark";
  // Wide assets (07) get smaller heights so they fit the row.
  const wide = file.startsWith("07");
  const sizes = wide ? [40, 80, 120] : [24, 64, 128];
  return (
    <div
      className={`flex flex-col items-center gap-4 px-5 py-6 ${
        isDark ? "bg-[#07080b]" : "bg-white"
      }`}
    >
      <div className="flex items-end justify-center gap-6">
        {sizes.map((s) => (
          <div key={s} className="flex flex-col items-center gap-1.5">
            <Image
              src={`/logos/${file}`}
              alt=""
              width={wide ? Math.round(s * 1.25) : s}
              height={s}
              className={isDark ? "" : "[filter:invert(1)]"}
              unoptimized
            />
            <span
              className={`font-mono text-[10px] ${
                isDark ? "text-[var(--muted)]" : "text-zinc-500"
              }`}
            >
              {s}px
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
