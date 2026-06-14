import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/nav";
import { LogoSymbol } from "@/components/landing/icons";
import { Footer } from "@/components/landing/sections";
import { Callout, Card, CardGroup, H2, H3 } from "@/components/docs/mdx";
import { GoalLoop } from "@/components/blog/goal-loop";
import { getPost } from "@/lib/blog";

const post = getPost("goal-mode-evaluator-loop")!;

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
              <h1>Goal mode: the evaluator loop inside harnext</h1>
              <p className="post-lede">
                Type <code>/goal</code> and harnext stops being a single agent. A
                smart model plans the work and grades every result; a faster
                executor does the hands-on coding. Here&apos;s how that
                planner–generator–evaluator loop works — and which models to drop
                into each seat.
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
              <H2>One agent has a ceiling</H2>
              <p>
                A normal harnext run is a single agent: one model reads the code,
                decides what to do, writes the edit, runs it, and judges whether
                it&apos;s finished — all in one context window. It is both the
                author and the reviewer of its own work. For a quick fix, that&apos;s
                exactly what you want.
              </p>
              <p>
                On a longer, multi-step task it&apos;s also where things drift. The
                model loses the thread of its original plan, marks a half-finished
                step &quot;done,&quot; or carries a subtle regression forward because
                nothing independent ever checked it. The author is too close to the
                work to catch its own mistakes.
              </p>
              <p>
                The fix isn&apos;t a bigger model. It&apos;s a second opinion —
                separating the hands that write the code from the eyes that review
                it.
              </p>

              <H2>The pattern: planner, generator, evaluator</H2>
              <p>
                That separation has a name. The{" "}
                <strong>planner–generator–evaluator</strong> pattern splits an
                agentic task into three roles, usually filled by two models:
              </p>
              <ul>
                <li>
                  <strong>Planner</strong> — breaks the task into a concrete,
                  ordered plan.
                </li>
                <li>
                  <strong>Generator</strong> (the executor) — does each step: reads
                  files, makes edits, runs commands.
                </li>
                <li>
                  <strong>Evaluator</strong> (the supervisor) — checks each result
                  against the plan and the goal. Pass, and the work moves on. Fail,
                  and it goes back with notes.
                </li>
              </ul>
              <p>
                People call this <em>GAN-inspired</em> for a reason. In a generative
                adversarial network, a generator proposes and a discriminator
                critiques, and the generator gets better precisely because it has to
                satisfy an adversary. Goal mode borrows the shape — not the training.
                The executor proposes a diff, the evaluator critiques it against the
                goal, and a rejected diff goes straight back for another pass. The
                pressure of an independent reviewer is what lifts quality, the same
                reason code review works on human teams.
              </p>
              <p>
                The planner and the evaluator are usually the <em>same</em> smart
                model wearing two hats. It wrote the plan, so it&apos;s the right
                judge of whether a step actually met it.
              </p>

              <H2>What /goal actually does</H2>
              <p>
                When a prompt starts with <code>/goal</code>, harnext runs the
                two-model loop instead of a single agent:
              </p>
              <ol>
                <li>
                  <strong>Plan.</strong> The smart model reads the task and turns it
                  into an ordered plan.
                </li>
                <li>
                  <strong>Delegate.</strong> Step by step, it hands work to the
                  executor.
                </li>
                <li>
                  <strong>Build.</strong> The executor reads, edits, and runs code in
                  the worktree to satisfy the step.
                </li>
                <li>
                  <strong>Evaluate.</strong> The smart model checks the result — the
                  diff — against the plan before it ever reaches you.
                </li>
                <li>
                  <strong>Loop.</strong> If the smart model rejects the result, it
                  goes back to the executor to fix, automatically. Only approved work
                  surfaces.
                </li>
              </ol>

              <GoalLoop />
              <p className="not-prose mt-2 text-[0.82rem] text-[var(--fg-4)]">
                The executor does the token-heavy work; the smart model is invoked at
                the edges — once to plan, then once per result to review.
              </p>

              <p>
                That division of labor matters. The executor does the grunt work —
                opening files, making edits, running tests — and burns most of the
                tokens. The smart model is invoked only at the edges: once to plan,
                then once per result to review. You see the diff after it has passed
                review, not before.
              </p>

              <H2>Tune it in harnext Desktop</H2>
              <p>
                In harnext Desktop the loop is yours to configure. Pick the model for
                the smart seat and the model for the executor seat independently —
                and because every call routes through the same provider layer, the
                two seats don&apos;t even have to be the same provider. Run Opus as
                the planner and a local model as the executor; pair a frontier
                reviewer with a cheap, fast coder; whatever fits the task and the
                budget.
              </p>
              <p>
                The two seats have genuinely different jobs, so they want different
                models.
              </p>

              <H2>Which models go where</H2>

              <H3>The smart seat — planner &amp; evaluator</H3>
              <p>
                This is the judgment seat. It decomposes the task and — more
                importantly — has to catch the bug the executor missed. That&apos;s
                the hardest job in the loop, and it&apos;s where a stronger model
                pays off most. Default to{" "}
                <strong>Claude Opus 4.8</strong> (<code>claude-opus-4-8</code>);
                reach for <strong>Claude Fable 5</strong> (<code>claude-fable-5</code>)
                on the hardest, longest-horizon tasks. Run it at high or x-high effort
                and give it the full goal up front — frontier models plan best when
                they can see the whole task at once. (Goal mode is essentially that
                advice turned into a feature.)
              </p>

              <H3>The executor seat — generator</H3>
              <p>
                This seat needs to be a strong, fast coder — but it works inside a
                tight spec the planner already wrote, with a reviewer backing it up,
                so it doesn&apos;t need to be the smartest model in the room.{" "}
                <strong>Claude Sonnet 4.6</strong> (<code>claude-sonnet-4-6</code>) is
                the sweet spot: quick, capable at edits and tool use, and a third of
                the planner&apos;s output price. For mechanical or high-volume edits,
                <strong> Claude Haiku 4.5</strong> (<code>claude-haiku-4-5</code>) — or
                a local model — drops the cost further.
              </p>

              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Fits the…</th>
                    <th>Context</th>
                    <th>Input / Output<br />($ per 1M tokens)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>claude-opus-4-8</code><br />Opus 4.8</td>
                    <td>Smart seat — default</td>
                    <td>1M</td>
                    <td>$5 / $25</td>
                  </tr>
                  <tr>
                    <td><code>claude-fable-5</code><br />Fable 5</td>
                    <td>Smart seat — hardest work</td>
                    <td>1M</td>
                    <td>$10 / $50</td>
                  </tr>
                  <tr>
                    <td><code>claude-sonnet-4-6</code><br />Sonnet 4.6</td>
                    <td>Executor — default</td>
                    <td>1M</td>
                    <td>$3 / $15</td>
                  </tr>
                  <tr>
                    <td><code>claude-haiku-4-5</code><br />Haiku 4.5</td>
                    <td>Executor — cheap / mechanical</td>
                    <td>200K</td>
                    <td>$1 / $5</td>
                  </tr>
                </tbody>
              </table>

              <H3>Why this split is cheaper than it looks</H3>
              <p>
                Counterintuitively, putting your most expensive model in the loop can
                lower the bill. The planner runs a handful of times — one plan, one
                review per step. The executor runs constantly and burns most of the
                tokens. Pair an expensive reviewer with a cheaper executor and you
                spend the premium only where judgment matters, while the bulk editing
                runs on the cheaper seat. A smart reviewer also fails fast: it catches
                a wrong turn at step two instead of letting the executor build three
                more steps on a broken foundation.
              </p>

              <Callout type="tip" title="Rule of thumb">
                Never make the evaluator weaker than the executor. A reviewer that
                can&apos;t out-think the coder just rubber-stamps bad diffs — and
                you&apos;ve paid for a loop that does nothing.
              </Callout>

              <H2>When to reach for /goal</H2>
              <ul>
                <li>
                  <strong>Multi-step, well-specified tasks</strong> — a migration, a
                  feature with clear acceptance criteria, a refactor that spans files.
                  The clearer the goal, the better the planner plans and the sharper
                  the evaluator&apos;s verdict.
                </li>
                <li>
                  <strong>Skip it for quick local edits.</strong> A one-line fix
                  doesn&apos;t need a plan-and-review loop; a single agent is faster
                  and cheaper.
                </li>
                <li>
                  <strong>Write the goal like a spec.</strong> &quot;Make it
                  faster&quot; gives the evaluator nothing to check. &quot;Cut p95
                  latency on <code>/search</code> below 200ms and keep every test
                  green&quot; gives it a finish line.
                </li>
              </ul>

              <H2>Keep going</H2>
              <CardGroup cols={2}>
                <Card title="Providers & models" href="/docs/sdk/providers">
                  Route any stage to any of 20+ providers — cloud or local — and
                  switch the model per step with a single argument.
                </Card>
                <Card
                  title="Planner–generator–evaluator, GAN-inspired"
                  href="https://www.mindstudio.ai/blog/planner-generator-evaluator-pattern-gan-inspired-ai-coding"
                >
                  The pattern behind goal mode, written up from first principles.
                  External read on MindStudio.
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
