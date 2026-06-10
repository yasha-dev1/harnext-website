import Image from "next/image";
import Link from "next/link";
import Reveal from "./reveal";
import Cmd from "./cmd";
import HeroTerminal from "./hero-terminal";
import Dashboard from "./dashboard";
import { HeroFlow, ContextFlow } from "./flows";
import { GithubIcon, StarIcon, XIcon } from "./icons";

export const GITHUB_ORG = "QualityUnit";
export const GITHUB_URL = `https://github.com/${GITHUB_ORG}/harnext`;
export const CONTEXT_ENGINE_URL = `https://github.com/${GITHUB_ORG}/context-engine`;

/* ---- hero product panels (shared by the umbrella hero and the solo heroes) ---- */

type PanelCta = { href: string; label: string };

export function HarnextPanel({
  delay = "d2",
  cta = { href: "/harnext", label: "Explore →" },
}: {
  delay?: string;
  cta?: PanelCta;
}) {
  return (
    <Reveal as="article" className={`hpanel ${delay}`}>
      <div className="hp-top">
        <span className="hp-idx">01</span>
        <div>
          <div className="hp-name">
            <svg className="hp-logo" viewBox="0 0 60 64" aria-hidden="true"><use href="#logoMark" /></svg>
            {" "}harnext
          </div>
          <div className="hp-tag">The coding agent harness</div>
        </div>
      </div>
      <p className="hp-desc">
        Reads, writes, and edits code, runs shell, and drives MCP — on
        open-source, local, or any provider. The whole harness your team
        runs in the terminal.
      </p>
      <HeroTerminal />
      <div className="hp-cta">
        <Cmd command="npm i -g harnext" />
        <Link className="btn btn-ghost" href={cta.href}>{cta.label}</Link>
      </div>
    </Reveal>
  );
}

export function ContextEnginePanel({
  delay = "d3",
  cta = { href: "/context-engine", label: "See how →" },
}: {
  delay?: string;
  cta?: PanelCta;
}) {
  return (
    <Reveal as="article" className={`hpanel ${delay}`}>
      <div className="hp-top">
        <span className="hp-idx">02</span>
        <div>
          <div className="hp-name"><span className="hp-mark">◇</span> Context Engine</div>
          <div className="hp-tag">The brain of your agent</div>
        </div>
      </div>
      <p className="hp-desc">
        Every event across your org — Slack, HubSpot, Stripe, Jira —
        streams in. The engine ranks and prunes it into token-efficient
        context, wired straight into the harness.
      </p>
      <HeroFlow />
      <div className="hp-cta">
        <Link className="btn btn-ghost" href={cta.href}>{cta.label}</Link>
      </div>
    </Reveal>
  );
}

/* ======================= 01 · HARNEXT ======================= */

