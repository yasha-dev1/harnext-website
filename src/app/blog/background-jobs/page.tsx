import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/nav";
import { LogoSymbol } from "@/components/landing/icons";
import { Footer } from "@/components/landing/sections";
import { CodeBlock } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";
import { getPost } from "@/lib/blog";

const post = getPost("background-jobs")!;

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
              <h1>Background jobs: run dev servers and watch builds without blocking the agent</h1>
              <p className="post-lede">
                A dev server, a watch build, a slow install — anything that
                doesn&apos;t return used to freeze the whole run. Now the{" "}
                <code>bash</code> tool can launch it in the background, hand back a
                shell id immediately, and keep working while it runs.
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
              <H2>The blocking problem</H2>
              <p>
                Some commands are supposed to never finish. <code>npm run dev</code>,{" "}
                <code>vite</code>, <code>tail -f</code>, a test runner in watch mode —
                start one in the foreground and the agent sits there, blocked, until
                you kill it. The workaround was always hacky: background the process
                with <code>&amp;</code> and lose its output, or redirect to a file and
                poll it by hand.
              </p>

              <H2>run_in_background → bash_output → kill_shell</H2>
              <p>
                The <code>bash</code> tool now takes <code>run_in_background: true</code>.
                Instead of blocking, it returns a shell id (<code>bash_1</code>,{" "}
                <code>bash_2</code>, …) right away, and the agent moves on. Two
                companion tools manage the job from there:
              </p>
              <ul>
                <li>
                  <strong><code>bash_output</code></strong> — cursor-based incremental
                  reads, so each call returns only what&apos;s new since the last one.
                  An optional regex <code>filter</code> narrows the output to the lines
                  that matter.
                </li>
                <li>
                  <strong><code>kill_shell</code></strong> — stops a background job by
                  id.
                </li>
              </ul>
              <CodeBlock
                lang="bash"
                code={`# start it — returns immediately with a shell id
bash(run_in_background: true)  →  "started bash_1: npm run dev"

# read only what's new, optionally filtered
bash_output(bash_1, filter: "Local:|error")  →  "  ➜  Local:  http://localhost:3000/"

# stop it when you're done
kill_shell(bash_1)  →  "bash_1 terminated"`}
              />

              <H2>Where the output goes</H2>
              <p>
                Each job&apos;s output is buffered in memory <em>and</em> tee&apos;d to a
                per-job log file at{" "}
                <code>~/.harnext/projects/&lt;hash&gt;/bg-shells/&lt;id&gt;.log</code>,
                so nothing is lost between reads. Background shells are{" "}
                <code>SIGTERM</code>&apos;d when the session exits — no orphaned dev
                servers hanging around. Prefer the old always-blocking behavior? Set{" "}
                <code>HARNEXT_DISABLE_BACKGROUND_TASKS=1</code> and{" "}
                <code>run_in_background</code> is ignored.
              </p>

              <H2>Watch them live in the CLI</H2>
              <p>
                Interactively, a <code>⚙ N Background Jobs</code> chip sits in the
                footer next to the git branch. Press <strong>↓</strong> on an empty
                prompt to focus it and <strong>⏎</strong> to open a live,
                auto-refreshing viewer (or just run <code>/bashes</code>). Inside,{" "}
                <code>k</code> kills the selected job and <code>←</code>/<code>esc</code>{" "}
                goes back. Completion notices print above the prompt as jobs finish.
              </p>

              <div className="not-prose my-6">
                <div className="term">
                  <div className="term-bar">
                    <span className="dot r" /><span className="dot y" /><span className="dot g" />
                    <span className="ttl">harnext — /bashes</span>
                  </div>
                  <div className="term-body">
                    <div className="ln dim">Background jobs · 2 running</div>
                    <div className="ln">&nbsp;</div>
                    <div className="ln"><span className="pmt">❯</span> <span className="badge bash">bash_1</span> npm run dev <span className="ok">· running</span> <span className="dim">· :3000</span></div>
                    <div className="ln faint">&nbsp;&nbsp; <span className="badge bash">bash_2</span> vitest --watch · running · 42 passed</div>
                    <div className="ln">&nbsp;</div>
                    <div className="ln dim">  ➜  Local:  http://localhost:3000/</div>
                    <div className="ln dim">  ✓  ready in 612 ms</div>
                    <div className="ln">&nbsp;</div>
                    <div className="ln faint">↑/↓ select · ⏎ open · k kill · ←/esc back</div>
                  </div>
                </div>
              </div>

              <H2>Read the docs</H2>
              <CardGroup cols={2}>
                <Card title="Background jobs" href="/docs/sdk/background-jobs">
                  The three tools, the log-file location, the env flag, and the
                  interactive viewer in full.
                </Card>
                <Card
                  title="Implementation"
                  href="https://github.com/QualityUnit/harnext/pull/45"
                >
                  Background shells landed in QualityUnit/harnext#45.
                </Card>
              </CardGroup>

              <Callout type="tip" title="Pairs well with sandboxing">
                Background jobs route through the same <a href="/docs/sdk/sandbox">command
                executor</a> as foreground <code>bash</code>, so they run inside your
                Docker sandbox too — no extra wiring.
              </Callout>

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
