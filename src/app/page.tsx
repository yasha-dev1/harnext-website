import Image from "next/image";
import Link from "next/link";

const GITHUB_URL = "https://github.com/QualityUnit/harnext";
const NPM_URL = "https://www.npmjs.com/package/harnext";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <LocalAgentSection />
        <AgentsSection />
        <HarnessSection />
        <QuickStart />
        <RunnerSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)]/60 bg-[var(--background)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="harnext" className="flex items-center">
          <Image src="/logo.svg" alt="harnext" width={30} height={32} priority />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#local" className="hover:text-white">The agent</a>
          <a href="#agents" className="hover:text-white">Agents</a>
          <a href="#harness" className="hover:text-white">The harness</a>
          <a href="#quickstart" className="hover:text-white">Quick start</a>
          <a href="#runner" className="hover:text-white">Self-hosted runner</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] hover:text-white sm:inline-flex"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="#quickstart"
            className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-white/90"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <div className="flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)]/60 px-3 py-1 text-xs text-[var(--muted)]">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          v0 demo · the AI-managed software development workflow
        </div>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          An AI coding agent
          <br />
          with <span className="text-gradient">harness engineering</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
          <code className="font-mono text-white">harnext</code> is an interactive
          terminal agent that reads, writes, and edits files, runs shell, and
          drives MCP servers — and generates GitHub Actions workflows so AI can
          pick up issues and ship them, end to end.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CopyableInstall command="npm install -g harnext" />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm font-medium text-white hover:border-white/30"
          >
            <GithubIcon className="h-4 w-4" />
            View on GitHub
          </a>
        </div>

        <p className="mt-3 text-xs text-[var(--muted)]">
          Requires Node.js ≥ 20 · MIT licensed · Works with Anthropic, OpenAI,
          Google, Ollama, and 20+ providers via{" "}
          <span className="font-mono">pi-ai</span>
        </p>

        <div className="mt-14">
          <HarnextFlow />
        </div>
      </div>
    </section>
  );
}

function CopyableInstall({ command }: { command: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 font-mono text-sm">
      <span className="text-[var(--muted)]">$</span>
      <span className="text-white">{command}</span>
    </div>
  );
}

/**
 * Animated walkthrough: issue created → harnext picks up → labels advance
 * triage → plan → implement → PR opened → browser proof posted as a comment.
 * Loops every 14s; respects prefers-reduced-motion.
 */
