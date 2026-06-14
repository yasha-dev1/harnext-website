import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/nav";
import { LogoSymbol } from "@/components/landing/icons";
import { Footer } from "@/components/landing/sections";
import { CodeBlock } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";
import { getPost } from "@/lib/blog";

const post = getPost("mid-run-steering")!;

export const metadata: Metadata = {
  title: `${post.title} · harnext`,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    type: "article",
  },
};

export default function Page() {
  return (
    <>
      <LogoSymbol />
      <Nav />
      <span id="top" />
      <main className="flex-1">
        <article className="post">
          <div className="container post-narrow">
            <header className="post-head">
              <p className="eyebrow"><span className="sq" /> {post.tag}</p>
              <h1>Steer the agent mid-run — no abort, no re-prompt</h1>
              <p className="post-lede">
                You&apos;re watching the agent head down the wrong path. You used to
                have one option: <code>Ctrl-C</code>, lose the run, and re-prompt from
                scratch. Now you just keep typing — your message queues while the agent
                generates and is injected at the next turn boundary.
              </p>
              <div className="post-meta">
                <span className="pm-author">{post.author}</span>
                <span>·</span>
                <span>{post.dateLabel}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </header>

            <div className="doc-prose post-body">
              <p>
                Mid-run steering lets you redirect the agent <em>while it is
                generating</em>, without aborting. It ships in two layers — the
                interactive REPL, and the headless{" "}
                <code>--input-format stream-json</code> path for SDK and automation use.
              </p>

              <H2>In the REPL: just keep typing</H2>
              <p>
                While the agent is working, the prompt stays live. Type a correction
                and press <code>⏎</code> — instead of starting a new run, it{" "}
                <strong>queues</strong>. The queued message shows as a dimmed{" "}
                <code>⋯ &lt;text&gt; · esc to edit</code> line just above the input.
                It&apos;s not in the agent&apos;s context yet — it&apos;s waiting for a
                safe moment.
              </p>

              <div className="not-prose my-6">
                <div className="term">
                  <div className="term-bar">
                    <span className="dot r" /><span className="dot y" /><span className="dot g" />
                    <span className="ttl">harnext</span>
                  </div>
                  <div className="term-body">
                    <div className="ln"><span className="pmt">❯</span> <span className="usr">Refactor the auth module to use async/await</span></div>
                    <div className="ln dim">⠹ working… <span className="faint">editing src/auth.ts</span></div>
                    <div className="ln">&nbsp;</div>
                    <div className="ln faint">⋯ Actually, keep the public API unchanged · esc to edit</div>
                    <div className="ln"><span className="pmt">❯</span> <span className="cursor" /></div>
                  </div>
                </div>
              </div>

              <p>
                When the agent reaches the next turn boundary, the queued message is
                injected and <strong>commits</strong> to the scrollback as a normal{" "}
                <code>❯</code> user message — exactly as if you&apos;d sent it there.
                Two more behaviors make it feel natural:
              </p>
              <ul>
                <li>
                  <strong>Esc-to-edit.</strong> Pressing <code>esc</code> on an{" "}
                  <em>empty</em> prompt peels the most recently queued message back into
                  the input so you can fix it, and re-syncs the queue — rather than
                  interrupting the run. A non-empty draft is never clobbered: there,{" "}
                  <code>esc</code> still interrupts.
                </li>
                <li>
                  <strong>Nothing lost silently.</strong> If a run ends (aborted,
                  errored, or hit max-turns) while messages are still queued, they
                  surface as a faint &quot;not delivered — resend if still needed&quot;
                  note and are cleared.
                </li>
              </ul>

              <H2>Headless: stream-json steering</H2>
              <p>
                The same capability is available to automation. With{" "}
                <code>--input-format stream-json</code>, harnext keeps{" "}
                <code>stdin</code> open and reads newline-delimited JSON user messages
                incrementally, instead of draining stdin into one prompt.
              </p>
              <CodeBlock
                lang="bash"
                code={`harnext -p --input-format stream-json --output-format stream-json`}
              />
              <CodeBlock
                lang="json"
                code={`// stdin — the first line starts the run:
{"type":"user","message":{"role":"user","content":"Refactor the auth module to use async/await"}}
// …while it's still working, send another line to steer it:
{"type":"user","message":{"role":"user","content":"Actually, keep the public API unchanged"}}`}
              />
              <p>The timing of each line decides what it does:</p>
              <ul>
                <li><strong>First message</strong> — starts the run.</li>
                <li><strong>Arrives while generating</strong> — injected as a steering message, delivered at the next turn boundary.</li>
                <li><strong>Arrives while idle</strong> — continues the session as a new turn.</li>
              </ul>
              <p>
                Output stays per-run for <code>text</code>, <code>json</code>, and{" "}
                <code>stream-json</code> — the streaming form emits one{" "}
                <code>init</code> envelope, then <code>assistant</code> /{" "}
                <code>user</code> / <code>result</code> envelopes.
              </p>
              <p>
                Driving it from code is just spawning that process and writing a line
                whenever you want to steer:
              </p>
              <CodeBlock
                lang="ts"
                code={`import { spawn } from 'node:child_process';

const child = spawn(
  'harnext',
  ['-p', '--input-format', 'stream-json', '--output-format', 'stream-json'],
  { stdio: ['pipe', 'pipe', 'inherit'] },
);

const send = (content: string) =>
  child.stdin.write(
    JSON.stringify({ type: 'user', message: { role: 'user', content } }) + '\\n',
  );

send('Refactor the auth module to use async/await'); // first line → starts the run
// …later, while it's still generating:
send('Actually, keep the public API unchanged');      // steers it mid-run`}
              />
              <p>
                The <a href="/docs/sdk/steering">docs</a> show the full version that
                reads the output envelopes to know when to steer and when the run is
                done.
              </p>
              <Callout type="tip" title="Runnable sample">
                <a href="https://github.com/QualityUnit/harnext/blob/main/examples/steering-client.mjs">
                  examples/steering-client.mjs
                </a>{" "}
                spawns the CLI, sends an initial multi-turn task, then steers it mid-run
                — a complete reference for wiring steering into your own client.
              </Callout>

              <H2>Read the docs</H2>
              <CardGroup cols={2}>
                <Card title="Mid-run steering" href="/docs/sdk/steering">
                  The REPL queue / commit / Esc-to-edit flow and the headless
                  stream-json message shape, semantics, and output envelopes.
                </Card>
                <Card
                  title="Implementation"
                  href="https://github.com/QualityUnit/harnext/pull/50"
                >
                  Mid-run steering landed in QualityUnit/harnext#50.
                </Card>
              </CardGroup>

              <hr />
              <p>
                <Link href="/blog">← All posts</Link>
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
