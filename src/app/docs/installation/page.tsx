import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock, CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Installation" };

export default function Page() {
  return (
    <DocPage
      eyebrow="Get started"
      title="Installation"
      description="Install the Harnext SDK for Python or TypeScript and point it at a model provider."
    >
      <H2>Requirements</H2>
      <ul>
        <li>
          <strong>Python:</strong> 3.10 or newer.
        </li>
        <li>
          <strong>TypeScript / Node.js:</strong> Node 20.9+ (the SDK ships ESM
          and CommonJS builds with bundled type definitions).
        </li>
        <li>
          An API key for at least one provider, or a local model server such as
          Ollama.
        </li>
      </ul>

      <H2>Install</H2>
      <CodeTabs
        tabs={[
          { lang: "bash", label: "Python (pip)", code: `pip install harnext` },
          { lang: "bash", label: "Python (uv)", code: `uv add harnext` },
          {
            lang: "bash",
            label: "TypeScript (npm)",
            code: `npm install @harnext/sdk`,
          },
          {
            lang: "bash",
            label: "TypeScript (pnpm)",
            code: `pnpm add @harnext/sdk`,
          },
        ]}
      />

      <Callout type="note" title="One distribution, two entry points">
        The Python package <code>harnext</code> provides both the{" "}
        <code>harnext</code> CLI and the importable SDK. In Node, the CLI lives
        in the <code>harnext</code> package and the library API in{" "}
        <code>@harnext/sdk</code>. Both speak to the same agent core.
      </Callout>

      <H2>Authentication</H2>
      <p>
        The SDK reads provider credentials from environment variables by default,
        matching the names each provider already uses. Set the key for the
        provider you intend to use:
      </p>
      <CodeBlock
        lang="bash"
        filename=".env"
        code={`# Pick the provider(s) you use
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...

# Optional: defaults for every client in this environment
HARNEXT_PROVIDER=anthropic
HARNEXT_MODEL=claude-opus-4-8`}
      />
      <p>
        You can also pass a key explicitly when constructing a client — see{" "}
        <a href="/docs/sdk/client">Client &amp; configuration</a>. Local
        providers like Ollama need no key; see{" "}
        <a href="/docs/sdk/providers">Providers &amp; models</a>.
      </p>

      <H2>Verify your install</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import Harnext, __version__

print("harnext", __version__)
agent = Harnext(provider="anthropic")
print(agent.run("Reply with the single word: ready").text)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { Harnext, version } from "@harnext/sdk";

console.log("harnext", version);
const agent = new Harnext({ provider: "anthropic" });
console.log((await agent.run("Reply with the single word: ready")).text);`,
          },
        ]}
      />

      <H3>CLI check (optional)</H3>
      <p>
        If you also installed the CLI, confirm both share the same core version:
      </p>
      <CodeBlock lang="bash" code={`harnext --version\nharnext doctor   # checks providers, keys, and runner health`} />

      <Callout type="warning" title="Keep keys out of source control">
        Never hard-code API keys. Load them from the environment or a secrets
        manager. The SDK never logs key material, and{" "}
        <a href="/docs/sdk/sessions">session transcripts</a> redact credentials
        passed through tool calls.
      </Callout>
    </DocPage>
  );
}