export function HarnextSection() {
  return (
    <section className="section" id="harnext">
      <div className="container">
        <Reveal className="sec-head">
          <p className="eyebrow">
            <span className="sq" /> <span className="idx">01</span> — The harness · <span className="name">harnext</span>
          </p>
          <h2>From a one-line task to a reviewed change.<br />On rails.</h2>
          <p className="lede">
            <b>harnext</b> ships the agent, the harness, and the runner — no
            glue scripts, no agent server. Point it at open-source or custom
            models to keep development in-house, and hand your team a harness
            that works out of the box: it reads, writes, and edits files, runs
            shell, drives MCP servers, then runs the whole loop as a staged
            pipeline you can hand off and walk away from.
          </p>
        </Reveal>

        <Reveal className="split wide-left d1">
          <div className="term">
            <div className="term-bar">
              <span className="dot r" /><span className="dot y" /><span className="dot g" />
              <span className="ttl">harnext --provider anthropic</span>
            </div>
            <div className="term-body" style={{ minHeight: 300 }}>
              <div className="ln"><span className="pmt">❯ </span><span className="usr">refactor packages/api/auth — split the session helper</span></div>
              <div className="ln faint">&nbsp;</div>
              <div className="ln"><span className="badge read">read</span> <span className="dim">packages/api/auth/session.ts · 218 lines</span></div>
              <div className="ln"><span className="dim">grep</span> <span className="faint">&quot;createSession&quot; · 9 matches · 4 files</span></div>
              <div className="ln rail">plan · 3 steps — extract <span className="usr">tokens.ts</span>, thin the helper, update imports</div>
              <div className="ln faint">&nbsp;</div>
              <div className="ln"><span className="badge edit">edit</span> <span className="dim">packages/api/auth/tokens.ts</span> <span className="ok">+47 −0</span></div>
              <div className="ln"><span className="badge edit">edit</span> <span className="dim">packages/api/auth/session.ts</span> <span className="ok">+8 −52</span></div>
              <div className="ln"><span className="badge bash">bash</span> <span className="dim">npm test -- auth</span>{"  "}<span className="ok">✓ 23 passing · 1.2s</span></div>
              <div className="ln faint">&nbsp;</div>
              <div className="ln"><span className="dim">↑ 3.1k  ↓ 0.9k tokens · </span><span className="ok">change ready for review</span></div>
            </div>
          </div>

          <div>
            <div className="flist">
              <div className="f">
                <span className="k">Interactive REPL</span>
                <span className="v">A terminal agent that reads, writes, edits, runs bash, and drives MCP servers. One-shot mode with <span className="amb">-p</span> for scripts and automation.</span>
              </div>
              <div className="f">
                <span className="k">Open &amp; custom models</span>
                <span className="v">Anthropic, OpenAI, Google, Ollama, NVIDIA + 20 more — or point <span className="amb">--base-url</span> at a local or self-hosted endpoint and keep everything in-house.</span>
              </div>
              <div className="f">
                <span className="k">Drives any agent</span>
                <span className="v">Run interactive yourself, or hand a stage to <span className="amb">claude-code</span> or <span className="amb">codex</span> with sandbox flags wired in.</span>
              </div>
              <div className="f">
                <span className="k">Runs unattended</span>
                <span className="v">Register a runner on your own hardware as a systemd / launchd service. Idempotent install; picks up where it left off.</span>
              </div>
            </div>
            <div className="chips">
              <span className="chip"><span className="lg"><Image src="/brands/ollama.svg" alt="" width={20} height={20} unoptimized /></span>Ollama</span>
              <span className="chip"><span className="lg"><Image src="/brands/anthropic-icon.svg" alt="" width={20} height={20} unoptimized /></span>Anthropic</span>
              <span className="chip"><span className="lg"><Image src="/brands/openai-icon.svg" alt="" width={20} height={20} unoptimized /></span>OpenAI</span>
              <span className="chip"><span className="lg"><Image src="/brands/google-icon.svg" alt="" width={20} height={20} unoptimized /></span>Google</span>
              <span className="chip"><span className="lg"><Image src="/brands/nvidia.svg" alt="" width={20} height={20} unoptimized /></span>NVIDIA</span>
              <span className="chip muted">+ 20 more</span>
            </div>
            <div className="sec-cta">
              <Cmd command="npm i -g harnext" />
              <Link className="btn btn-ghost" href="/docs">harnext docs →</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==================== 02 · CONTEXT ENGINE ==================== */

export function ContextEngineSection() {
  return (
    <section className="section" id="context">
      <div className="container">
        <Reveal className="sec-head">
          <p className="eyebrow">
            <span className="sq" /> <span className="idx">02</span> — The context engine · <span className="name">context-engine</span>
          </p>
          <h2>Every event in your org,<br />turned into token-efficient context.</h2>
          <p className="lede">
            Stripe events, Slack messages, GitHub activity, Jira and LiveAgent
            tickets, website data — everything that happens across your
            organization streams into the <b>Context Engine</b>. When an agent
            asks, it ranks, prunes, dedupes, and caches so <b>every call
            carries only what matters</b>. Drop it into harnext, Claude Code,
            Codex, or your own loop.
          </p>
        </Reveal>

        <Reveal className="flow d1">
          <ContextFlow />
        </Reveal>

        <Reveal className="d1">
          <Dashboard />
        </Reveal>

        <Reveal className="sources d2">
          <div className="card src">
            <div className="src-hd">
              <span className="src-ico" style={{ background: "#3b1f4d" }}>S</span>
              <span><span className="nm">#general</span><span className="ty">▸ slack channel</span></span>
            </div>
            <div className="src-stats">
              <span><span className="n">412</span><div className="cap">events indexed</div></span>
              <span style={{ textAlign: "right" }}><span className="n">2h ago</span><div className="cap">last sync</div></span>
            </div>
            <div className="src-foot"><span className="pill-live"><span className="d" />Live</span><span className="sync">⚡ synced 2h ago</span></div>
          </div>

          <div className="card src">
            <div className="src-hd">
              <span className="src-ico" style={{ background: "#1c1c1c", border: "1px solid #333" }}>⎇</span>
              <span><span className="nm">qualityunit/urlslab</span><span className="ty">▸ git repository</span></span>
            </div>
            <div className="src-stats">
              <span><span className="n">358</span><div className="cap">events indexed</div></span>
              <span style={{ textAlign: "right" }}><span className="n">2h ago</span><div className="cap">last sync</div></span>
            </div>
            <div className="src-foot"><span className="pill-live"><span className="d" />Live</span><span className="sync">⚡ synced 2h ago</span></div>
          </div>

          <div className="card src">
            <div className="src-hd">
              <span className="src-ico" style={{ background: "#3a2d6d" }}>◆</span>
              <span><span className="nm">#bug-report</span><span className="ty">▸ discord channel</span></span>
            </div>
            <div className="src-stats">
              <span><span className="n">2,738</span><div className="cap">events indexed</div></span>
              <span style={{ textAlign: "right" }}><span className="n">2h ago</span><div className="cap">last sync</div></span>
            </div>
            <div className="src-foot"><span className="pill-live"><span className="d" />Live</span><span className="sync">⚡ synced 2h ago</span></div>
          </div>
        </Reveal>

        <Reveal className="split wide-right" style={{ marginTop: "clamp(56px,8vh,96px)" }}>
          <div className="vstat">
            <div className="vbig">−89%</div>
            <div className="vcap">fewer tokens per query, on average — without the agent losing the thread.</div>
            <div className="vsub">Measured against passing the raw working set. Your mileage varies with repo size and query.</div>
          </div>
          <div>
            <div className="flist">
              <div className="f">
                <span className="k">Continuous index</span>
                <span className="v">Sources stream events into the grid — no manual re-indexing. Whatever your agent queries is always current.</span>
              </div>
              <div className="f">
                <span className="k">Relevance ranking</span>
                <span className="v">Scores and orders candidates per query, then prunes the long tail before it ever reaches the model.</span>
              </div>
              <div className="f">
                <span className="k">Dedup &amp; cache</span>
                <span className="v">Collapses repeats and caches hot context, so repeat calls don&apos;t re-pay for the same tokens.</span>
              </div>
              <div className="f">
                <span className="k">Drop-in for any harness</span>
                <span className="v">A small HTTP + MCP surface. Point harnext, Claude Code, Codex, or your own loop at it.</span>
              </div>
            </div>
            <div className="sec-cta">
              <a className="btn btn-amber" href="#">Book a call</a>
              <Link className="btn btn-ghost" href="/docs">Context Engine docs →</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===================== COMPAT STRIP ===================== */

export function CompatStrip() {
  return (
    <section className="section" style={{ paddingTop: "clamp(48px,8vh,96px)", paddingBottom: "clamp(48px,8vh,96px)" }}>
      <Reveal className="container">
        <div className="compat">
          <span className="lbl">Plugs into the harness you already use →</span>
          <span className="h"><svg className="hlogo" viewBox="0 0 60 64" aria-hidden="true"><use href="#logoMark" /></svg>harnext</span>
          <span className="h"><span className="hlg"><Image src="/brands/anthropic-icon.svg" alt="" width={20} height={20} unoptimized /></span>Claude Code</span>
          <span className="h"><span className="hlg"><Image src="/brands/openai-icon.svg" alt="" width={20} height={20} unoptimized /></span>Codex</span>
          <span className="h"><span className="hlg"><Image src="/brands/pidev.svg" alt="" width={20} height={20} unoptimized /></span>pi.dev</span>
        </div>
      </Reveal>
    </section>
  );
}

/* ======================= QUICK START ======================= */

export function QuickStart() {
  return (
    <section className="section" id="start">
      <div className="container">
        <Reveal className="sec-head">
          <p className="eyebrow"><span className="sq" /> Quick start</p>
          <h2>Three commands to a running agent.</h2>
        </Reveal>
        <Reveal className="steps d1">
          <div className="step">
            <div className="sn">01</div>
            <div className="st">Install</div>
            <div className="scode"><span className="pmt">$</span> npm i -g harnext</div>
            <div className="scap">Requires Node ≥ 20. Everything lives under <span className="amb">~/.harnext</span>.</div>
          </div>
          <div className="step">
            <div className="sn">02</div>
            <div className="st">Wire it up</div>
            <div className="scode">
              <span className="pmt">$</span> cd my-repo{"\n"}
              <span className="pmt">$</span> harnext setup{"\n"}
              <span className="ok">✓ context engine connected · harness ready</span>
            </div>
            <div className="scap">Connects your sources and wires the harness into your repo.</div>
          </div>
          <div className="step">
            <div className="sn">03</div>
            <div className="st">Ship</div>
            <div className="scode">
              <span className="pmt">$</span> harnext{"\n"}
              <span className="pmt">❯</span> fix the flaky auth test{"\n"}
              <span className="ok">✓ change ready for review</span>
            </div>
            <div className="scap">Use it interactively, or let it run a queued task unattended.</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===================== OPEN SOURCE (the one GitHub moment) ===================== */

export function OpenSource() {
  return (
    <section className="section" id="opensource">
      <div className="container">
        <Reveal className="sec-head">
          <p className="eyebrow"><span className="sq" /> Open source</p>
          <h2>Built in the open.<br />MIT licensed, end to end.</h2>
          <p className="lede">
            harnext and Context Engine are free and open source. Read the code,
            open an issue, or ship a change — the whole harness was built to be
            forked.
          </p>
        </Reveal>

        <Reveal className="repos d1">
          <RepoCard
            href={GITHUB_URL}
            name="harnext"
            description="The coding agent harness — tools, providers, sandbox, and a runner that ships work unattended."
          />
          <RepoCard
            href={CONTEXT_ENGINE_URL}
            name="context-engine"
            description="Token-efficient context for any harness — continuous indexing, ranking, and caching over a small HTTP + MCP surface."
          />
        </Reveal>

        <Reveal className="os-cta d2">
          <a className="btn btn-amber" href="#">Book a call</a>
          <span className="os-note">Prefer a walkthrough? We&apos;ll show you harnext + Context Engine on your stack.</span>
        </Reveal>
      </div>
    </section>
  );
}

function RepoCard({ href, name, description }: { href: string; name: string; description: string }) {
  return (
    <a className="repo" href={href} target="_blank" rel="noreferrer">
      <div className="repo-hd">
        <span className="repo-ico"><GithubIcon width={20} height={20} /></span>
        <span className="repo-nm">{GITHUB_ORG} <span className="slash">/</span> <b>{name}</b></span>
        <span className="repo-star"><StarIcon /> Star</span>
      </div>
      <p className="repo-desc">{description}</p>
      <div className="repo-meta">
        <span className="lang"><i style={{ background: "#3178c6" }} /> TypeScript</span>
        <span>MIT</span>
      </div>
    </a>
  );
}

/* ========================= FOOTER ========================= */

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <Link className="brand" href="/">
          <svg className="mark" width={19} height={20} viewBox="0 0 60 64" aria-hidden="true"><use href="#logoMark" /></svg>
          <span>harnext</span>
        </Link>
        <Link className="fl" href="/harnext">harnext</Link>
        <Link className="fl" href="/context-engine">Context Engine</Link>
        <Link className="fl" href="/#start">Quick start</Link>
        <Link className="fl" href="/#opensource">Open source</Link>
        <Link className="fl" href="/docs">Docs</Link>
        <a
          className="fl"
          href="https://x.com/Yasha_br"
          target="_blank"
          rel="noreferrer"
          aria-label="X (Twitter)"
        >
          <XIcon width={14} height={14} />
        </a>
        <span className="footer-spacer" />
        <span className="lic">
          MIT licensed · made by{" "}
          <a href="https://www.flowhunt.io" target="_blank" rel="noreferrer">FlowHunt</a>
        </span>
      </div>
    </footer>
  );
}
