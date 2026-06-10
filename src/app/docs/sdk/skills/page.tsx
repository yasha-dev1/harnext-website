import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeBlock, CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Skills" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Skills"
      description="Package reusable prompts, tools, and instructions into named skills the agent can invoke on demand."
    >
      <p>
        A skill is a self-contained bundle of instructions (and optionally extra
        tools) that the agent can call by name through the <code>skill</code>{" "}
        tool. harnext ships a few built-ins — <code>review</code>,{" "}
        <code>init</code>, <code>browser-verify</code> — and you can add your own.
      </p>

      <H2>Loading skills</H2>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `agent = Harnext(
    provider="anthropic",
    skills=["review", "browser-verify"],   # built-ins by name
)

# The agent can now call them
agent.run("/review")
agent.run("Verify the login flow in the browser and attach a screenshot")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const agent = new Harnext({
  provider: "anthropic",
  skills: ["review", "browser-verify"],   // built-ins by name
});

// The agent can now call them
await agent.run("/review");
await agent.run("Verify the login flow in the browser and attach a screenshot");`,
          },
        ]}
      />

      <H2>Custom skills</H2>
      <p>
        A skill is a directory with a <code>skill.md</code> manifest. The
        front-matter declares its name and when to use it; the body is the
        instruction the agent loads when the skill is invoked.
      </p>
      <CodeBlock
        lang="text"
        filename="skills/changelog/skill.md"
        code={`---
name: changelog
description: Generate a changelog entry from the staged diff.
when_to_use: After implementing a change, before opening a PR.
---

Read the staged diff with \`git diff --cached\`. Summarize user-facing
changes under Added / Changed / Fixed. Write the entry to CHANGELOG.md
under a new "## Unreleased" heading if one does not exist.`}
      />

      <H3>Registering a skill directory</H3>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `agent = Harnext(provider="anthropic")

agent.skills.add("./skills/changelog")     # from a directory
agent.skills.list()                        # ["changelog", ...]

agent.run("/changelog")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const agent = new Harnext({ provider: "anthropic" });

await agent.skills.add("./skills/changelog");   // from a directory
agent.skills.list();                            // ["changelog", ...]

await agent.run("/changelog");`,
          },
        ]}
      />

      <H3>Defining a skill inline</H3>
      <p>
        For quick, code-defined skills you can register one without a directory:
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import skill

triage = skill(
    name="triage",
    description="Label and prioritize a bug report.",
    instructions="Read the issue, assign a severity, and suggest an owner.",
)

agent = Harnext(provider="anthropic", skills=[triage])`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { skill } from "@harnext/sdk";

const triage = skill({
  name: "triage",
  description: "Label and prioritize a bug report.",
  instructions: "Read the issue, assign a severity, and suggest an owner.",
});

const agent = new Harnext({ provider: "anthropic", skills: [triage] });`,
          },
        ]}
      />

      <Callout type="note" title="Skills vs. tools">
        A <a href="/docs/sdk/tools">tool</a> is a single function the model can
        call. A skill is a reusable <em>procedure</em> — instructions that may
        orchestrate several tools toward an outcome. Use a tool for a capability,
        a skill for a workflow.
      </Callout>
    </DocPage>
  );
}
