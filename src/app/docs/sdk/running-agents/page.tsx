import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Running the agent" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Running the agent"
      description="Execute tasks with run(), observe them with stream(), handle events, and cancel cleanly."
    >
      <H2>run()</H2>
      <p>
        <code>run()</code> executes the full agent loop and returns a{" "}
        <code>RunResult</code> once the task finishes. It&apos;s the simplest way
        to get an answer or apply a change.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `result = agent.run("Add pagination to GET /users")

result.text            # final assistant message
result.steps           # list[ToolStep]
result.files_changed   # ["src/routes/users.py"]
result.usage           # Usage(input_tokens=..., output_tokens=...)
result.session_id      # "sess_8f4ac1b"
result.success         # True`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const result = await agent.run("Add pagination to GET /users");

result.text;           // final assistant message
result.steps;          // ToolStep[]
result.filesChanged;   // ["src/routes/users.ts"]
result.usage;          // { inputTokens, outputTokens, totalTokens }
result.sessionId;      // "sess_8f4ac1b"
result.success;        // true`,
          },
        ]}
      />

      <H3>Messages and structured output</H3>
      <p>
        Pass a string for a single user turn, or a list of messages for finer
        control. Request structured output by passing a schema; the result&apos;s{" "}
        <code>output</code> is validated against it.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from pydantic import BaseModel

class Review(BaseModel):
    risk: str
    summary: str

result = agent.run(
    "Review the diff on this branch",
    output_schema=Review,
)
print(result.output.risk)   # typed, validated`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { z } from "zod";

const Review = z.object({ risk: z.string(), summary: z.string() });

const result = await agent.run("Review the diff on this branch", {
  outputSchema: Review,
});
console.log(result.output.risk); // typed, validated`,
          },
        ]}
      />

      <H2>stream()</H2>
      <p>
        <code>stream()</code> yields events as the agent works. Python returns a
        generator; TypeScript returns an <code>AsyncIterable</code>. The final
        event is always <code>run_end</code>, which carries the same{" "}
        <code>RunResult</code> you&apos;d get from <code>run()</code>.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `stream = agent.stream("Migrate the config loader to TOML")

for event in stream:
    if event.type == "thinking":
        pass  # model reasoning, if exposed by the provider
    elif event.type == "text":
        print(event.text, end="", flush=True)
    elif event.type == "tool_call":
        print(f"\\n⏺ {event.tool}", event.args)
    elif event.type == "tool_result":
        print("  ↳", event.status)
    elif event.type == "run_end":
        result = event.result`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const stream = agent.stream("Migrate the config loader to TOML");

for await (const event of stream) {
  switch (event.type) {
    case "text":
      process.stdout.write(event.text);
      break;
    case "tool_call":
      console.log("\\n⏺", event.tool, event.args);
      break;
    case "tool_result":
      console.log("  ↳", event.status);
      break;
    case "run_end":
      var result = event.result;
      break;
  }
}`,
          },
        ]}
      />

      <H2>Event types</H2>
      <p>Every streamed event has a <code>type</code> discriminator:</p>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Payload</th>
            <th>Emitted when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>run_start</code></td>
            <td><code>session_id</code></td>
            <td>The loop begins.</td>
          </tr>
          <tr>
            <td><code>thinking</code></td>
            <td><code>text</code></td>
            <td>The model emits reasoning (provider-dependent).</td>
          </tr>
          <tr>
            <td><code>text</code></td>
            <td><code>text</code></td>
            <td>A chunk of the assistant&apos;s reply streams in.</td>
          </tr>
          <tr>
            <td><code>tool_call</code></td>
            <td><code>tool</code>, <code>args</code>, <code>id</code></td>
            <td>The model invokes a tool.</td>
          </tr>
          <tr>
            <td><code>tool_result</code></td>
            <td><code>id</code>, <code>status</code>, <code>output</code></td>
            <td>A tool finishes.</td>
          </tr>
          <tr>
            <td><code>permission_request</code></td>
            <td><code>tool</code>, <code>args</code></td>
            <td>A call needs approval in <code>manual</code> mode.</td>
          </tr>
          <tr>
            <td><code>usage</code></td>
            <td><code>input_tokens</code>, <code>output_tokens</code></td>
            <td>Token accounting updates.</td>
          </tr>
          <tr>
            <td><code>run_end</code></td>
            <td><code>result</code></td>
            <td>The loop completes — final event.</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>error</code></td>
            <td>A non-recoverable error ends the run.</td>
          </tr>
        </tbody>
      </table>

      <H2>Cancellation</H2>
      <p>
        Stop a run early without losing the partial session. Python accepts a{" "}
        <code>cancel</code> token or a <code>KeyboardInterrupt</code>; TypeScript
        accepts an <code>AbortSignal</code>.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import CancelToken

cancel = CancelToken()
# ... call cancel.cancel() from another thread / signal handler

result = agent.run("Long refactor", cancel=cancel)
if result.cancelled:
    print("stopped at step", len(result.steps))`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const controller = new AbortController();
setTimeout(() => controller.abort(), 30_000);

const result = await agent.run("Long refactor", {
  signal: controller.signal,
});
if (result.cancelled) console.log("stopped at step", result.steps.length);`,
          },
        ]}
      />

      <Callout type="tip" title="Async Python">
        For <code>asyncio</code>, use <code>await agent.arun(...)</code> and{" "}
        <code>async for event in agent.astream(...)</code>. The event shapes are
        identical to the synchronous API.
      </Callout>
    </DocPage>
  );
}
