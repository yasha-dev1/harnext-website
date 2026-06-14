export type BlogPost = {
  slug: string;
  title: string;
  /** Short summary used on the index and as the page description. */
  description: string;
  /** ISO 8601 date, e.g. "2026-06-14". */
  date: string;
  /** Display date, e.g. "June 14, 2026". */
  dateLabel: string;
  author: string;
  readingTime: string;
  tag: string;
};

/** Posts, newest first. The index page and each post route read from here. */
export const POSTS: BlogPost[] = [
  {
    slug: "mid-run-steering",
    title: "Steer the agent mid-run — no abort, no re-prompt",
    description:
      "Watch the agent head down the wrong path and you used to Ctrl-C, lose the run, and start over. Now you just keep typing: messages queue while it generates and inject at the next turn boundary — in the REPL and over headless stream-json.",
    date: "2026-06-14",
    dateLabel: "June 14, 2026",
    author: "The harnext team",
    readingTime: "6 min read",
    tag: "Release",
  },
  {
    slug: "background-jobs",
    title: "Background jobs: run dev servers and watch builds without blocking the agent",
    description:
      "Long-running commands no longer freeze the agent. run_in_background returns a shell id immediately; bash_output streams the logs and kill_shell stops it — all visible in a live /bashes viewer.",
    date: "2026-06-14",
    dateLabel: "June 14, 2026",
    author: "The harnext team",
    readingTime: "6 min read",
    tag: "Release",
  },
  {
    slug: "image-input",
    title: "Multimodal input: paste an image with Ctrl+V, or pass a URL from the SDK",
    description:
      "harnext now takes images. Press Ctrl+V to attach whatever's on your clipboard, or hand session.prompt() a URL, data URI, file path, or base64 — resolveImages() fetches and encodes the rest.",
    date: "2026-06-14",
    dateLabel: "June 14, 2026",
    author: "The harnext team",
    readingTime: "6 min read",
    tag: "Release",
  },
  {
    slug: "sandbox-agent-shell",
    title: "Sandbox your AI agent's shell, keep its files on the host",
    description:
      "harnext's new pluggable command executor lets you run an agent's shell commands inside a per-worktree Docker container while file tools stay on the host — one small seam, with truncation, timeouts, streaming, abort, and background shells all intact.",
    date: "2026-06-14",
    dateLabel: "June 14, 2026",
    author: "The harnext team",
    readingTime: "7 min read",
    tag: "Engineering",
  },
  {
    slug: "resumable-sessions",
    title: "Resume any harnext conversation — from the CLI or the SDK",
    description:
      "harnext sessions used to end and take their context with them. Now every run is a durable, per-directory transcript you can pick back up — interactively with harnext --resume, or programmatically through @harnext/core.",
    date: "2026-06-14",
    dateLabel: "June 14, 2026",
    author: "The harnext team",
    readingTime: "7 min read",
    tag: "Release",
  },
  {
    slug: "goal-mode-evaluator-loop",
    title: "Goal mode: the evaluator loop inside harnext",
    description:
      "Type /goal and harnext stops being a single agent. A smart model plans the work and grades every result while a faster executor does the hands-on coding. Here's how that planner–generator–evaluator loop works — and which models to drop into each seat.",
    date: "2026-06-14",
    dateLabel: "June 14, 2026",
    author: "The harnext team",
    readingTime: "8 min read",
    tag: "Engineering",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
