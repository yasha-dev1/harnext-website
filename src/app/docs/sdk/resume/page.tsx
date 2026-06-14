import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Resuming sessions" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Resuming sessions"
      description="Continue a previous conversation with its full context — interactively with the CLI's --resume flag, or programmatically through @harnext/core."
    >
      <p>
        Every harnext run is recorded as a durable transcript. Resuming seeds a new
        session with that prior history so the agent continues exactly where it left
        off — the plan, the files it read, the decisions you made together. This page
        covers the on-disk model, the CLI <code>--resume</code> flow, and the{" "}
        <code>@harnext/core</code> API for resuming and managing sessions.
      </p>

      <H2>Concepts</H2>
      <p>
        A <strong>session</strong> is the full message history of one run: user turns,
        assistant turns, and tool results, each kept as a complete{" "}
        <code>AgentMessage</code>. Transcripts are stored as append-only JSONL at:
      </p>
      <CodeBlock
        lang="bash"
        code={`~/.harnext/agent/sessions/<cwd-hash>/<sessionId>.jsonl`}
      />
      <ul>
        <li>
          <strong>Per-directory scoping.</strong> <code>&lt;cwd-hash&gt;</code> is{" "}
          <code>getProjectHash(absoluteCwd)</code> — the first 12 hex characters of a
          SHA-256 of the absolute working directory. Sessions belong to the project
          they ran in, so the picker only shows this directory&apos;s runs.
        </li>
        <li>
          <strong>Append-only.</strong> Each turn appends one line; the file is only
          rewritten when the agent replaces its history (compaction).
        </li>
        <li>
          <strong>Lossless.</strong> Full <code>AgentMessage</code> records are kept,
          not a flattened summary, so the API <code>usage</code> survives — that&apos;s
          what the resume flow reads to measure context size.
        </li>
        <li>
          <strong>Retention.</strong> harnext keeps the{" "}
          <code>DEFAULT_MAX_SESSIONS_PER_CWD</code> (100) most recent sessions per
          directory, pruning oldest-first as new transcripts are created.
        </li>
      </ul>

      <H2>CLI</H2>
      <H3>Pick from a list</H3>
      <p>
        <code>harnext --resume</code> (alias <code>-r</code>) opens an interactive
        picker of the current directory&apos;s sessions, newest first. Each row shows
        the first user message, a relative timestamp, the message count, and the
        model. Press enter to resume with full context.
      </p>
      <CodeBlock lang="bash" code={`harnext --resume`} />
      <p>
        On resume, the prior transcript is <strong>replayed into the terminal</strong>{" "}
        — user echoes, tool badges and output, rendered markdown — so you see the
        conversation rather than a blank screen.
      </p>

      <H3>Resume a specific session</H3>
      <CodeBlock
        lang="bash"
        code={`# Resume a known session id directly (skips the picker)
harnext --resume 3f9c1b2a

# Scripted resume in print mode
harnext -p --resume 3f9c1b2a "now add tests for it"`}
      />

      <H3>Summarize on threshold</H3>
      <p>
        When a resumed conversation is near the model&apos;s context window
        (<code>contextWindow − reserveTokens</code>), the CLI offers to compact it via
        the same <code>compactNow</code> pipeline a live session uses, and shows a
        before/after token estimate so you can see what was reclaimed.
      </p>

      <H2>SDK quickstart</H2>
      <p>
        <code>createAgentSession</code> accepts three resume-related options, in
        increasing order of control.
      </p>

      <H3>Resume by id</H3>
      <p>
        Load a transcript from harnext&apos;s local per-cwd store and continue under
        the same id.
      </p>
      <CodeBlock
        lang="ts"
        code={`import { createAgentSession } from '@harnext/core';

const { session, sessionId, resumed } = await createAgentSession({
  cwd: process.cwd(),
  resumeSessionId: '3f9c1b2a-…',
});

// resumed === true when prior history was seeded
await session.prompt('continue where we left off');`}
      />

      <H3>Resume by value</H3>
      <p>
        Supply the transcript yourself — useful when history lives in your own store.{" "}
        <code>initialMessages</code> takes precedence over <code>resumeSessionId</code>.
      </p>
      <CodeBlock
        lang="ts"
        code={`import { createAgentSession, type AgentMessage } from '@harnext/core';

const history: AgentMessage[] = [
  { role: 'user', content: 'build a CLI', timestamp: 1 },
  { role: 'assistant', content: [{ type: 'text', text: 'On it.' }], timestamp: 2 },
  {
    role: 'toolResult',
    toolCallId: 'c1',
    toolName: 'bash',
    content: [{ type: 'text', text: '…' }],
    isError: false,
    timestamp: 3,
  },
];

const { session } = await createAgentSession({ initialMessages: history });`}
      />

      <H3>Control the persisted id</H3>
      <p>
        Pass <code>sessionId</code> alongside <code>initialMessages</code> to dictate
        the id the continued session persists under.
      </p>
      <CodeBlock
        lang="ts"
        code={`const { session } = await createAgentSession({
  initialMessages: history,
  sessionId: 'my-id',
});`}
      />

      <Callout type="note" title="createAgentSession resume options">
        <ul className="m-0 list-disc pl-4">
          <li>
            <code>resumeSessionId?: string</code> — load the stored transcript by id
            and continue under it.
          </li>
          <li>
            <code>initialMessages?: AgentMessage[]</code> — seed history directly.
            Takes precedence over <code>resumeSessionId</code>.
          </li>
          <li>
            <code>sessionId?: string</code> — stable id the continued session persists
            under.
          </li>
        </ul>
        Result: <code>{`{ session, sessionId, resumed, diagnostics }`}</code> —{" "}
        <code>sessionId</code> is the resolved id (persist it to resume later) and{" "}
        <code>resumed</code> is <code>true</code> when prior history was seeded.
      </Callout>

      <H2>Managing sessions</H2>
      <p>
        <code>@harnext/core</code> exports the helpers you need to build a custom
        picker or do housekeeping.
      </p>
      <CodeBlock
        lang="ts"
        code={`import {
  listSessions,
  loadSession,
  deleteSession,
  pruneSessions,
  getSessionFilePath,
  getCwdSessionsDir,
} from '@harnext/core';

// Newest-first summaries for the current directory
const sessions = listSessions(process.cwd());
for (const s of sessions) {
  console.log(s.firstUserMessage, s.messageCount, s.model, s.updatedAt);
}

// Load a full transcript (id-only lookup also works)
const stored = loadSession(sessions[0].sessionId);

// Housekeeping
deleteSession(process.cwd(), sessions[0].sessionId);
pruneSessions(process.cwd());        // enforce the per-cwd cap`}
      />
      <p>
        <code>SessionSummary</code> carries{" "}
        <code>
          {`{ sessionId, firstUserMessage, messageCount, model, provider, createdAt, updatedAt, filePath }`}
        </code>{" "}
        — everything a picker row needs.
      </p>

      <Callout type="tip" title="System prompt vs. history">
        The system message is configured separately from the conversation. Set it via{" "}
        <code>systemPrompt</code> (full override) or <code>appendSystemPrompt</code> —
        do <strong>not</strong> add it as a turn in <code>initialMessages</code>.
      </Callout>

      <H2>Storage format reference</H2>
      <p>
        A transcript is JSONL: the first line is a <code>session-meta</code> record,
        and every subsequent line is one <code>AgentMessage</code>. This is enough to
        read — or write — a transcript by hand.
      </p>
      <CodeBlock
        lang="json"
        code={`{"type":"session-meta","version":1,"sessionId":"3f9c1b2a","cwd":"/home/me/projects/api","model":"claude-opus-4-8","provider":"anthropic","createdAt":1718370000000}
{"role":"user","content":"Add rate limiting to the search endpoint","timestamp":1718370001000}
{"role":"assistant","content":[{"type":"text","text":"On it."}],"model":"claude-opus-4-8","usage":{"input_tokens":1820,"output_tokens":42},"timestamp":1718370002000}
{"role":"toolResult","toolCallId":"c1","toolName":"bash","content":[{"type":"text","text":"…"}],"isError":false,"timestamp":1718370003000}`}
      />
      <p>
        Write your own recorder with <code>createSessionWriter(opts)</code>, whose{" "}
        <code>record(messages)</code> appends at each turn boundary. The package also
        exports the <code>SESSION_FILE_VERSION</code> and{" "}
        <code>DEFAULT_MAX_SESSIONS_PER_CWD</code> constants and the{" "}
        <code>StoredSession</code>, <code>StoredSessionMeta</code>,{" "}
        <code>SessionSummary</code>, <code>SessionWriter</code>, and{" "}
        <code>AgentMessage</code> types (re-exported so callers don&apos;t depend on{" "}
        <code>pi-agent-core</code> directly).
      </p>

      <H2>Turning a read-only restore into a live session</H2>
      <p>
        A desktop or web client that has loaded a transcript for display can make it
        editable again by seeding a fresh session with the same messages and id:
      </p>
      <CodeBlock
        lang="ts"
        code={`import { createAgentSession, loadSession } from '@harnext/core';

const stored = loadSession(sessionId, cwd);

const { session } = await createAgentSession({
  initialMessages: stored.messages,
  sessionId: stored.sessionId,   // continue persisting under the same id
});

// The previously read-only conversation is now live
await session.prompt('keep going');`}
      />

      <Callout type="note" title="Source">
        Resumable sessions shipped via{" "}
        <a href="https://github.com/QualityUnit/harnext/issues/44">QualityUnit/harnext#44</a>{" "}
        (feature request) and{" "}
        <a href="https://github.com/QualityUnit/harnext/pull/46">#46</a>{" "}
        (implementation). See the{" "}
        <a href="/blog/resumable-sessions">announcement post</a> for a walkthrough.
      </Callout>
    </DocPage>
  );
}
