import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Sessions & replays" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Sessions & replays"
      description="Every run is a durable, inspectable session. Resume to continue, replay to re-run step by step, export to share."
    >
      <p>
        Sessions are stored as plain JSON under <code>~/.harnext/sessions</code>{" "}
        (configurable via <code>HARNEXT_HOME</code>). A session captures the full
        message history, every tool call and result, token usage, and the
        metadata you attached.
      </p>

      <H2>Resuming a run</H2>
      <p>
        Pass a session id (or a <code>Session</code> object) to the{" "}
        <code>session</code> option, and the new run continues with the entire
        prior context intact.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `first = agent.run("Scaffold a FastAPI app")
sid = first.session_id

# Later, in a different process:
agent2 = Harnext(provider="anthropic", session=sid)
agent2.run("Add a Dockerfile for it")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const first = await agent.run("Scaffold a FastAPI app");
const sid = first.sessionId;

// Later, in a different process:
const agent2 = new Harnext({ provider: "anthropic", session: sid });
await agent2.run("Add a Dockerfile for it");`,
          },
        ]}
      />

      <H2>The Session API</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import Session

# Discover and load
sessions = Session.list(limit=20)           # list[SessionInfo]
s = Session.load("sess_8f4ac1b")

# Inspect
s.id
s.created_at
s.messages        # full transcript
s.steps           # every tool call + result
s.usage           # aggregate token usage
s.metadata

# Share / archive
s.export("run.json")
s.delete()`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { Session } from "@harnext/sdk";

// Discover and load
const sessions = await Session.list({ limit: 20 });
const s = await Session.load("sess_8f4ac1b");

// Inspect
s.id;
s.createdAt;
s.messages;       // full transcript
s.steps;          // every tool call + result
s.usage;          // aggregate token usage
s.metadata;

// Share / archive
await s.export("run.json");
await s.delete();`,
          },
        ]}
      />

      <H2>Replays</H2>
      <p>
        A replay re-executes a recorded session step by step. By default it
        replays from the stored transcript (no model calls, no token cost) — ideal
        for audits, demos, and debugging. Pass <code>live=True</code> to re-run
        the same prompts against the model again.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `s = Session.load("sess_8f4ac1b")

for step in s.replay():               # deterministic re-run from the record
    print(step.tool, step.status)

# Re-run against the model from a chosen step
s.replay(live=True, from_step=3)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const s = await Session.load("sess_8f4ac1b");

for await (const step of s.replay()) {     // deterministic re-run from the record
  console.log(step.tool, step.status);
}

// Re-run against the model from a chosen step
await s.replay({ live: true, fromStep: 3 });`,
          },
        ]}
      />

      <H3>Fork a session</H3>
      <p>
        Branch from any point to explore an alternative without touching the
        original run.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `branch = s.fork(at_step=5)
agent = Harnext(provider="anthropic", session=branch)
agent.run("Try a different approach: use SQLModel instead")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const branch = await s.fork({ atStep: 5 });
const agent = new Harnext({ provider: "anthropic", session: branch });
await agent.run("Try a different approach: use Drizzle instead");`,
          },
        ]}
      />

      <Callout type="note" title="Where sessions live">
        Set <code>HARNEXT_HOME</code> to relocate the store (e.g. a per-project{" "}
        <code>.harnext</code> directory in CI). Transcripts redact known
        credential patterns; treat exported files as sensitive regardless.
      </Callout>

      <Callout type="tip" title="Resuming from the CLI or @harnext/core">
        Picking a run back up — <code>harnext --resume</code>, the{" "}
        <code>createAgentSession</code> resume options, the per-directory JSONL store,
        and session-management helpers — is covered in{" "}
        <a href="/docs/sdk/resume">Resuming sessions</a>.
      </Callout>
    </DocPage>
  );
}
