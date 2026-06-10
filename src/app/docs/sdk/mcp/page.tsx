import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "MCP servers" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="MCP servers"
      description="Connect Model Context Protocol servers to give the agent tools, resources, and prompts from anything that speaks MCP."
    >
      <p>
        The <code>mcp</code> tool bridges the agent to any{" "}
        <a href="https://modelcontextprotocol.io" rel="noreferrer" target="_blank">
          Model Context Protocol
        </a>{" "}
        server — GitHub, Linear, a database, your internal services. Declared
        servers are started, their tools are discovered, and the agent can call
        them like built-ins.
      </p>

      <H2>Declaring servers</H2>
      <p>
        Servers can be launched as a subprocess (<code>command</code>) or reached
        over HTTP/SSE (<code>url</code>). Each entry is keyed by a short name the
        agent uses as a namespace.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `agent = Harnext(
    provider="anthropic",
    mcp_servers={
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {"GITHUB_TOKEN": os.environ["GITHUB_TOKEN"]},
        },
        "linear": {
            "url": "https://mcp.linear.app/sse",
            "mode": "proxy",
        },
    },
)

agent.run("Open a GitHub issue for the bug described in LIN-482")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const agent = new Harnext({
  provider: "anthropic",
  mcpServers: {
    github: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN! },
    },
    linear: {
      url: "https://mcp.linear.app/sse",
      mode: "proxy",
    },
  },
});

await agent.run("Open a GitHub issue for the bug described in LIN-482");`,
          },
        ]}
      />

      <H3>Proxy vs. direct mode</H3>
      <ul>
        <li>
          <strong>
            <code>direct</code>
          </strong>{" "}
          (default) — the SDK connects to the server in-process and exposes its
          tools to the model.
        </li>
        <li>
          <strong>
            <code>proxy</code>
          </strong>{" "}
          — the SDK fronts the server behind its own permission and logging
          layer, so MCP tool calls are gated by the same{" "}
          <a href="/docs/sdk/client">permission mode</a> as built-in tools and
          recorded in the session.
        </li>
      </ul>

      <H2>Inspecting MCP tools</H2>
      <p>List what a connected server offers, or restrict which tools are exposed.</p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `# What did the servers expose?
agent.mcp.servers()              # ["github", "linear"]
agent.mcp.tools("github")        # ["create_issue", "list_prs", ...]

# Only allow specific tools from a server
agent = Harnext(
    provider="anthropic",
    mcp_servers={
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "allow": ["create_issue", "add_comment"],
        },
    },
)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `// What did the servers expose?
agent.mcp.servers();             // ["github", "linear"]
await agent.mcp.tools("github"); // ["create_issue", "list_prs", ...]

// Only allow specific tools from a server
const agent = new Harnext({
  provider: "anthropic",
  mcpServers: {
    github: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      allow: ["create_issue", "add_comment"],
    },
  },
});`,
          },
        ]}
      />

      <Callout type="warning" title="Treat MCP servers as untrusted input">
        An MCP server can return arbitrary content and tool definitions. Use{" "}
        <code>proxy</code> mode with an <code>allow</code> list for third-party
        servers, and keep credentials scoped to exactly what the server needs.
      </Callout>
    </DocPage>
  );
}
