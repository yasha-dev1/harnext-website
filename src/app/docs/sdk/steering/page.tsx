import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Mid-run steering" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Mid-run steering"
      description="Redirect the agent while it is generating — without aborting and re-prompting. Available in the interactive REPL and over headless stream-json."
    >
      <p>
        Steering lets you correct or add to a request <em>during</em> a run. Your
        message is queued while the agent generates and injected at the next turn
        boundary, so the agent picks it up cleanly instead of being interrupted. It
        works in two layers: the interactive REPL and the headless{" "}
        <code>--input-format stream-json</code> path.
      </p>

      <H2>Interactive REPL</H2>
      <p>
        While the agent is working, the prompt stays live — keep typing.
      </p>
      <H3>Queue while generating</H3>
      <p>
        Pressing <code>⏎</code> mid-run <strong>queues</strong> the message rather than
        starting a new prompt. It renders as a dimmed line just above the input and is{" "}
        <em>not</em> yet part of the agent&apos;s context:
      </p>
      <CodeBlock lang="text" code={`⋯ Actually, keep the public API unchanged · esc to edit`} />

      <H3>Commit on injection</H3>
      <p>
        When the agent reaches the next turn boundary, the queued message is injected
        and <strong>commits</strong> to the scrollback as a normal <code>❯</code> user
        message — exactly as though you had sent it at that point.
      </p>

      <H3>Esc-to-edit</H3>
      <ul>
        <li>
          <strong>Empty prompt.</strong> <code>esc</code> peels the most recently
          queued message back into the input for editing and re-syncs the queue —
          instead of interrupting the run.
        </li>
        <li>
          <strong>Non-empty draft.</strong> Your in-progress text is never clobbered;
          there, <code>esc</code> still interrupts the run as usual.
        </li>
      </ul>

      <H3>Undelivered messages</H3>
      <p>
        If a run ends — aborted, errored, or max-turns reached — while messages are
        still queued (never injected), they&apos;re surfaced as a faint &quot;not
        delivered — resend if still needed&quot; note and then cleared, so nothing is
        lost silently.
      </p>

      <H2>Headless: --input-format stream-json</H2>
      <p>
        For SDK and automation use, <code>harnext -p --input-format stream-json</code>{" "}
        keeps <code>stdin</code> open and reads newline-delimited JSON (NDJSON) user
        messages incrementally, rather than draining stdin into a single prompt.
      </p>
      <CodeBlock
        lang="bash"
        code={`harnext -p --input-format stream-json --output-format stream-json`}
      />

      <H3>Message shape</H3>
      <p>One JSON object per line:</p>
      <CodeBlock
        lang="json"
        code={`{"type":"user","message":{"role":"user","content":"Refactor the auth module to use async/await"}}`}
      />

      <H3>First vs. steer vs. idle</H3>
      <p>What a line does depends on when it arrives:</p>
      <ul>
        <li><strong>First message</strong> — starts the run.</li>
        <li>
          <strong>Arrives while the agent is generating</strong> — injected as a{" "}
          steering message, delivered at the next turn boundary.
        </li>
        <li><strong>Arrives while idle</strong> — continues the session as a new turn.</li>
      </ul>

      <H3>Output envelopes</H3>
      <p>
        Output is per-run for <code>text</code>, <code>json</code>, and{" "}
        <code>stream-json</code>. The <code>stream-json</code> form emits one{" "}
        <code>init</code> envelope, then a stream of <code>assistant</code>,{" "}
        <code>user</code>, and <code>result</code> envelopes.
      </p>

      <H3>Steering from the SDK (Node)</H3>
      <p>
        Programmatic steering is this same <code>stream-json</code> surface, driven
        from your own process: spawn the headless agent, write the first NDJSON line to
        start the run, then write another line mid-run to steer. Parse the output
        envelopes to know when the run is underway and when it&apos;s done.
      </p>
      <CodeBlock
        lang="ts"
        code={`import { spawn } from 'node:child_process';

// Headless agent: line-delimited JSON in, line-delimited JSON out.
const child = spawn(
  'harnext',
  ['-p', '--input-format', 'stream-json', '--output-format', 'stream-json'],
  { stdio: ['pipe', 'pipe', 'inherit'] },
);

const send = (content: string) =>
  child.stdin.write(
    JSON.stringify({ type: 'user', message: { role: 'user', content } }) + '\\n',
  );

// 1. The first line starts the run.
send('Refactor the auth module to use async/await');

// 2. Read the output envelopes and steer once the run is underway.
let steered = false;
let buf = '';
child.stdout.on('data', (chunk) => {
  buf += chunk;
  for (let nl; (nl = buf.indexOf('\\n')) !== -1; ) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    const evt = JSON.parse(line); // 'init' | 'assistant' | 'user' | 'result'

    // 3. Mid-run steer — delivered at the next turn boundary.
    if (evt.type === 'assistant' && !steered) {
      steered = true;
      send('Actually, keep the public API unchanged');
    }

    // 4. The run is finished.
    if (evt.type === 'result') child.stdin.end();
  }
});`}
      />
      <p>
        Sending a line while the agent is idle (after a <code>result</code>) continues
        the session as a new turn instead of steering — so the same loop drives a
        multi-turn conversation. A complete, runnable version lives at{" "}
        <a href="https://github.com/QualityUnit/harnext/blob/main/examples/steering-client.mjs">
          examples/steering-client.mjs
        </a>.
      </p>

      <Callout type="note" title="Source">
        Mid-run steering shipped in{" "}
        <a href="https://github.com/QualityUnit/harnext/pull/50">QualityUnit/harnext#50</a>,
        mirroring Claude Code&apos;s steering model. See the{" "}
        <a href="/blog/mid-run-steering">announcement post</a> for a walkthrough.
      </Callout>
    </DocPage>
  );
}
