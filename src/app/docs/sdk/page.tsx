import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeTabs } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Harnext SDK" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Harnext SDK"
      description="Drive the harnext coding agent from your own code. The same agent that powers the CLI — read, write, edit, run shell, drive MCP, and ship issues to PRs — available as first-class Python and TypeScript libraries."
    >
      <p>
        <strong>harnext</strong> is a minimal, provider-agnostic coding agent.
        The CLI gives you an interactive REPL and a GitHub Actions harness; the{" "}
        <strong>SDK</strong> gives you the same executor as a library, so you can
        embed the agent in scripts, services, notebooks, test suites, and your
        own automation. One agent, six tools, 20+ providers — now callable from
        Python and TypeScript with matching APIs.
      </p>

      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import Harnext

agent = Harnext(provider="anthropic", model="claude-opus-4-8")

result = agent.run("Add input validation to the signup endpoint")
print(result.text)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { Harnext } from "@harnext/sdk";

const agent = new Harnext({ provider: "anthropic", model: "claude-opus-4-8" });

const result = await agent.run("Add input validation to the signup endpoint");
console.log(result.text);`,
          },
        ]}
      />

      <Callout type="note" title="Same surface, two languages">
        Every concept in this reference is documented for both SDKs side by side.
        Python uses <code>snake_case</code>; TypeScript uses{" "}
        <code>camelCase</code>. Where they differ beyond casing, it&apos;s called
        out explicitly.
      </Callout>

      <H2>What you can build</H2>
      <p>
        The SDK exposes every capability of the agent as a typed API. Pick a
        section to dive in:
      </p>

      <CardGroup cols={2}>
        <Card title="Run & stream" href="/docs/sdk/running-agents" icon={<RunIcon />}>
          One-shot <code>run()</code> for results, or <code>stream()</code> for
          token-by-token events and live tool calls.
        </Card>
        <Card title="Tools" href="/docs/sdk/tools" icon={<ToolIcon />}>
          The six built-in tools — read, write, edit, bash, skill, mcp — plus
          your own typed custom tools.
        </Card>
        <Card title="Providers & models" href="/docs/sdk/providers" icon={<PlugIcon />}>
          Anthropic, OpenAI, Google, Ollama and 20+ more. Switch per call with a
          single argument.
        </Card>
        <Card title="Sessions & replays" href="/docs/sdk/sessions" icon={<HistoryIcon />}>
          Persistent, inspectable sessions in <code>~/.harnext</code>. Resume,
          replay, and export any run.
        </Card>
        <Card title="Skills & MCP" href="/docs/sdk/skills" icon={<SparkIcon />}>
          Bundle reusable skills and connect any MCP server in proxy or direct
          mode.
        </Card>
        <Card title="Harness & runner" href="/docs/sdk/harness" icon={<PipeIcon />}>
          Generate the GitHub Actions pipeline and manage a self-hosted runner —
          all from code.
        </Card>
      </CardGroup>

      <H2>How it fits together</H2>
      <p>
        A <code>Harnext</code> client wraps a provider, a working directory, and
        a set of tools. Calling <code>run()</code> or <code>stream()</code>{" "}
        starts an agent loop: the model thinks, calls tools, observes results,
        and repeats until the task is done or <code>max_turns</code> is reached.
        Every run is recorded as a session you can resume or replay. The same
        client can also <em>build a harness</em> — emitting the GitHub Actions
        workflows that let the agent pick up issues and open PRs unattended.
      </p>

      <Callout type="tip" title="New to harnext?">
        Start with <a href="/docs/installation">Installation</a>, then the{" "}
        <a href="/docs/quickstart">Quickstart</a>. If you already have the CLI,
        the SDK ships in the same distribution — jump straight to the{" "}
        <a href="/docs/sdk/overview">SDK overview</a>.
      </Callout>
    </DocPage>
  );
}

/* --- inline card icons --- */
function RunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3l14 9-14 9V3Z" />
    </svg>
  );
}
function ToolIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" />
    </svg>
  );
}
function PlugIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v4M15 2v4M7 6h10v6a5 5 0 0 1-10 0V6ZM12 17v5" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 8v4l3 2" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" />
    </svg>
  );
}
function PipeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 6h10M5 8v8M19 8v8M7 18h10" />
    </svg>
  );
}
