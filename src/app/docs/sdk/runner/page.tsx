import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock, CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Runner" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Runner"
      description="Register and manage a self-hosted GitHub Actions runner that executes pipeline stages on your own hardware."
    >
      <p>
        A self-hosted runner lets the harness run agent stages on a machine you
        control — your laptop, a build box, or a GPU host for local models. The{" "}
        <code>Runner</code> class installs it as a service, reports its health,
        and tears it down cleanly.
      </p>

      <H2>Install a runner</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import Runner

runner = Runner(repo=".")          # uses the repo's GitHub remote

runner.install(
    service="systemd",             # or "launchd" on macOS
    labels=["gpu"],                # extra labels in addition to the repo-pinned one
)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { Runner } from "@harnext/sdk";

const runner = new Runner({ repo: "." });   // uses the repo's GitHub remote

await runner.install({
  service: "systemd",             // or "launchd" on macOS
  labels: ["gpu"],                // extra labels in addition to the repo-pinned one
});`,
          },
        ]}
      />

      <Callout type="note" title="Idempotent by design">
        <code>install()</code> is safe to re-run — it skips work that&apos;s
        already done, so you can call it from provisioning scripts without
        guards.
      </Callout>

      <H2>Status & logs</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `status = runner.status()
status.active        # True
status.registered    # True
status.online        # visible to GitHub
status.labels        # ["self-hosted", "harnext-9f4ac1b", "gpu"]
status.jobs_24h      # {"picked_up": 18, "ok": 17, "failed": 1}

for line in runner.logs(follow=True):
    print(line)`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const status = await runner.status();
status.active;       // true
status.registered;   // true
status.online;       // visible to GitHub
status.labels;       // ["self-hosted", "harnext-9f4ac1b", "gpu"]
status.jobs24h;      // { pickedUp: 18, ok: 17, failed: 1 }

for await (const line of runner.logs({ follow: true })) {
  console.log(line);
}`,
          },
        ]}
      />

      <H3>Equivalent CLI</H3>
      <CodeBlock
        lang="bash"
        code={`harnext runner status
harnext runner logs --follow
harnext runner uninstall`}
      />

      <H2>Uninstall</H2>
      <p>
        Removal is best-effort and complete: it deregisters the runner from
        GitHub, stops and removes the service, and drops local artifacts.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `runner.uninstall()`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `await runner.uninstall();`,
          },
        ]}
      />

      <Callout type="warning" title="Public-repo guardrail">
        On public repositories, <code>install()</code> verifies that fork-PR
        approval gates are enabled before registering, so an untrusted PR
        can&apos;t execute on your hardware. Override only if you fully
        understand the exposure.
      </Callout>
    </DocPage>
  );
}
