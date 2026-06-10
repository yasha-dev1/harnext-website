import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock, CodeTabs } from "@/components/docs/code";
import { Callout, H2, Step, Steps } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Quickstart" };

export default function Page() {
  return (
    <DocPage
      eyebrow="Get started"
      title="Quickstart"
      description="Build, run, and stream your first agent in under five minutes — then resume the session and inspect what it did."
    >
      <Steps>
        <Step title="Create a client">
          <p>
            A client binds a provider and model to a working directory. The
            agent&apos;s file tools operate relative to <code>cwd</code>.
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
    cwd="./my-repo",
)`,
              },
              {
                lang: "ts",
                label: "TypeScript",
                code: `import { Harnext } from "@harnext/sdk";

const agent = new Harnext({
  provider: "anthropic",
  model: "claude-opus-4-8",
  cwd: "./my-repo",
});`,
              },
            ]}
          />
        </Step>

        <Step title="Run a task">
          <p>
            <code>run()</code> executes the full agent loop and resolves once the
            task is complete. The result carries the final message, the tool
            steps, token usage, and the files that changed.
          </p>
          <CodeTabs
            tabs={[
              {
                lang: "python",
                label: "Python",
                code: `result = agent.run("Add a /health route that returns 200 OK")

print(result.text)
print("changed:", result.files_changed)
print("tokens:", result.usage.total_tokens)`,
              },
              {
                lang: "ts",
                label: "TypeScript",
                code: `const result = await agent.run("Add a /health route that returns 200 OK");

console.log(result.text);
console.log("changed:", result.filesChanged);
console.log("tokens:", result.usage.totalTokens);`,
              },
            ]}
          />
        </Step>

        <Step title="Stream the work live">
          <p>
            Use <code>stream()</code> to observe the agent as it thinks and calls
            tools — ideal for CLIs, logs, and progress UIs.
          </p>
          <CodeTabs
            tabs={[
              {
                lang: "python",
                label: "Python",
                code: `for event in agent.stream("Refactor auth into its own module"):
    if event.type == "text":
        print(event.text, end="", flush=True)
    elif event.type == "tool_call":
        print(f"\\n→ {event.tool}({event.args})")`,
              },
              {
                lang: "ts",
                label: "TypeScript",
                code: `for await (const event of agent.stream("Refactor auth into its own module")) {
  if (event.type === "text") process.stdout.write(event.text);
  else if (event.type === "tool_call") console.log(\`\\n→ \${event.tool}\`, event.args);
}`,
              },
            ]}
          />
        </Step>

        <Step title="Resume the session">
          <p>
            Every run is saved. Re-open it by id to continue with full context —
            no need to repeat the history.
          </p>
          <CodeTabs
            tabs={[
              {
                lang: "python",
                label: "Python",
                code: `sid = result.session_id

follow_up = Harnext(provider="anthropic", session=sid)
follow_up.run("Now add tests for the new module")`,
              },
              {
                lang: "ts",
                label: "TypeScript",
                code: `const sid = result.sessionId;

const followUp = new Harnext({ provider: "anthropic", session: sid });
await followUp.run("Now add tests for the new module");`,
              },
            ]}
          />
        </Step>
      </Steps>

      <H2>Run it in one shot</H2>
      <p>
        Prefer the terminal? The same task runs from the CLI, and the SDK can
        read back the session it produces.
      </p>
      <CodeBlock
        lang="bash"
        code={`harnext -p "Add a /health route that returns 200 OK" --provider anthropic`}
      />

      <Callout type="tip" title="Next steps">
        Continue with the <a href="/docs/sdk/overview">SDK overview</a> for the full
        client surface, or jump to <a href="/docs/sdk/tools">Tools</a> to give
        the agent custom capabilities.
      </Callout>
    </DocPage>
  );
}
