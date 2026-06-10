import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock, CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Harness & pipelines" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Harness & pipelines"
      description="Generate the staged GitHub Actions pipeline from code — the same harness the CLI's setup command produces."
    >
      <p>
        The harness turns a GitHub repo into a pipeline where labels drive an
        agent from issue to merged PR. Each stage is a label; promoting a label
        triggers the next workflow. The <code>Harness</code> class builds those
        workflows programmatically.
      </p>

      <H2>Building a pipeline</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import Harness

harness = Harness(repo=".", provider="anthropic")

harness.setup(
    stages=["triage", "plan", "implement", "review"],
    runner="self-hosted",          # or "github"
    default_branch="main",
)

harness.write()                    # writes .github/workflows/*.yml + labels`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { Harness } from "@harnext/sdk";

const harness = new Harness({ repo: ".", provider: "anthropic" });

await harness.setup({
  stages: ["triage", "plan", "implement", "review"],
  runner: "self-hosted",           // or "github"
  defaultBranch: "main",
});

await harness.write();             // writes .github/workflows/*.yml + labels`,
          },
        ]}
      />

      <H2>Customizing stages</H2>
      <p>
        Add, reorder, or rewrite stages before writing. Each stage maps to a
        label, a prompt, and the agent settings used when it runs.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `harness.add_stage(
    "security",
    after="review",
    prompt="Run a security review of the diff; block on high-severity findings.",
    provider="anthropic",
    permission_mode="plan",
)

harness.set_stage("implement", max_turns=60)
harness.remove_stage("triage")

harness.write()`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `harness.addStage("security", {
  after: "review",
  prompt: "Run a security review of the diff; block on high-severity findings.",
  provider: "anthropic",
  permissionMode: "plan",
});

harness.setStage("implement", { maxTurns: 60 });
harness.removeStage("triage");

await harness.write();`,
          },
        ]}
      />

      <H3>Previewing without writing</H3>
      <p>
        Render the workflow files in memory to inspect or diff them in CI before
        committing.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `files = harness.render()           # dict[path, contents]
for path, contents in files.items():
    print(path)

print(harness.diff())              # vs. what's currently on disk`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const files = harness.render();    // Record<path, contents>
for (const path of Object.keys(files)) console.log(path);

console.log(harness.diff());       // vs. what's currently on disk`,
          },
        ]}
      />

      <H3>Generated workflow</H3>
      <p>A stage workflow looks like this — one per stage label:</p>
      <CodeBlock
        lang="yaml"
        filename=".github/workflows/stage-implement.yml"
        code={`name: stage-implement
on:
  issues:
    types: [labeled]
jobs:
  run:
    if: github.event.label.name == 'stage:implement'
    runs-on: [self-hosted, harnext-9f4ac1b]
    steps:
      - uses: actions/checkout@v4
      - run: npm i -g harnext
      - run: harnext -p "Implement issue #\${{ github.event.issue.number }}"
      - run: gh issue edit \${{ github.event.issue.number }}
              --remove-label stage:implement
              --add-label    stage:review`}
      />

      <Callout type="note" title="Same output as the CLI">
        <code>Harness().setup().write()</code> produces exactly what{" "}
        <code>harnext setup</code> writes. Use the CLI for a one-off; use the SDK
        when pipeline generation is itself part of an automated workflow.
      </Callout>
    </DocPage>
  );
}
