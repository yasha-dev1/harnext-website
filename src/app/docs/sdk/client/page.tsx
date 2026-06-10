import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock, CodeTabs } from "@/components/docs/code";
import {
  Callout,
  H2,
  H3,
  Properties,
  Property,
} from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Client & configuration" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Client & configuration"
      description="Construct a Harnext client, configure its behavior, and override settings per call."
    >
      <H2>Constructing a client</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import Harnext

agent = Harnext(
    provider="anthropic",
    model="claude-opus-4-8",
    api_key=None,                 # falls back to ANTHROPIC_API_KEY
    cwd="./my-repo",
    tools=["read", "write", "edit", "bash", "skill", "mcp"],
    permission_mode="auto",
    max_turns=40,
    max_retries=3,
    timeout=600,
    system_prompt=None,
    metadata={"team": "payments"},
)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { Harnext } from "@harnext/sdk";

const agent = new Harnext({
  provider: "anthropic",
  model: "claude-opus-4-8",
  apiKey: undefined,             // falls back to ANTHROPIC_API_KEY
  cwd: "./my-repo",
  tools: ["read", "write", "edit", "bash", "skill", "mcp"],
  permissionMode: "auto",
  maxTurns: 40,
  maxRetries: 3,
  timeout: 600_000,              // milliseconds in TS
  systemPrompt: undefined,
  metadata: { team: "payments" },
});`,
          },
        ]}
      />

      <H2>Options</H2>
      <p>
        Names are shown in Python <code>snake_case</code>; the TypeScript
        equivalent is the <code>camelCase</code> form.
      </p>
      <Properties>
        <Property name="provider" type="str" required>
          The model provider id — <code>anthropic</code>, <code>openai</code>,{" "}
          <code>google</code>, <code>ollama</code>, and 20+ more. See{" "}
          <a href="/docs/sdk/providers">Providers &amp; models</a>.
        </Property>
        <Property name="model" type="str" defaultValue="provider default">
          The model id to use, e.g. <code>claude-opus-4-8</code>. Defaults to the
          provider&apos;s recommended model.
        </Property>
        <Property name="api_key" type="str | None" defaultValue="env">
          Provider key. When omitted, read from the provider&apos;s standard env
          var (e.g. <code>ANTHROPIC_API_KEY</code>).
        </Property>
        <Property name="cwd" type="str | Path" defaultValue='"."'>
          Working directory for file and shell tools. The agent cannot read or
          write outside this root unless a tool explicitly allows it.
        </Property>
        <Property name="tools" type="list[str | Tool]" defaultValue="all built-ins">
          Which tools to enable. Pass built-in names, custom{" "}
          <a href="/docs/sdk/tools">tools</a>, or both.
        </Property>
        <Property name="permission_mode" type="str" defaultValue='"auto"'>
          How tool calls are approved: <code>auto</code>, <code>manual</code>,{" "}
          <code>plan</code>, or <code>yolo</code>. See below.
        </Property>
        <Property name="max_turns" type="int" defaultValue="40">
          Maximum agent loop iterations before stopping with{" "}
          <code>MaxTurnsExceeded</code>.
        </Property>
        <Property name="max_retries" type="int" defaultValue="3">
          Retries for transient provider errors (rate limits, 5xx) with
          exponential backoff.
        </Property>
        <Property name="timeout" type="int" defaultValue="600">
          Per-request timeout. Seconds in Python, milliseconds in TypeScript.
        </Property>
        <Property name="system_prompt" type="str | None" defaultValue="built-in">
          Override or extend the agent&apos;s system prompt. Pass a string to
          replace it, or use <code>append_system_prompt</code> to add to it.
        </Property>
        <Property name="session" type="str | Session | None" defaultValue="new">
          Resume an existing session by id, or pass a <code>Session</code>{" "}
          object. Omit to start fresh. See{" "}
          <a href="/docs/sdk/sessions">Sessions</a>.
        </Property>
        <Property name="skills" type="list[str]" defaultValue="[]">
          Skills to load — see <a href="/docs/sdk/skills">Skills</a>.
        </Property>
        <Property name="mcp_servers" type="dict" defaultValue="{}">
          MCP servers to connect — see <a href="/docs/sdk/mcp">MCP servers</a>.
        </Property>
        <Property name="on_permission" type="callable | None" defaultValue="None">
          Callback to allow/deny tool calls in <code>manual</code> mode.
        </Property>
        <Property name="metadata" type="dict" defaultValue="{}">
          Arbitrary key/values attached to the session for your own bookkeeping.
        </Property>
      </Properties>

      <H2>Permission modes</H2>
      <p>
        Permission mode controls how the agent is allowed to run tools that touch
        your machine.
      </p>
      <ul>
        <li>
          <code>auto</code> — read-only tools run freely; writes and shell
          commands run unless your <code>on_permission</code> callback denies
          them. The default.
        </li>
        <li>
          <code>manual</code> — every side-effecting tool call is routed to{" "}
          <code>on_permission</code> for an explicit allow/deny.
        </li>
        <li>
          <code>plan</code> — the agent may read and reason but cannot write,
          edit, or run shell. Useful for dry runs and review.
        </li>
        <li>
          <code>yolo</code> — approve everything without prompting. Only for
          sandboxed or CI environments you fully trust.
        </li>
      </ul>

      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `def gate(req):
    if req.tool == "bash" and "rm -rf" in req.command:
        return "deny"
    return "allow"

agent = Harnext(
    provider="anthropic",
    permission_mode="manual",
    on_permission=gate,
)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const agent = new Harnext({
  provider: "anthropic",
  permissionMode: "manual",
  onPermission: (req) =>
    req.tool === "bash" && req.command.includes("rm -rf") ? "deny" : "allow",
});`,
          },
        ]}
      />

      <H3>Per-call overrides</H3>
      <p>
        Most options can be overridden for a single call, or use{" "}
        <code>with()</code> / <code>with_options()</code> to derive a new client
        without mutating the original.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `# Override just for this run
agent.run("Summarize the repo", provider="ollama", model="llama3.2")

# Derive a reusable variant
planner = agent.with_options(permission_mode="plan")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `// Override just for this run
await agent.run("Summarize the repo", { provider: "ollama", model: "llama3.2" });

// Derive a reusable variant
const planner = agent.with({ permissionMode: "plan" });`,
          },
        ]}
      />

      <H2>Configuration file</H2>
      <p>
        Both SDKs and the CLI read an optional{" "}
        <code>harnext.config.json</code> (or <code>harnext.toml</code>) from the
        working directory. Explicit constructor options always win over the file,
        which wins over environment variables.
      </p>
      <CodeBlock
        lang="json"
        filename="harnext.config.json"
        code={`{
  "provider": "anthropic",
  "model": "claude-opus-4-8",
  "permissionMode": "auto",
  "tools": ["read", "write", "edit", "bash", "skill", "mcp"],
  "mcpServers": {
    "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"] }
  }
}`}
      />

      <Callout type="note" title="Resolution order">
        constructor options → <code>harnext.config.json</code> →
        environment variables (<code>HARNEXT_*</code> and provider keys) →
        built-in defaults.
      </Callout>
    </DocPage>
  );
}