function HarnextFlow() {
  return (
    <div
      className="glass overflow-hidden rounded-xl shadow-[0_30px_120px_-40px_rgba(124,58,237,0.45)]"
      aria-label="Animated walkthrough of a harnext-managed GitHub issue"
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <div className="ml-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-black/40 px-2.5 py-1 font-mono text-[11px] text-[var(--muted)]">
          <LockIcon className="h-3 w-3" />
          github.com/qualityunit/harnext-demo/issues/42
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT — issue + activity */}
        <div className="border-b border-[var(--border)] p-5 lg:border-b-0 lg:border-r">
          {/* issue header */}
          <div className="hf-anim flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Open
            </span>
            <span className="font-mono text-[12px] text-[var(--muted)]">#42</span>
            <span className="text-[15px] font-semibold text-white">
              Add a dark-mode toggle to the settings page
            </span>
          </div>
          <div className="hf-anim mt-1 flex items-center gap-2 text-[11px] text-[var(--muted)]">
            <span>opened by</span>
            <span className="font-mono">@yasha</span>
            <span>·</span>
            <span>just now</span>
          </div>

          {/* pipeline strip */}
          <div className="mt-6 text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Pipeline
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <StagePill className="hf-stage-triage">harnext:triage</StagePill>
            <Connector />
            <StagePill className="hf-stage-plan">harnext:plan</StagePill>
            <Connector />
            <StagePill className="hf-stage-implement">harnext:implement</StagePill>
            <Connector />
            <StagePill className="hf-stage-pr">pr#43 opened</StagePill>
          </div>

          {/* activity log */}
          <div className="mt-6 text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Activity
          </div>
          <ul className="mt-3 space-y-2.5 text-[12.5px]">
            <ActivityItem klass="hf-d10" color="text-emerald-300" badge="🔍">
              <span className="font-mono text-white">harnext-bot</span>{" "}
              picked up the issue
              <Thinking />
            </ActivityItem>
            <ActivityItem klass="hf-d22" color="text-sky-300" badge="📋">
              generated plan ·{" "}
              <span className="text-[var(--muted)]">3 steps</span>
            </ActivityItem>
            <ActivityItem klass="hf-d40" color="text-violet-300" badge="✏️">
              implementing on{" "}
              <span className="font-mono text-white">harnext/dark-mode</span>
            </ActivityItem>
            <ActivityItem klass="hf-d56" color="text-pink-300" badge="🚀">
              pushed branch · opened{" "}
              <span className="font-mono text-white">PR #43</span>
            </ActivityItem>
            <ActivityItem klass="hf-d72" color="text-amber-300" badge="📸">
              posted browser-verify proof to PR
            </ActivityItem>
          </ul>
        </div>

        {/* RIGHT — PR card with browser proof */}
        <div className="p-5">
          <div className="hf-d56 glass rounded-lg p-4">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 font-medium text-violet-300">
                <PrIcon className="h-3 w-3" />
                Pull request
              </span>
              <span className="font-mono text-[var(--muted)]">#43</span>
              <span className="ml-auto font-mono text-[10px] text-[var(--muted)]">
                opened by @harnext-bot
              </span>
            </div>
            <div className="mt-2 text-[14px] font-semibold text-white">
              Add a dark-mode toggle to the settings page
            </div>
            <div className="mt-1 font-mono text-[11px] text-[var(--muted)]">
              harnext/dark-mode → main · 4 files changed · +87 −12
            </div>

            {/* browser proof comment */}
            <div className="hf-d72 mt-4">
              <div className="mb-2 flex items-center gap-2 text-[11px] text-[var(--muted)]">
                <BotIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  <span className="font-mono text-white">harnext-bot</span>{" "}
                  commented · browser proof
                </span>
              </div>
              <BrowserProof />
            </div>
          </div>

          {/* checks row */}
          <div className="hf-d72 mt-4 flex items-center gap-3 text-[11px] text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              ci · pass
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              browser-verify · pass
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              review · ok
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StagePill({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`hf-stage inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10.5px] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function Connector() {
  return <span className="hf-connector h-[2px] w-3 rounded-full" />;
}

function ActivityItem({
  klass,
  color,
  badge,
  children,
}: {
  klass: string;
  color: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <li className={`${klass} flex items-start gap-2.5`}>
      <span
        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/50 text-[11px] ${color}`}
      >
        {badge}
      </span>
      <span className="text-[var(--muted)]">{children}</span>
    </li>
  );
}

function Thinking() {
  return (
    <span className="ml-1 inline-flex items-center gap-0.5 align-middle">
      <span className="hf-think-dot inline-block h-1 w-1 rounded-full bg-current" />
      <span className="hf-think-dot inline-block h-1 w-1 rounded-full bg-current" />
      <span className="hf-think-dot inline-block h-1 w-1 rounded-full bg-current" />
    </span>
  );
}

