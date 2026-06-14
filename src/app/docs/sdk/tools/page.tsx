import type { Metadata } from "next";
import { DocPage } from "@/components/docs/doc-page";
import { CodeTabs } from "@/components/docs/code";
import { Callout, H2, H3 } from "@/components/docs/mdx";

export const metadata: Metadata = { title: "Tools" };

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK"
      title="Tools"
      description="The six built-in tools that make up the whole agent — plus how to add your own typed tools."
    >
      <p>
        harnext keeps an intentionally tiny tool surface. These six tools are the
        entire executor; everything the agent does, it does through them.
      </p>

      <H2>Built-in tools</H2>
      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Does</th>
            <th>Side effects</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>read</code></td>
            <td>Read a file (or a slice of one) under <code>cwd</code>.</td>
            <td>None</td>
          </tr>
          <tr>
            <td><code>write</code></td>
            <td>Create or overwrite a file.</td>
            <td>Filesystem</td>
          </tr>
          <tr>
            <td><code>edit</code></td>
            <td>Apply a targeted find/replace edit to a file.</td>
            <td>Filesystem</td>
          </tr>
          <tr>
            <td><code>bash</code></td>
            <td>Run a shell command in <code>cwd</code>.</td>
            <td>Shell</td>
          </tr>
          <tr>
            <td><code>skill</code></td>
            <td>Invoke a loaded <a href="/docs/sdk/skills">skill</a> by name.</td>
            <td>Varies</td>
          </tr>
          <tr>
            <td><code>mcp</code></td>
            <td>Call a tool exposed by a connected <a href="/docs/sdk/mcp">MCP server</a>.</td>
            <td>Varies</td>
          </tr>
        </tbody>
      </table>

      <Callout type="note" title="Beyond the basics">
        <code>bash</code> can run long commands in the background — see{" "}
        <a href="/docs/sdk/background-jobs">Background jobs</a> for{" "}
        <code>run_in_background</code>, <code>bash_output</code>, and{" "}
        <code>kill_shell</code>. To send images to the model, see{" "}
        <a href="/docs/sdk/images">Image input</a>.
      </Callout>

      <H3>Selecting tools</H3>
      <p>
        Pass the <code>tools</code> option to enable a subset. A read-only agent,
        for example, omits <code>write</code>, <code>edit</code>, and{" "}
        <code>bash</code>:
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `reader = Harnext(provider="anthropic", tools=["read"])
reader.run("Explain what src/auth.py does")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const reader = new Harnext({ provider: "anthropic", tools: ["read"] });
await reader.run("Explain what src/auth.ts does");`,
          },
        ]}
      />

      <H2>Custom tools</H2>
      <p>
        Give the agent new capabilities by wrapping a function as a tool. The
        SDK derives the schema from your type hints (Python) or a Zod/JSON
        schema (TypeScript), and the agent can call it like any built-in.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import Harnext, tool

@tool(description="Look up a customer by id")
def get_customer(id: str) -> dict:
    """Returns the customer record, or None if not found."""
    return db.customers.get(id)

@tool(description="Charge a customer in cents")
def charge(customer_id: str, amount_cents: int) -> dict:
    return billing.charge(customer_id, amount_cents)

agent = Harnext(
    provider="anthropic",
    tools=["read", "edit", get_customer, charge],
)
agent.run("Refund the most recent charge for customer c_123")`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `import { Harnext, tool } from "@harnext/sdk";
import { z } from "zod";

const getCustomer = tool({
  name: "get_customer",
  description: "Look up a customer by id",
  parameters: z.object({ id: z.string() }),
  execute: async ({ id }) => db.customers.get(id),
});

const charge = tool({
  name: "charge",
  description: "Charge a customer in cents",
  parameters: z.object({ customerId: z.string(), amountCents: z.number().int() }),
  execute: async ({ customerId, amountCents }) => billing.charge(customerId, amountCents),
});

const agent = new Harnext({
  provider: "anthropic",
  tools: ["read", "edit", getCustomer, charge],
});
await agent.run("Refund the most recent charge for customer c_123");`,
          },
        ]}
      />

      <Callout type="note" title="Schema inference">
        In Python, parameter names, type hints, and the docstring become the tool
        schema; use <code>typing.Annotated</code> to add per-argument
        descriptions. In TypeScript, the <code>parameters</code> schema is the
        single source of truth and fully types the <code>execute</code> argument.
      </Callout>

      <H3>Returning rich results</H3>
      <p>
        A tool can return a string, a JSON-serializable object, or a structured{" "}
        <code>ToolResult</code> to control what the model sees and mark success
        or failure.
      </p>
      <CodeTabs
        tabs={[
          {
            lang: "python",
            label: "Python",
            code: `from harnext import tool, ToolResult

@tool(description="Run the test suite")
def run_tests(path: str = ".") -> ToolResult:
    proc = subprocess.run(["pytest", path], capture_output=True, text=True)
    return ToolResult(
        output=proc.stdout,
        is_error=proc.returncode != 0,
    )`,
          },
          {
            lang: "ts",
            label: "TypeScript",
            code: `const runTests = tool({
  name: "run_tests",
  description: "Run the test suite",
  parameters: z.object({ path: z.string().default(".") }),
  execute: async ({ path }) => {
    const { stdout, exitCode } = await sh("pytest", [path]);
    return { output: stdout, isError: exitCode !== 0 };
  },
});`,
          },
        ]}
      />

      <H3>Approving tool calls</H3>
      <p>
        Custom tools respect the client&apos;s{" "}
        <a href="/docs/sdk/client">permission mode</a>. In <code>manual</code>{" "}
        mode, your <code>on_permission</code> callback receives the tool name and
        arguments before the call runs, so you can gate destructive operations.
      </p>

      <Callout type="warning" title="Tools run real code">
        A custom tool executes whatever you put in it with the model deciding the
        arguments. Validate inputs, scope credentials narrowly, and prefer{" "}
        <code>manual</code> permission mode for anything that moves money, data,
        or infrastructure.
      </Callout>
    </DocPage>
  );
}
