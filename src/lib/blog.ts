export type BlogPost = {
  slug: string;
  title: string;
  /** Short summary used on the index and as the page description. */
  description: string;
  /** ISO 8601 date, e.g. "2026-06-14". */
  date: string;
  /** Display date, e.g. "June 14, 2026". */
  dateLabel: string;
  author: string;
  readingTime: string;
  tag: string;
};

/** Posts, newest first. The index page and each post route read from here. */
export const POSTS: BlogPost[] = [
  {
    slug: "goal-mode-evaluator-loop",
    title: "Goal mode: the evaluator loop inside harnext",
    description:
      "Type /goal and harnext stops being a single agent. A smart model plans the work and grades every result while a faster executor does the hands-on coding. Here's how that planner–generator–evaluator loop works — and which models to drop into each seat.",
    date: "2026-06-14",
    dateLabel: "June 14, 2026",
    author: "The harnext team",
    readingTime: "8 min read",
    tag: "Engineering",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
