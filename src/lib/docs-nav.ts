export type NavItem = {
  title: string;
  href: string;
  /** Optional short label shown as a pill (e.g. "Python · TS"). */
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const docsNav: NavGroup[] = [
  {
    title: "Get started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quickstart", href: "/docs/quickstart" },
      { title: "Context Engine", href: "/docs/context-engine" },
    ],
  },
  {
    title: "SDK",
    items: [
      { title: "Introduction", href: "/docs/sdk" },
      { title: "Overview", href: "/docs/sdk/overview" },
      { title: "Client & configuration", href: "/docs/sdk/client" },
      { title: "Running the agent", href: "/docs/sdk/running-agents" },
      { title: "Mid-run steering", href: "/docs/sdk/steering" },
      { title: "Tools", href: "/docs/sdk/tools" },
      { title: "Background jobs", href: "/docs/sdk/background-jobs" },
      { title: "Image input", href: "/docs/sdk/images" },
      { title: "Custom sandbox (Docker)", href: "/docs/sdk/sandbox" },
      { title: "Sessions & replays", href: "/docs/sdk/sessions" },
      { title: "Resuming sessions", href: "/docs/sdk/resume" },
      { title: "Providers & models", href: "/docs/sdk/providers" },
      { title: "Skills", href: "/docs/sdk/skills" },
      { title: "MCP servers", href: "/docs/sdk/mcp" },
      { title: "Harness & pipelines", href: "/docs/sdk/harness" },
      { title: "Runner", href: "/docs/sdk/runner" },
      { title: "API reference", href: "/docs/sdk/reference" },
    ],
  },
];

/** Flat, ordered list of every page — drives the prev/next pager. */
export const flatNav: NavItem[] = docsNav.flatMap((group) => group.items);

export function pagerFor(pathname: string): {
  prev: NavItem | null;
  next: NavItem | null;
} {
  const index = flatNav.findIndex((item) => item.href === pathname);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? flatNav[index - 1] : null,
    next: index < flatNav.length - 1 ? flatNav[index + 1] : null,
  };
}
