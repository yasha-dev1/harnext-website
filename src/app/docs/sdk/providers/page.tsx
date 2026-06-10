import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock, CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Providers & models" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Providers & models"
      description="One agent, 20+ model providers. Route to cloud or local models and switch with a single argument."
    >
      <p>
        Every model call is routed through <code>pi-ai</code>, so the same agent
        code runs on any supported provider. Choose a provider when you build the
        client, or override it per call.
      </p>

      <H2>Supported providers</H2>
      <table>
        <thead>
          <tr>
            <th>Provider id</th>
            <th>Hosting</th>
            <th>Auth (env var)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>anthropic</code></td><td>Cloud</td><td><code>ANTHROPIC_API_KEY</code></td></tr>
          <tr><td><code>openai</code></td><td>Cloud</td><td><code>OPENAI_API_KEY</code></td></tr>
          <tr><td><code>google</code></td><td>Cloud</td><td><code>GOOGLE_API_KEY</code></td></tr>
          <tr><td><code>mistral</code></td><td>Cloud</td><td><code>MISTRAL_API_KEY</code></td></tr>
          <tr><td><code>groq</code></td><td>Cloud</td><td><code>GROQ_API_KEY</code></td></tr>
          <tr><td><code>openrouter</code></td><td>Cloud</td><td><code>OPENROUTER_API_KEY</code></td></tr>
          <tr><td><code>ollama</code></td><td>Local</td><td>—</td></tr>
          <tr><td><code>nvidia</code></td><td>Local / Cloud</td><td><code>NVIDIA_API_KEY</code></td></tr>
          <tr><td><code>vllm</code></td><td>Local</td><td>—</td></tr>
          <tr><td><code>llamacpp</code></td><td>Local</td><td>—</td></tr>
        </tbody>
      </table>
      <p>
        …and any OpenAI-compatible endpoint via <code>base_url</code>. Run{" "}
        <code>providers.list()</code> for the full set in your installed version.
      </p>

      <H2>Choosing a model</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `# Cloud
agent = Harnext(provider="anthropic", model="claude-opus-4-8")

# Local — no key required
local = Harnext(provider="ollama", model="llama3.2")

# Any OpenAI-compatible endpoint
custom = Harnext(
    provider="openai",
    model="my-model",
    base_url="https://api.internal/v1",
    api_key="...",
)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `// Cloud
const agent = new Harnext({ provider: "anthropic", model: "claude-opus-4-8" });

// Local — no key required
const local = new Harnext({ provider: "ollama", model: "llama3.2" });

// Any OpenAI-compatible endpoint
const custom = new Harnext({
  provider: "openai",
  model: "my-model",
  baseUrl: "https://api.internal/v1",
  apiKey: "...",
});`,
          },
        ]}
      />

      <H3>Switching providers per stage</H3>
      <p>
        Run interactive work on a frontier model, then dispatch a cheap or local
        model for bulk steps — without rebuilding the client.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `agent = Harnext(provider="anthropic", model="claude-opus-4-8")

# Heavy reasoning on the default model
plan = agent.run("Plan the migration")

# Mechanical edits on a local model
agent.run("Apply the rename across the repo", provider="ollama", model="llama3.2")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const agent = new Harnext({ provider: "anthropic", model: "claude-opus-4-8" });

// Heavy reasoning on the default model
const plan = await agent.run("Plan the migration");

// Mechanical edits on a local model
await agent.run("Apply the rename across the repo", {
  provider: "ollama",
  model: "llama3.2",
});`,
          },
        ]}
      />

      <H2>Listing providers & models</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import providers

providers.list()                 # ["anthropic", "openai", "ollama", ...]
providers.models("anthropic")    # ["claude-opus-4-8", "claude-sonnet-4-6", ...]
providers.default("anthropic")   # recommended model id`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { providers } from "@harnext/sdk";

providers.list();                // ["anthropic", "openai", "ollama", ...]
await providers.models("anthropic");
providers.default("anthropic");  // recommended model id`,
          },
        ]}
      />

      <H3>Generation parameters</H3>
      <p>
        Pass model parameters through <code>params</code>; unknown keys are
        forwarded to the provider untouched.
      </p>
      <CodeBlock
        lang="python"
        code={`agent.run(
    "Draft the release notes",
    params={"temperature": 0.2, "max_tokens": 2000},
)`}
      />

      <Callout type="tip" title="Local-first">
        Pointing at <code>ollama</code>, <code>vllm</code>, or{" "}
        <code>llamacpp</code> keeps your code on your machine — no tokens leave
        the host. The agent&apos;s tool surface is identical regardless of
        provider.
      </Callout>
    </DocPage>
  );
}
