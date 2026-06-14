import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Background jobs" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Background jobs"
      description="Run shell commands that never return — dev servers, watch builds, long installs — without blocking the agent."
    >
      <p>
        The <code>bash</code> tool can launch a command in the background, returning a
        shell id immediately instead of waiting for it to finish. Two companion tools —{" "}
        <code>bash_output</code> and <code>kill_shell</code> — read its output and stop
        it. This is the right tool for anything long-lived: a dev server, a file
        watcher, a test runner in watch mode, a slow install.
      </p>

      <H2>The three tools</H2>
      <H3>bash — run_in_background</H3>
      <p>
        Pass <code>run_in_background: true</code> to <code>bash</code>. It starts the
        command and returns a shell id (<code>bash_1</code>, <code>bash_2</code>, …)
        right away; the agent continues without blocking.
      </p>
      <CodeBlock
        lang="text"
        code={`bash(command: "npm run dev", run_in_background: true)
→ "started bash_1"`}
      />

      <H3>bash_output</H3>
      <p>
        Read what a background job has produced. Reads are{" "}
        <strong>cursor-based</strong> — each call returns only the output appended since
        the previous read, so polling a chatty job stays cheap. An optional regex{" "}
        <code>filter</code> keeps only matching lines.
      </p>
      <CodeBlock
        lang="text"
        code={`bash_output(shell_id: "bash_1")
→ new output since the last read

bash_output(shell_id: "bash_1", filter: "Local:|error|warning")
→ only lines matching the regex`}
      />

      <H3>kill_shell</H3>
      <p>Terminate a background job by id.</p>
      <CodeBlock lang="text" code={`kill_shell(shell_id: "bash_1")
→ "bash_1 terminated"`} />

      <H2>Output &amp; lifecycle</H2>
      <ul>
        <li>
          <strong>Buffered everywhere.</strong> Output is held in memory and tee&apos;d
          to a per-job log file at{" "}
          <code>~/.harnext/projects/&lt;hash&gt;/bg-shells/&lt;id&gt;.log</code>, so
          nothing is lost between <code>bash_output</code> reads.
        </li>
        <li>
          <strong>Cleaned up on exit.</strong> Background shells are{" "}
          <code>SIGTERM</code>&apos;d when the session ends — no orphaned processes.
        </li>
        <li>
          <strong>Toggle.</strong> Set{" "}
          <code>HARNEXT_DISABLE_BACKGROUND_TASKS=1</code> to make every command block as
          before; <code>run_in_background</code> is then ignored.
        </li>
      </ul>

      <Callout type="tip" title="Background shells route through the executor">
        Both foreground <code>bash</code> and background shells run through the same{" "}
        <a href="/docs/sdk/sandbox">command executor</a>, so they execute inside a Docker
        sandbox when one is configured — and a custom tool set no longer silently
        disables them.
      </Callout>

      <H2>The interactive viewer</H2>
      <p>
        In the interactive CLI, a <code>⚙ N Background Jobs</code> chip sits in the
        footer beside the git branch. To open the viewer:
      </p>
      <ul>
        <li>Press <strong>↓</strong> on an empty prompt to focus the chip, then <strong>⏎</strong> to open it — or run <code>/bashes</code>.</li>
        <li>The viewer auto-refreshes with live output. <code>k</code> kills the selected job; <code>←</code> or <code>esc</code> goes back.</li>
        <li>Completion notices print above the prompt as jobs finish, so you don&apos;t have to watch the viewer to know a build is done.</li>
      </ul>

      <Callout type="note" title="Source">
        Background shells shipped in{" "}
        <a href="https://github.com/QualityUnit/harnext/pull/45">QualityUnit/harnext#45</a>.
        See the <a href="/blog/background-jobs">announcement post</a> for a walkthrough.
      </Callout>
    </DocPage>
  );
}
