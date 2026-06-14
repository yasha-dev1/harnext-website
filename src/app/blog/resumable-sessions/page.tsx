import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/nav";
import { LogoSymbol } from "@/components/landing/icons";
import { Footer } from "@/components/landing/sections";
import { CodeBlock } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";
import { getPost } from "@/lib/blog";

const post = getPost("resumable-sessions")!;

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
              <h1>Resume any harnext conversation — from the CLI or the SDK</h1>
              <p className="post-lede">
                harnext sessions used to end and take their context with them.
                Now every run is a durable, per-directory transcript you can pick
                back up — interactively with <code>harnext --resume</code>, or
                programmatically through <code>@harnext/core</code>.
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
              <H2>The problem: context died with the process</H2>
              <p>
                Close the terminal, finish a script, restart a crashed run — and the
                whole conversation was gone. The agent forgot the plan, the files it
                had already read, the decisions you&apos;d made together. harnext
                Desktop felt it most acutely; it shipped with a blunt caveat:
              </p>
              <blockquote>
                Core has no session-resume API yet — restored conversations are
                read-only; start a new chat to continue working.
              </blockquote>
              <p>
                That&apos;s fixed. harnext now records every run as a durable
                transcript and gives you two first-class ways to continue one: the{" "}
                <code>--resume</code> flag on the CLI, and resume options on{" "}
                <code>createAgentSession</code> in the SDK.
              </p>

              <H2>harnext --resume</H2>
              <p>
                Run <code>harnext --resume</code> (or <code>-r</code>) in any project
                and you get an interactive picker of that directory&apos;s past
                sessions, newest first. Each row shows the first thing you asked, how
                long ago it was, the message count, and the model — enough to find the
                one you want at a glance.
              </p>

              <div className="not-prose my-6">
                <div className="term">
                  <div className="term-bar">
                    <span className="dot r" /><span className="dot y" /><span className="dot g" />
                    <span className="ttl">~/projects/api — harnext --resume</span>
                  </div>
                  <div className="term-body">
                    <div className="ln"><span className="pmt">$</span> <span className="usr">harnext --resume</span></div>
                    <div className="ln faint">Resume a session in ~/projects/api · 3 found</div>
                    <div className="ln">&nbsp;</div>
                    <div className="ln"><span className="pmt">❯</span> Add rate limiting to the search endpoint <span className="dim">· 14m ago · 28 msgs · opus-4-8</span></div>
                    <div className="ln faint">&nbsp;&nbsp; Wire up the Stripe webhook handler · 2h ago · 41 msgs · sonnet-4-6</div>
                    <div className="ln faint">&nbsp;&nbsp; Scaffold the FastAPI app · yesterday · 63 msgs · opus-4-8</div>
                    <div className="ln">&nbsp;</div>
                    <div className="ln dim">↑/↓ to choose · ↵ to resume · esc to cancel</div>
                  </div>
                </div>
              </div>

              <p>
                Hit enter and the prior transcript replays into the terminal — your
                messages, the tool badges and their output, the rendered markdown — so
                you land back in the conversation instead of staring at a blank prompt.
                Already know the id? Skip the picker:
              </p>
              <CodeBlock
                lang="bash"
                code={`# Pick from a list
harnext --resume

# Resume a specific session directly
harnext --resume 3f9c1b2a

# Scripted resume in print mode
harnext -p --resume 3f9c1b2a "now add tests for it"`}
              />

              <H2>How it&apos;s stored</H2>
              <p>
                Sessions are append-only JSONL transcripts under{" "}
                <code>~/.harnext/agent/sessions/&lt;cwd-hash&gt;/&lt;sessionId&gt;.jsonl</code>.
                The <code>&lt;cwd-hash&gt;</code> is derived from the absolute working
                directory, so sessions are <strong>scoped per project</strong> — the
                picker only ever shows runs from the directory you&apos;re standing in.
                The first line is a <code>session-meta</code> record; every line after
                it is one full agent message. Because the full message is kept (not a
                lossy summary), the API <code>usage</code> survives — which is exactly
                what the resume flow reads to measure how full the context window is.
                harnext keeps the 100 most recent sessions per directory and prunes the
                oldest as new ones appear.
              </p>

              <H2>The SDK angle</H2>
              <p>
                <code>@harnext/core</code> exposes the same capability with more
                control. The simplest path is to resume by id from harnext&apos;s local
                store:
              </p>
              <CodeBlock
                lang="ts"
                code={`import { createAgentSession } from '@harnext/core';

const { session, sessionId, resumed } = await createAgentSession({
  cwd: process.cwd(),
  resumeSessionId: '3f9c1b2a-…',
});

await session.prompt('continue where we left off');`}
              />
              <p>
                Or hold the transcript yourself and hand it back — useful when the
                history lives in your own database, not on the local disk.{" "}
                <code>initialMessages</code> takes precedence over{" "}
                <code>resumeSessionId</code>, and pairing it with an explicit{" "}
                <code>sessionId</code> controls the id the continued run persists under:
              </p>
              <CodeBlock
                lang="ts"
                code={`import { createAgentSession, type AgentMessage } from '@harnext/core';

const history: AgentMessage[] = await loadFromMyDatabase(userId);

const { session } = await createAgentSession({
  initialMessages: history,  // full control over the seeded context
  sessionId: 'my-id',        // and the id it continues under
});`}
              />
              <Callout type="note" title="System prompt vs. history">
                The system message is <em>not</em> a turn in{" "}
                <code>initialMessages</code> — set it with <code>systemPrompt</code>{" "}
                (full override) or <code>appendSystemPrompt</code>. Resume seeds the{" "}
                conversation; the system prompt is configured separately.
              </Callout>

              <H2>Long conversations: summarize on the way back in</H2>
              <p>
                Resume a conversation that&apos;s already near the model&apos;s context
                window and harnext offers to compact it first — running the same
                <code> compactNow</code> pipeline a live session uses, with a
                before/after token estimate so you can see what it reclaimed. You pick
                up where you left off without immediately blowing the budget.
              </p>

              <H2>What this unblocks</H2>
              <p>
                The most immediate beneficiary is harnext Desktop: a restored
                conversation is no longer read-only. Seed it with{" "}
                <code>initialMessages</code> and its original <code>sessionId</code>,
                and a viewed transcript becomes a live one you can keep working in. The
                next step is moving the &quot;list sessions by working directory&quot;
                surface to the cloud so the same history follows you across machines.
              </p>

              <H2>Read the docs</H2>
              <CardGroup cols={2}>
                <Card title="Resuming sessions" href="/docs/sdk/resume">
                  The full guide: CLI resume, the SDK API, session management, and the
                  on-disk transcript format.
                </Card>
                <Card
                  title="Feature request & PR"
                  href="https://github.com/QualityUnit/harnext/issues/44"
                >
                  Background in QualityUnit/harnext#44; the implementation landed in
                  #46.
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
