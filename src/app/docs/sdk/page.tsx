import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeTabs } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "SDK Overview" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Overview"
      description="The mental model behind the SDK, the objects you'll use, and how Python and TypeScript map to each other."
    >
      <H2>The core objects</H2>
      <p>The SDK is small on purpose. Almost everything starts from one client:</p>
      <ul>
        <li>
          <strong>
            <code>Harnext</code>
          </strong>{" "}
          — the agent client. Holds a provider, model, working directory, tools,
          and permission policy. Call <code>run()</code> or <code>stream()</code>.
        </li>
        <li>
          <strong>
            <code>RunResult</code>
          </strong>{" "}
          — the outcome of a run: final text, ordered tool steps, token usage,
          changed files, and the session id.
        </li>
        <li>
          <strong>
            <code>Session</code>
          </strong>{" "}
          — a persisted, replayable transcript of a run. List, load, resume,
          export.
        </li>
        <li>
          <strong>
            <code>tool()</code>
          </strong>{" "}
          — wrap any function as a typed tool the agent can call.
        </li>
        <li>
          <strong>
            <code>Harness</code>
          </strong>{" "}
          and{" "}
          <strong>
            <code>Runner</code>
          </strong>{" "}
          — generate the GitHub Actions pipeline and manage a self-hosted runner
          from code.
        </li>
      </ul>

      <H2>The agent loop</H2>
      <p>
        When you call <code>run()</code>, the client starts a loop: the model
        receives your prompt and the available tool schemas, decides whether to
        respond or call a tool, the SDK executes the tool against{" "}
        <code>cwd</code>, feeds the result back, and repeats. The loop ends when
        the model returns a final answer with no tool call, or when{" "}
        <code>max_turns</code> is reached. <code>stream()</code> surfaces every
        step of that loop as it happens.
      </p>

      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import Harnext

agent = Harnext(
    provider="anthropic",
    model="claude-opus-4-8",
    cwd=".",
    tools=["read", "write", "edit", "bash"],
    permission_mode="auto",
    max_turns=40,
)

result = agent.run("Fix the failing test in tests/test_users.py")
for step in result.steps:
    print(step.tool, step.status)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { Harnext } from "@harnext/sdk";

const agent = new Harnext({
  provider: "anthropic",
  model: "claude-opus-4-8",
  cwd: ".",
  tools: ["read", "write", "edit", "bash"],
  permissionMode: "auto",
  maxTurns: 40,
});

const result = await agent.run("Fix the failing test in tests/users.test.ts");
for (const step of result.steps) console.log(step.tool, step.status);`,
          },
        ]}
      />

      <H2>Python ↔ TypeScript</H2>
      <p>
        The two SDKs are intentionally symmetric. The only routine differences:
      </p>
      <ul>
        <li>
          Naming: Python is <code>snake_case</code>, TypeScript is{" "}
          <code>camelCase</code> (e.g. <code>max_turns</code> ↔{" "}
          <code>maxTurns</code>, <code>files_changed</code> ↔{" "}
          <code>filesChanged</code>).
        </li>
        <li>
          Async: every TypeScript method returns a <code>Promise</code>. Python
          methods are synchronous by default, with <code>a</code>-prefixed async
          variants (<code>arun</code>, <code>astream</code>) for{" "}
          <code>asyncio</code>.
        </li>
        <li>
          Streaming: Python yields from a generator; TypeScript exposes an{" "}
          <code>AsyncIterable</code> you consume with{" "}
          <code>for await … of</code>.
        </li>
      </ul>

      <Callout type="note" title="Async in Python">
        Use <code>await agent.arun(...)</code> and{" "}
        <code>async for event in agent.astream(...)</code> inside an{" "}
        <code>asyncio</code> event loop. The synchronous methods are thin
        wrappers around these.
      </Callout>

      <H2>Where to go next</H2>
      <CardGroup cols={2}>
        <Card title="Client & configuration" href="/docs/sdk/client">
          Every constructor option, environment variable, and config file key.
        </Card>
        <Card title="Running the agent" href="/docs/sdk/running-agents">
          run, stream, events, permissions, and cancellation.
        </Card>
        <Card title="Tools" href="/docs/sdk/tools">
          Built-in tools and authoring your own.
        </Card>
        <Card title="API reference" href="/docs/sdk/reference">
          Types, result shapes, errors, and exit codes.
        </Card>
      </CardGroup>
    </DocPage>
  );
}
