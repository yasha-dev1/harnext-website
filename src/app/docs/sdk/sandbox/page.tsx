import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";
import { SandboxFlow } from "@/components/blog/sandbox-flow";

export const metadata: Metadata = { title: "Custom sandbox (Docker)" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Running agents in a custom sandbox (Docker)"
      description="Route an agent's shell commands into a per-worktree container with the pluggable command executor, while file operations stay on the host."
    >
      <p>
        harnext runs shell commands through a <code>bash</code> tool and a
        background-shell manager. The <code>CommandExecutor</code> seam lets you
        decide <em>where and how</em> those commands run — for example, inside a
        Docker container — without touching the file tools or re-implementing any of
        the existing truncation, timeout, streaming, or abort behavior.
      </p>

      <H2>Concept: execution-surface-only sandboxing</H2>
      <p>
        The goal is to isolate only the part that needs it. File tools
        (<code>read</code>, <code>edit</code>, <code>write</code>) keep operating on
        the host worktree, so host-side <code>git</code> diff and merge logic is
        untouched. Only command execution is routed into a container via{" "}
        <code>docker exec</code>. A bind mount ties the worktree to the
        container&apos;s working directory, so a host-side edit is visible in the
        container instantly.
      </p>

      <SandboxFlow />

      <p>The split is two options on <code>createAgentSession</code>:</p>
      <ul>
        <li>
          <code>cwd</code> — where the <strong>file tools</strong> operate (the host
          worktree).
        </li>
        <li>
          <code>execCwd</code> — where <strong>commands</strong> run, when it differs
          from <code>cwd</code> (the container&apos;s bind-mount target, e.g.{" "}
          <code>/work</code>).
        </li>
      </ul>

      <H2>The CommandExecutor interface</H2>
      <p>
        An executor owns process creation. <code>spawn</code> returns a{" "}
        <code>ChildProcessLike</code> — anything that quacks like a Node child
        process — and the optional <code>dispose</code> is awaited when the session is
        disposed.
      </p>
      <CodeBlock
        lang="ts"
        code={`interface ChildProcessLike {
  stdout: Readable | null;
  stderr: Readable | null;
  pid?: number;
  kill(signal?: NodeJS.Signals): boolean;
  on(event: 'close', cb: (code: number | null) => void): unknown;
  on(event: 'error', cb: (err: Error) => void): unknown;
}

interface ExecutorSpawnOptions {
  cwd: string;             // command working dir (container-side path for a sandbox)
  env?: NodeJS.ProcessEnv; // optional — the executor OWNS env; host process.env never leaks
  signal?: AbortSignal;    // the executor kills its process on abort
}

interface CommandExecutor {
  spawn(command: string, opts: ExecutorSpawnOptions): ChildProcessLike;
  dispose?(): void | Promise<void>;  // awaited on session.dispose()
}`}
      />
      <ul>
        <li>
          <strong><code>env</code> is yours to construct.</strong> harnext does not
          pass the host <code>process.env</code> through — your executor decides
          exactly what the sandbox sees.
        </li>
        <li>
          <strong><code>signal</code> is a kill contract.</strong> When it aborts, the
          executor must terminate the process it started.
        </li>
        <li>
          <strong><code>dispose</code> runs on teardown.</strong>{" "}
          <code>session.dispose()</code> awaits <code>executor.dispose?.()</code>, so a
          container can be removed there.
        </li>
      </ul>

      <H2>A worked example: DockerExecutor</H2>
      <p>
        This reference is distilled from the end-to-end verification that passed 22/22
        checks against a real <code>node:22-bookworm-slim</code> container. It runs
        commands with <code>docker exec</code>, constructs a clean env, and wires the
        abort signal to a <code>SIGTERM</code>.
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

      <H2>Wiring it up</H2>
      <p>
        Start a per-worktree container that bind-mounts the worktree, then point{" "}
        <code>execCwd</code> at the mount and pass the executor.
      </p>
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
      <Callout type="warning" title="Use closedToolSet for sandboxes">
        Without it, MCP servers and the skill tool inject and spawn on the{" "}
        <strong>host</strong>, outside your sandbox. <code>closedToolSet: true</code>{" "}
        yields exactly the resolved tools — auditable, and contained.
      </Callout>

      <H2>Session options</H2>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>executor</code></td>
            <td>Where shell commands run (foreground + background). Default = host <code>child_process</code>.</td>
          </tr>
          <tr>
            <td><code>execCwd</code></td>
            <td>Command working dir when it differs from <code>cwd</code> (the file-tool dir) — e.g. a container bind-mount target like <code>/work</code>.</td>
          </tr>
          <tr>
            <td><code>toolOverrides</code></td>
            <td>Swap individual tools by name <strong>without</strong> losing the background-shell trio.</td>
          </tr>
          <tr>
            <td><code>buildTools</code></td>
            <td>Transform the default tool list.</td>
          </tr>
          <tr>
            <td><code>closedToolSet</code></td>
            <td>Yield exactly the resolved tools — no MCP / skill injection (auditable, sandbox-safe).</td>
          </tr>
          <tr>
            <td><code>disableSkillTool</code></td>
            <td>Skip the <code>skill</code> tool only.</td>
          </tr>
        </tbody>
      </table>

      <H2>Lifecycle</H2>
      <p>
        Create the container before the session (or lazily on first{" "}
        <code>spawn</code>), bind-mount the worktree, and let{" "}
        <code>session.dispose()</code> clean up: it tears down any background shells and
        then awaits <code>executor.dispose()</code>, which removes the container.
        Because the bind mount makes host edits instantly visible inside the container,
        there&apos;s nothing to copy or sync between the two surfaces.
      </p>

      <H2>Composition</H2>
      <p>
        The executor changes <em>where</em> commands run; the tool-shaping options
        change <em>which</em> tools exist. They compose.
      </p>
      <H3>Swap a single tool</H3>
      <p>
        <code>toolOverrides</code> replaces tools by name while keeping everything else
        — crucially, the background-shell trio survives.
      </p>
      <CodeBlock
        lang="ts"
        code={`const { session } = await createAgentSession({
  executor: new DockerExecutor(containerId),
  execCwd: '/work',
  toolOverrides: {
    // replace just the 'web_fetch' tool; bash + background shells untouched
    web_fetch: myProxiedWebFetchTool,
  },
});`}
      />
      <H3>Transform the whole list</H3>
      <CodeBlock
        lang="ts"
        code={`const { session } = await createAgentSession({
  executor: new DockerExecutor(containerId),
  execCwd: '/work',
  buildTools: (tools) => tools.filter((t) => t.name !== 'web_search'),
});`}
      />

      <H2>Gotchas</H2>
      <ul>
        <li>
          <strong>Env isolation.</strong> The executor owns env — if a command needs a
          variable, put it in <code>containerEnv</code> (or merge from{" "}
          <code>opts.env</code>). The host <code>process.env</code> is never forwarded.
        </li>
        <li>
          <strong>Abort kills the container process, not the container.</strong> Wire{" "}
          <code>opts.signal</code> to a <code>kill</code> so an aborted command stops;
          the container itself lives until <code>dispose</code>.
        </li>
        <li>
          <strong>Working-dir mapping.</strong> <code>opts.cwd</code> passed to{" "}
          <code>spawn</code> is the <em>command-side</em> path (e.g. <code>/work</code>),
          resolved from <code>execCwd</code> — not the host worktree path.
        </li>
        <li>
          <strong>Keep MCP off the host.</strong> Use <code>closedToolSet</code> so MCP
          servers don&apos;t spawn outside the sandbox.
        </li>
      </ul>

      <Callout type="note" title="Source">
        The pluggable command executor was designed in{" "}
        <a href="https://github.com/QualityUnit/harnext/issues/43">QualityUnit/harnext#43</a>{" "}
        and implemented in{" "}
        <a href="https://github.com/QualityUnit/harnext/pull/47">#47</a> (building on the
        background-shell work in #42 / #45). See the{" "}
        <a href="/blog/sandbox-agent-shell">announcement post</a> for the why.
      </Callout>
    </DocPage>
  );
}
