import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./sidebar";

const GITHUB_URL = "https://github.com/QualityUnit/harnext";
const X_URL = "https://x.com/Yasha_br";

export function DocsTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3 md:hidden">
          <MobileNav />
        </div>

        <Link href="/" aria-label="harnext home" className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="harnext" width={26} height={28} priority />
          <span className="hidden text-sm font-semibold text-white sm:inline">
            harnext
          </span>
          <span className="hidden rounded-full border border-[var(--border)] bg-[var(--panel)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] sm:inline">
            Docs
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="hidden text-sm text-[var(--muted)] hover:text-white sm:inline"
          >
            Home
          </Link>
          <a
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter)"
            className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)] transition hover:text-white"
          >
            <XIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function XIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function GithubIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