/** A miniature browser screenshot of "the project" with a dark-mode toggle. */
function BrowserProof() {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[#0a0c12]">
      <div className="flex items-center gap-1.5 border-b border-[var(--border)] bg-black/40 px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-green-400/80" />
        <span className="ml-2 font-mono text-[9.5px] text-[var(--muted)]">
          demo.app/settings
        </span>
      </div>
      <div className="px-3 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-white">Settings</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-black/30 px-1.5 py-0.5 text-[9px] text-[var(--muted)]">
            <MoonIcon className="h-2.5 w-2.5 text-violet-300" />
            dark
          </span>
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between rounded border border-[var(--border)] bg-black/30 px-2 py-1.5">
            <span className="text-[9.5px] text-[var(--muted)]">Theme</span>
            <span className="inline-flex h-3 w-6 items-center rounded-full bg-violet-500/70 p-0.5">
              <span className="ml-auto h-2 w-2 rounded-full bg-white" />
            </span>
          </div>
          <div className="h-1.5 w-3/4 rounded bg-white/[0.06]" />
          <div className="h-1.5 w-1/2 rounded bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

function FeatureGrid() {
  const features = [
    {
      title: "Interactive terminal agent",
      body:
        "A REPL that reads, writes, edits, runs bash, and drives MCP servers. One-shot mode with -p for scripts and CI.",
      icon: <TerminalIcon className="h-5 w-5" />,
    },
    {
      title: "20+ providers, one CLI",
      body:
        "Anthropic, OpenAI, Google, Ollama, NVIDIA, and more via pi-ai. Switch with --provider and --model on the fly.",
      icon: <PlugIcon className="h-5 w-5" />,
    },
    {
      title: "Harness for your repo",
      body:
        "Generates GitHub Actions workflows that pick up issues by label, run the right stage, and post results back.",
      icon: <PipelineIcon className="h-5 w-5" />,
    },
    {
      title: "Self-hosted runner",
      body:
        "Register a daemon on your own machine (systemd / launchd) and run stages on your hardware. Idempotent install.",
      icon: <ServerIcon className="h-5 w-5" />,
    },
    {
      title: "Skills & MCP",
      body:
        "Bundle reusable skills (review, init, browser-verify) and connect any MCP server with proxy or direct mode.",
      icon: <SparklesIcon className="h-5 w-5" />,
    },
    {
      title: "Replays & status",
      body:
        "harnext status shows active runs; replays let you re-run any session step-by-step. Sessions live in ~/.harnext.",
      icon: <RewindIcon className="h-5 w-5" />,
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Features"
        title="Everything you'd build into a coding agent — in one CLI."
        subtitle="harnext ships the agent, the harness, and the runner. No glue scripts, no agent server."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass group rounded-xl p-5 transition hover:border-white/20"
          >
            <div className="flex items-center gap-3 text-[var(--accent-cyan)]">
              <div className="rounded-md border border-[var(--border)] bg-black/30 p-2">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LocalAgentSection() {
  const points = [
    {
      title: "Tiny tool surface",
      body: "read · write · edit · bash · skill · MCP. That's the whole agent. No wrappers, no glue scripts, no hidden orchestration.",
    },
    {
      title: "Local-first models",
      body: "Point harnext at Ollama or NVIDIA out of the box, or any OpenAI-compatible endpoint. Your code never has to leave your machine.",
    },
    {
      title: "Switch providers per stage",
      body: "Run interactive REPL on Anthropic, then dispatch a CI stage to a local llama. One flag: --provider, --model.",
    },
    {
      title: "Open & inspectable",
      body: "MIT-licensed monorepo, plain-JSON sessions in ~/.harnext. Replay any run, audit any tool call.",
    },
  ];

  const providers = [
    { name: "Ollama", local: true },
    { name: "NVIDIA NIM", local: true },
    { name: "llama.cpp", local: true },
    { name: "vLLM", local: true },
    { name: "Anthropic", local: false },
    { name: "OpenAI", local: false },
    { name: "Google", local: false },
    { name: "Mistral", local: false },
    { name: "+ 12 more", local: false },
  ];

  return (
    <section id="local" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT — copy + value props */}
        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--accent-cyan)]">
            The agent
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Minimal agent.
            <br />
            <span className="text-gradient">Local models.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[var(--muted)]">
            harnext is a small, focused CLI agent. Six tools, a few skills, and
            an MCP bridge — that's the whole executor. Point it at a local model
            and your codebase never leaves the machine.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {points.map((p) => (
              <li
                key={p.title}
                className="rounded-lg border border-[var(--border)] bg-[var(--panel)]/60 p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckIcon className="h-4 w-4 text-[var(--accent-cyan)]" />
                  {p.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
              Providers
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {providers.map((p) => (
                <span
                  key={p.name}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                    p.local
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-[var(--border)] bg-[var(--panel)]/60 text-[var(--muted)]"
                  }`}
                >
                  {p.local && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                  {p.name}
                </span>
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] text-[var(--muted)]">
              ● local · ○ cloud — all routed through{" "}
              <span className="text-white">pi-ai</span>
            </p>
          </div>
        </div>

        {/* RIGHT — terminal showing local-model session */}
        <div className="glass overflow-hidden rounded-xl shadow-[0_30px_120px_-40px_rgba(34,211,238,0.35)]">
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
            <span className="ml-3 font-mono text-xs text-[var(--muted)]">
              ~/projects/api · localhost
            </span>
          </div>
          <pre className="code-block overflow-x-auto p-5 text-[13px] leading-7">
{`$ harnext --provider ollama --model llama3.2

✔ ollama @ http://localhost:11434
✔ tools: read · write · edit · bash · skill · mcp
✔ sessions: ~/.harnext/sessions

> add input validation to the signup endpoint

⏺ Read(packages/api/signup.ts)
⏺ Edit(packages/api/signup.ts)
   ↳ added zod schema · 4 invariants
⏺ Bash(npm test --workspace=api -- signup)
   ↳ 9 passing · 0 failing  ✓

(no tokens left the host · 0 bytes uploaded)`}
          </pre>
        </div>
      </div>
    </section>
  );
}

function AgentsSection() {
  const agents = [
    {
      name: "harnext",
      logo: "/logo.svg",
      logoSize: { w: 32, h: 34 },
      tagline: "Built-in. The interactive REPL.",
      body: "Read, write, edit, bash, and MCP — driven by your provider of choice (Anthropic, OpenAI, Google, Ollama, +20 more via pi-ai).",
      accent: "rgba(255,255,255,0.15)",
    },
    {
      name: "Claude Code",
      logo: "/agents/anthropic.svg",
      logoSize: { w: 34, h: 34 },
      tagline: "Anthropic's CLI, dispatched.",
      body: "harnext can hand a stage to claude-code with --max-turns and sandbox flags applied automatically.",
      accent: "rgba(204,120,92,0.35)",
    },
    {
      name: "Codex",
      logo: "/agents/openai.svg",
      logoSize: { w: 34, h: 34 },
      tagline: "OpenAI's CLI, dispatched.",
      body: "Same interface for the codex CLI — approval and sandbox bypass flags wired in for unattended runs.",
      accent: "rgba(16,163,127,0.35)",
    },
  ];
  return (
    <section
      id="agents"
      className="border-y border-[var(--border)]/60 bg-[var(--panel-2)]/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Coding agents"
          title="harnext drives itself — or any agent you trust."
          subtitle="Each pipeline stage can dispatch a different executor. Use the harnext REPL for interactive work, and pick claude-code or codex per-stage when running unattended in CI."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {agents.map((a) => (
            <div
              key={a.name}
              className="glass relative overflow-hidden rounded-xl p-6 transition hover:border-white/20"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${a.accent}, transparent)`,
                }}
              />
              <div className="flex h-12 items-center">
                <Image
                  src={a.logo}
                  alt={`${a.name} logo`}
                  width={a.logoSize.w}
                  height={a.logoSize.h}
                  unoptimized
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {a.name}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">
                {a.tagline}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {a.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Agent names and marks are property of their respective owners; shown
          here only to indicate compatibility.
        </p>
      </div>
    </section>
  );
}

function HarnessSection() {
  const stages = [
    { label: "issue:tagged", desc: "Tagger workflow applies the first stage label" },
    { label: "stage:plan", desc: "Agent reads the issue, writes a plan as a comment" },
    { label: "stage:implement", desc: "Agent opens a branch, edits files, opens a PR" },
    { label: "stage:review", desc: "Reviewer agent comments; fix workflow re-runs" },
    { label: "stage:merged", desc: "Post-merge cleanup runs after the PR lands" },
  ];

  return (
    <section
      id="harness"
      className="border-y border-[var(--border)]/60 bg-[var(--panel-2)]/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="The harness"
          title="From a GitHub issue to a merged PR — on rails."
          subtitle="harnext setup writes a staged pipeline of GitHub Actions workflows. Each stage is a label; promoting a label triggers the next stage. Run on GitHub-hosted runners, your self-hosted daemon, or both."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="glass rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--muted)]">
              <PipelineIcon className="h-4 w-4 text-[var(--accent-purple)]" />
              Pipeline
            </div>
            <ol className="space-y-3">
              {stages.map((s, i) => (
                <li key={s.label} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-black/40 font-mono text-xs text-[var(--muted)]">
                    {i + 1}
                  </span>
                  <div>
                    <code className="rounded bg-[var(--panel)] px-1.5 py-0.5 font-mono text-xs text-[var(--accent-cyan)]">
                      {s.label}
                    </code>
                    <p className="mt-1 text-sm text-[var(--muted)]">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--muted)]">
              <FileIcon className="h-4 w-4 text-[var(--accent-pink)]" />
              .github/workflows/stage-implement.yml
            </div>
            <pre className="code-block overflow-x-auto rounded-md bg-black/40 p-4 text-[12.5px] leading-6">
{`name: stage-implement
on:
  issues:
    types: [labeled]
jobs:
  run:
    if: github.event.label.name == 'stage:implement'
    runs-on: [self-hosted, harnext-<hash>]
    steps:
      - uses: actions/checkout@v4
      - run: npm i -g harnext
      - run: harnext --provider anthropic \\
              -p "Implement issue #\${{ github.event.issue.number }}"
      - run: gh issue edit \${{ github.event.issue.number }} \\
              --remove-label stage:implement \\
              --add-label   stage:review`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStart() {
  return (
    <section id="quickstart" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Quick start"
        title="Three commands to a running agent."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <Step n={1} title="Install">
          <CodeBox lines={["$ npm install -g harnext"]} />
          <p className="mt-3 text-sm text-[var(--muted)]">
            Requires Node.js ≥ 20. Stored at <code className="font-mono">~/.harnext</code>.
          </p>
        </Step>
        <Step n={2} title="Set up the pipeline">
          <CodeBox
            lines={[
              "$ cd my-repo",
              "$ harnext setup",
              "✔ generated 5 workflows",
            ]}
          />
          <p className="mt-3 text-sm text-[var(--muted)]">
            Adds labels, writes the staged GitHub Actions workflows, and
            (optionally) registers a self-hosted runner.
          </p>
        </Step>
        <Step n={3} title="Use it as your coding agent">
          <CodeBox
            lines={[
              "$ harnext",
              "> refactor packages/api/auth",
              "⏺ Read · Edit · Bash · ✓",
            ]}
          />
          <p className="mt-3 text-sm text-[var(--muted)]">
            The same CLI is your interactive agent — read, write, run, drive
            MCP. Pass <code className="font-mono">-p</code> for one-shot use.
          </p>
        </Step>
      </div>
    </section>
  );
}

function RunnerSection() {
  return (
    <section
      id="runner"
      className="border-t border-[var(--border)]/60 bg-[var(--panel-2)]/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-wider text-[var(--accent-cyan)]">
              Self-hosted runner
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Run the agent on your own hardware.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              <code className="font-mono">harnext setup</code> can register a
              GitHub Actions self-hosted runner pinned to your repo with a
              project-specific label, install it as a systemd or launchd service,
              and keep it alive across reboots. <code className="font-mono">harnext runner status</code>{" "}
              and <code className="font-mono">harnext runner logs</code> tail the daemon.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
              {[
                "Idempotent install — re-running skips work that's already done",
                "Project-pinned label prevents shared-host runners from picking the wrong job",
                "Public-repo guardrail: confirms fork-PR approval gates are on",
                "Best-effort cleanup on uninstall: deregister, stop service, drop artifacts",
              ].map((b) => (
                <li key={b} className="flex gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-cyan)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--muted)]">
              <ServerIcon className="h-4 w-4 text-[var(--accent-purple)]" />
              Runner status
            </div>
            <pre className="code-block overflow-x-auto rounded-md bg-black/40 p-4 text-[12.5px] leading-6">
{`$ harnext runner status

  service     active (running)  since 2h ago
  registered  ✓ harnext-9f4ac1b
  online      ✓ visible to GitHub
  labels      self-hosted, harnext-9f4ac1b
  jobs (24h)  18 picked up · 17 ok · 1 failed
  log         ~/.harnext/runner/diag.log`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="glass relative overflow-hidden rounded-2xl px-8 py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(600px 200px at 50% 0%, rgba(124,58,237,0.25), transparent 70%)",
          }}
        />
        <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
          Build the harness. Ship the work.
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-[var(--muted)]">
          harnext is open source and MIT licensed. Star it on GitHub or install
          from npm and try the agent in your terminal in under a minute.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
          >
            <GithubIcon className="h-4 w-4" />
            Star on GitHub
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm font-medium text-white hover:border-white/30"
          >
            <NpmIcon className="h-4 w-4" />
            View on npm
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)]/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-[var(--muted)] sm:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={21} height={22} />
          <span>harnext · MIT · made by QualityUnit</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-white">
            GitHub
          </a>
          <a href={NPM_URL} target="_blank" rel="noreferrer" className="hover:text-white">
            npm
          </a>
          <a href="#quickstart" className="hover:text-white">
            Quick start
          </a>
        </div>
      </div>
    </footer>
  );
}

/* --- presentational helpers --- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <span className="text-xs uppercase tracking-wider text-[var(--accent-cyan)]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[var(--muted)]">{subtitle}</p>
      )}
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-black/40 font-mono text-xs text-[var(--muted)]">
          {n}
        </span>
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CodeBox({ lines }: { lines: string[] }) {
  return (
    <pre className="code-block overflow-x-auto rounded-md border border-[var(--border)] bg-black/40 p-3 text-[13px] leading-6">
      {lines.join("\n")}
    </pre>
  );
}

/* --- icons (inline svg, no extra deps) --- */

function GithubIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
function NpmIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M2 7h20v10H12v2H7v-2H2V7Zm2 8h3v-6h2v6h2V9H4v6Zm9-6v8h2v-2h2v-6h-4Zm2 2h1v2h-1V11Zm5-2v6h2v-6h-2Z" />
    </svg>
  );
}
function TerminalIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </svg>
  );
}
function PlugIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 2v4M15 2v4M7 6h10v6a5 5 0 0 1-10 0V6ZM12 17v5" />
    </svg>
  );
}
function PipelineIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 6h10M5 8v8M19 8v8M7 18h10" />
    </svg>
  );
}
function ServerIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}
function SparklesIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3ZM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" />
    </svg>
  );
}
function RewindIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="11 19 2 12 11 5 11 19" />
      <polygon points="22 19 13 12 22 5 22 19" />
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
function FileIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}
function LockIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function PrIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M6 8.2v7.6M9 18h6.8M18 9v6.8M14 5l4 4-4 4" />
    </svg>
  );
}
function BotIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 5v3M9 13h.01M15 13h.01M9 17h6" />
    </svg>
  );
}
function MoonIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a8.5 8.5 0 1 0 9.8 9.8Z" />
    </svg>
  );
}
