import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock, CodeTabs } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Context Engine" };

export default function Page() {
  return (
    <DocPage
      eyebrow="Get started"
      title="Context Engine"
      description="Every event across your org — Stripe, Slack, GitHub, Jira, LiveAgent, your site — streams into the Context Engine. It ranks, prunes, dedupes, and caches so every agent call carries only what matters."
    >
      <p>
        The <strong>Context Engine</strong> is the brain of your agent. Sources
        stream events into a continuously updated index; when an agent asks a
        question, the engine scores the candidates, prunes the long tail, and
        serves a compact context pack — on average <strong>−89% tokens per
        query</strong> compared to passing the raw working set.
      </p>

      <Callout type="note" title="Works with any harness">
        The engine exposes a small HTTP + MCP surface. harnext uses it natively,
        and you can point Claude Code, Codex, or your own loop at the same
        index.
      </Callout>

      <H2>Create your grid</H2>
      <p>
        Sign up at{" "}
        <a href="https://meaninggrid.harnext.dev" target="_blank" rel="noreferrer">
          meaninggrid.harnext.dev
        </a>{" "}
        to create a grid, then connect sources from the dashboard — Slack
        channels, git repositories, Stripe events, Jira projects, LiveAgent
        queues, website pages. Each source syncs continuously; there is no
        manual re-indexing.
      </p>

      <H2>Connect harnext</H2>
      <p>
        Inside a repo, <code>harnext setup</code> links the harness to your
        grid. From then on every run builds its context through the engine
        automatically.
      </p>
      <CodeBlock
        lang="bash"
        code={`cd my-repo
harnext setup
# ✓ context engine connected · harness ready`}
      />

      <H2>Connect any other agent</H2>
      <p>
        Add the engine as an MCP server and any MCP-capable agent can query the
        same grid:
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "json",
            label: "MCP (Claude Code, Codex, …)",
            filename: ".mcp.json",
            code: `{
  "mcpServers": {
    "context-engine": {
      "url": "https://meaninggrid.harnext.dev/mcp",
      "headers": { "Authorization": "Bearer $MEANINGGRID_API_KEY" }
    }
  }
}`,
          },
          {
            lang: "bash",
            label: "HTTP",
            code: `curl -s https://meaninggrid.harnext.dev/v1/context \\
  -H "Authorization: Bearer $MEANINGGRID_API_KEY" \\
  -d '{ "query": "why did checkout error rates spike this week?" }'`,
          },
        ]}
      />

      <H2>What the engine does</H2>
      <ul>
        <li>
          <strong>Continuous index</strong> — sources stream events into the
          grid, so whatever your agent queries is always current.
        </li>
        <li>
          <strong>Relevance ranking</strong> — scores and orders candidates per
          query, then prunes the long tail before it ever reaches the model.
        </li>
        <li>
          <strong>Dedup &amp; cache</strong> — collapses repeats and caches hot
          context, so repeat calls don&apos;t re-pay for the same tokens.
        </li>
        <li>
          <strong>Drop-in for any harness</strong> — one small HTTP + MCP
          surface for harnext, Claude Code, Codex, or your own loop.
        </li>
      </ul>

      <Callout type="tip" title="Get started">
        Create your grid at{" "}
        <a href="https://meaninggrid.harnext.dev" target="_blank" rel="noreferrer">
          meaninggrid.harnext.dev
        </a>
        , connect a source or two, then run <code>harnext setup</code> in your
        repo and watch the token meter drop.
      </Callout>

      <H2>Where to go next</H2>
      <CardGroup cols={2}>
        <Card title="Quickstart" href="/docs/quickstart">
          Run your first task end to end in under five minutes.
        </Card>
        <Card title="MCP servers" href="/docs/sdk/mcp">
          How harnext connects to MCP servers — including the Context Engine.
        </Card>
      </CardGroup>
    </DocPage>
  );
}
