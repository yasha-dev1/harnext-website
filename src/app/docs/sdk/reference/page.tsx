import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeTabs } from "@/components/docs/code";
import {
  Callout,
  H2,
  H3,
  Properties,
  Property,
} from "@/components/docs/mdx";

export const metadata: Metadata = { title: "API reference" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="API reference"
      description="Result shapes, exported symbols, error types, retries, and exit codes."
    >
      <H2>Exports</H2>
      <p>The public surface of each package:</p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import (
    Harnext,          # the agent client
    Session,          # persisted runs
    Harness,          # pipeline generator
    Runner,           # self-hosted runner
    tool,             # define a custom tool
    skill,            # define a custom skill
    ToolResult,       # rich tool return value
    CancelToken,      # cooperative cancellation
    providers,        # provider/model registry
    __version__,
)
from harnext.errors import HarnextError, RateLimitError  # ...`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import {
  Harnext,          // the agent client
  Session,          // persisted runs
  Harness,          // pipeline generator
  Runner,           // self-hosted runner
  tool,             // define a custom tool
  skill,            // define a custom skill
  providers,        // provider/model registry
  version,
  HarnextError,     // base error
  RateLimitError,   // ...
} from "@harnext/sdk";`,
          },
        ]}
      />

      <H2>RunResult</H2>
      <Properties>
        <Property name="text" type="str">
          The agent&apos;s final assistant message.
        </Property>
        <Property name="output" type="T | None">
          Validated structured output when an <code>output_schema</code> was
          supplied; otherwise <code>None</code>.
        </Property>
        <Property name="steps" type="list[ToolStep]">
          Ordered tool calls with their arguments, status, and output.
        </Property>
        <Property name="files_changed" type="list[str]">
          Paths created, edited, or deleted during the run, relative to{" "}
          <code>cwd</code>.
        </Property>
        <Property name="usage" type="Usage">
          <code>input_tokens</code>, <code>output_tokens</code>,{" "}
          <code>total_tokens</code>.
        </Property>
        <Property name="session_id" type="str">
          The id of the session this run was recorded in.
        </Property>
        <Property name="success" type="bool">
          <code>True</code> if the agent finished the task without an error.
        </Property>
        <Property name="cancelled" type="bool">
          <code>True</code> if the run was stopped via a cancel token or signal.
        </Property>
      </Properties>

      <H3>ToolStep</H3>
      <Properties>
        <Property name="tool" type="str">
          The tool name, e.g. <code>edit</code> or <code>mcp:github.create_issue</code>.
        </Property>
        <Property name="args" type="dict">
          The arguments the model passed to the tool.
        </Property>
        <Property name="status" type='"ok" | "error" | "denied"'>
          Outcome of the call.
        </Property>
        <Property name="output" type="str">
          What the tool returned to the model (truncated in transcripts).
        </Property>
      </Properties>

      <H2>Errors</H2>
      <p>
        All SDK errors subclass <code>HarnextError</code>. Catch the base type to
        handle anything, or specific types for targeted recovery.
      </p>
      <table>
        <thead>
          <tr>
            <th>Error</th>
            <th>Raised when</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>AuthenticationError</code></td><td>A provider key is missing or rejected.</td></tr>
          <tr><td><code>ProviderError</code></td><td>The provider returned an unexpected error.</td></tr>
          <tr><td><code>RateLimitError</code></td><td>Rate limited after exhausting retries.</td></tr>
          <tr><td><code>ToolError</code></td><td>A tool raised or returned <code>is_error</code>.</td></tr>
          <tr><td><code>PermissionDenied</code></td><td>A tool call was denied by policy or callback.</td></tr>
          <tr><td><code>MaxTurnsExceeded</code></td><td>The loop hit <code>max_turns</code> before finishing.</td></tr>
          <tr><td><code>SessionNotFound</code></td><td>A session id could not be loaded.</td></tr>
          <tr><td><code>MCPConnectionError</code></td><td>An MCP server failed to start or connect.</td></tr>
        </tbody>
      </table>

      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext.errors import RateLimitError, MaxTurnsExceeded

try:
    result = agent.run("Big refactor")
except RateLimitError as e:
    print("retry after", e.retry_after)
except MaxTurnsExceeded as e:
    print("stopped after", e.turns, "turns")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { RateLimitError, MaxTurnsExceeded } from "@harnext/sdk";

try {
  const result = await agent.run("Big refactor");
} catch (e) {
  if (e instanceof RateLimitError) console.log("retry after", e.retryAfter);
  else if (e instanceof MaxTurnsExceeded) console.log("stopped after", e.turns);
  else throw e;
}`,
          },
        ]}
      />

      <H3>Retries</H3>
      <p>
        Transient failures (HTTP 429 and 5xx) are retried automatically with
        exponential backoff, up to <code>max_retries</code> (default 3). Tune it
        per client, or set <code>max_retries=0</code> to surface errors
        immediately.
      </p>

      <H2>Exit codes</H2>
      <p>
        When the SDK is driven from the CLI (<code>harnext -p</code>), runs map to
        these process exit codes — useful in CI:
      </p>
      <table>
        <thead>
          <tr><th>Code</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Success.</td></tr>
          <tr><td><code>1</code></td><td>The task failed or the agent reported an error.</td></tr>
          <tr><td><code>2</code></td><td>Invalid usage or configuration.</td></tr>
          <tr><td><code>7</code></td><td>A tool call was denied by permission policy.</td></tr>
          <tr><td><code>8</code></td><td><code>max_turns</code> reached without completion.</td></tr>
          <tr><td><code>130</code></td><td>Cancelled (SIGINT).</td></tr>
        </tbody>
      </table>

      <Callout type="tip" title="That's the whole surface">
        You&apos;ve now seen everything the SDK exposes. Head back to the{" "}
        <a href="/docs/sdk/overview">overview</a> or start building from the{" "}
        <a href="/docs/quickstart">quickstart</a>.
      </Callout>
    </DocPage>
  );
}
