import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Introduction" };

export default function Page() {
  return (
    <DocPage
      eyebrow="Get started"
      title="harnext CLI"
      description="A terminal-native coding agent that reads, writes, and edits files, runs shell, and drives MCP servers — on open-source, local, or any provider. Run it interactively, hand it a task, or let it ship unattended."
    >
      <p>
        <strong>harnext</strong> is the whole harness in one CLI: the
        interactive agent you use day to day, a one-shot mode for scripts and
        automation, and the setup command that wires your repo into a staged
        pipeline. Install it once and you have everything — no glue scripts, no
        agent server.
      </p>

      <CodeBlock lang="bash" code={`npm i -g harnext`} />

      <Callout type="note" title="Requirements">
        Node ≥ 20. Sessions, config, and replays all live under{" "}
        <code>~/.harnext</code>.
      </Callout>

      <H2>The interactive REPL</H2>
      <p>
        Run <code>harnext</code> inside a repo and describe what you want. The
        agent reads, greps, plans, edits, and runs your tests — every tool call
        is shown as it happens, and nothing is written without the permission
        mode you chose.
      </p>
      <CodeBlock
        lang="text"
        filename="~/projects/api — harnext"
        code={`❯ refactor packages/api/auth — split the session helper

read  packages/api/auth/session.ts · 218 lines
grep  "createSession" · 9 matches · 4 files
│ plan · 3 steps — extract tokens.ts, thin the helper, update imports
edit  packages/api/auth/tokens.ts   +47 −0
edit  packages/api/auth/session.ts  +8 −52
bash  npm test -- auth  ✓ 23 passing · 1.2s

↑ 3.1k ↓ 0.9k tokens · change ready for review`}
      />

      <H2>One-shot mode</H2>
      <p>
        Pass <code>-p</code> to run a single task and exit — ideal for scripts,
        CI, and automation. The run is recorded as a session like any other.
      </p>
      <CodeBlock
        lang="bash"
        code={`harnext -p "Add a /health route that returns 200 OK" --provider anthropic`}
      />

      <H2>Pick your provider — or bring your own</H2>
      <p>
        Anthropic, OpenAI, Google, Ollama, NVIDIA and 20+ more, switchable per
        run with <code>--provider</code> and <code>--model</code>. Point{" "}
        <code>--base-url</code> at a local or self-hosted endpoint to keep
        development entirely in-house.
      </p>
      <CodeBlock
        lang="bash"
        code={`# cloud provider
harnext --provider anthropic --model claude-opus-4-8

# local model — code never leaves the machine
harnext --provider ollama --model llama3.2

# any OpenAI-compatible endpoint
harnext --base-url http://localhost:8000/v1 --model my-finetune`}
      />

      <H2>Wire up your repo</H2>
      <p>
        <code>harnext setup</code> connects your sources to the{" "}
        <a href="/docs/context-engine">Context Engine</a> and wires the harness
        into your repo, so the agent runs as a staged pipeline you can hand off
        and walk away from.
      </p>
      <CodeBlock
        lang="bash"
        code={`cd my-repo
harnext setup
# ✓ context engine connected · harness ready`}
      />

      <H2>Where to go next</H2>
      <CardGroup cols={2}>
        <Card title="Installation" href="/docs/installation">
          Install options, requirements, and configuring your first provider
          key.
        </Card>
        <Card title="Quickstart" href="/docs/quickstart">
          Run your first task end to end in under five minutes.
        </Card>
        <Card title="Context Engine" href="/docs/context-engine">
          Turn every event in your org into token-efficient context for the
          agent.
        </Card>
        <Card title="SDK" href="/docs/sdk">
          Drive the same agent from Python or TypeScript.
        </Card>
      </CardGroup>
    </DocPage>
  );
}
