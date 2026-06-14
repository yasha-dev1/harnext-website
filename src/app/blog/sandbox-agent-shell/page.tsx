import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/nav";
import { LogoSymbol } from "@/components/landing/icons";
import { Footer } from "@/components/landing/sections";
import { CodeBlock } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";
import { SandboxFlow } from "@/components/blog/sandbox-flow";
import { getPost } from "@/lib/blog";

const post = getPost("sandbox-agent-shell")!;

export const metadata: Metadata = {
  title: `${post.title} · harnext`,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    type: "article",
  },
};

export default function Page() {
  return (
    <>
      <LogoSymbol />
      <Nav />
      <span id="top" />
      <main className="flex-1">
        <article className="post">
          <div className="container post-narrow">
            <header className="post-head">
              <p className="eyebrow"><span className="sq" /> {post.tag}</p>
              <h1>Sandbox your AI agent&apos;s shell, keep its files on the host</h1>
              <p className="post-lede">
                Running many agent worktrees at once means commands collide — same
                ports, same global installs, same dev servers. harnext&apos;s new
                pluggable command executor isolates each agent&apos;s shell in its own
                container, while file edits stay on the host where your{" "}
                <code>git</code> already lives.
              </p>
              <div className="post-meta">
                <span className="pm-author">{post.author}</span>
                <span>·</span>
                <span>{post.dateLabel}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </header>

            <div className="doc-prose post-body">
              <H2>The collision problem</H2>
              <p>
                Fan an agent out across several worktrees and they start stepping on
                each other. Two runs both want port 3000. One{" "}
                <code>pip install</code> mutates a shared environment another run
                depends on. A runaway dev server outlives the task that spawned it.
                You want each agent&apos;s commands boxed into an isolated container —
                but you still want host-side <code>git</code> to be instant, because
                diffing and merging worktrees on the host is the whole point of running
                them in parallel.
              </p>
              <p>
                Those two wants seem to pull against each other. They don&apos;t.
              </p>

              <H2>Execution-surface-only sandboxing</H2>
              <p>
                The trick is to sandbox <em>only</em> the part that actually needs
                isolation — command execution — and leave everything else on the host.
                harnext agents run shell commands through a <code>bash</code> tool and a
                background-shell manager. The new release routes both through a single
                injectable seam, the <strong><code>CommandExecutor</code></strong>. File
                tools (<code>read</code>, <code>edit</code>, <code>write</code>) keep
                operating on the host worktree; only command execution is sent into a
                container via <code>docker exec</code>. A bind mount ties the two
                together, so a host-side edit is visible in the container the instant
                it&apos;s written.
              </p>

              <SandboxFlow />
              <p className="not-prose mt-2 text-[0.82rem] text-[var(--fg-4)]">
                File tools stay on the host; only command execution crosses into the
                container. The bind mount keeps both sides in sync.
              </p>

              <p>
                The split shows up in two <code>createAgentSession</code> options:{" "}
                <code>cwd</code> is where the file tools operate (the host worktree),
                and <code>execCwd</code> is where commands run (the container&apos;s
                bind-mount target, e.g. <code>/work</code>).
              </p>

              <H2>Why a seam beats replacing the tools</H2>
              <p>
                Before this, the only way to change where commands ran was to replace
                the entire tool set — which silently disabled background shells and
                forced you to re-implement truncation, timeouts, output streaming, and
                abort handling by hand. The <code>CommandExecutor</code> owns only{" "}
                <em>where and how</em> a command runs, so foreground <code>bash</code>{" "}
                and background shells both flow through one tiny implementation and
                inherit every existing behavior for free. The default executor
                reproduces the old host behavior exactly. Three long-standing footguns
                go away with it:
              </p>
              <ul>
                <li>Custom <code>tools</code> no longer silently disables background shells.</li>
                <li><code>run_in_background</code> never silently degrades to a blocking foreground run.</li>
                <li>The executor owns env construction, so the host&apos;s <code>process.env</code> can&apos;t leak into the sandbox.</li>
              </ul>

              <H2>The whole executor</H2>
              <p>
                A sandbox is one class. <code>spawn</code> returns anything that looks
                like a child process; <code>dispose</code> tears the container down when
                the session ends. This <code>DockerExecutor</code> is distilled from the
                end-to-end verification that passed 22/22 checks against a real{" "}
                <code>node:22-bookworm-slim</code> container:
              </p>
              <CodeBlock
                lang="ts"
                code={`import { spawn } from 'node:child_process';
import type {
  CommandExecutor,
  ChildProcessLike,
  ExecutorSpawnOptions,
} from '@harnext/core';

export class DockerExecutor implements CommandExecutor {
  constructor(
    private readonly containerId: string,
    /** Clean env for the container — the host's process.env never leaks. */
    private readonly containerEnv: NodeJS.ProcessEnv = {},
  ) {}

  spawn(command: string, opts: ExecutorSpawnOptions): ChildProcessLike {
    const env = { ...this.containerEnv, ...(opts.env ?? {}) };
    const envFlags = Object.entries(env).flatMap(([k, v]) => ['-e', \`\${k}=\${v}\`]);
    const child = spawn(
      'docker',
      ['exec', '-w', opts.cwd, ...envFlags, this.containerId, 'sh', '-c', command],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    if (opts.signal) {
      const onAbort = () => child.kill('SIGTERM');
      if (opts.signal.aborted) onAbort();
      else {
        opts.signal.addEventListener('abort', onAbort, { once: true });
        child.on('close', () => opts.signal!.removeEventListener('abort', onAbort));
      }
    }
    return child;
  }

  async dispose(): Promise<void> {
    await new Promise<void>((resolve) => {
      const p = spawn('docker', ['rm', '-f', this.containerId], { stdio: 'ignore' });
      p.on('close', () => resolve());
      p.on('error', () => resolve());
    });
  }
}`}
              />

              <p>Wiring it up is the <code>cwd</code> / <code>execCwd</code> split plus a closed tool set:</p>
              <CodeBlock
                lang="ts"
                code={`// 1. Bind-mount the worktree into a per-worktree container:
//    docker run -d --rm -v <hostWorktree>:/work <image> sleep infinity
// 2. Route command execution into it; keep read/edit/write on the host:
const { session } = await createAgentSession({
  provider,
  modelId,
  cwd: hostWorktree,   // read / edit / write operate here (host)
  execCwd: '/work',    // bash + background shells run here (container)
  executor: new DockerExecutor(containerId, {
    PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
  }),
  closedToolSet: true, // exact, auditable tool set — no host-spawned MCP
});

// ...run the agent...

await session.dispose(); // tears down background shells AND removes the container`}
              />
              <Callout type="note" title="Why closedToolSet">
                Without it, MCP servers and the skill tool would inject and spawn on the{" "}
                <em>host</em> — outside your sandbox. <code>closedToolSet</code> yields
                exactly the resolved tools, which is what you want when the whole point
                is to contain execution.
              </Callout>

              <H2>What you get</H2>
              <p>
                Multiple worktrees build and run the same project concurrently in
                isolated containers — no port conflicts, no shared-dependency drift —
                while host-side <code>git</code> diff and merge logic runs untouched
                against the worktree path. One seam, verified end-to-end, with all the
                bash semantics you already rely on still in place.
              </p>

              <H2>Go deeper</H2>
              <CardGroup cols={2}>
                <Card title="Custom sandbox (Docker)" href="/docs/sdk/sandbox">
                  The full guide: the <code>CommandExecutor</code> contract, the verified
                  <code> DockerExecutor</code>, wiring, lifecycle, composition, and
                  gotchas.
                </Card>
                <Card
                  title="Design & implementation"
                  href="https://github.com/QualityUnit/harnext/issues/43"
                >
                  Background in QualityUnit/harnext#43; the implementation landed in #47.
                </Card>
              </CardGroup>

              <hr />
              <p>
                <Link href="/blog">← All posts</Link>
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
