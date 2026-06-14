import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/nav";
import Reveal from "@/components/landing/reveal";
import { LogoSymbol } from "@/components/landing/icons";
import { Footer } from "@/components/landing/sections";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog · harnext",
  description:
    "Notes from the team building harnext and the open-source Context Engine — how the harness works, the patterns inside it, and how to get the most out of your coding agents.",
};

export default function BlogIndex() {
  return (
    <>
      <LogoSymbol />
      <Nav />
      <span id="top" />
      <main className="flex-1">
        <section className="blog-head">
          <div className="container">
            <Reveal>
              <p className="eyebrow"><span className="sq" /> Blog · built in the open</p>
              <h1>Notes from inside<br /><span className="l2">the harness.</span></h1>
              <p className="lede">
                How harnext works under the hood, the patterns we build it on, and
                practical ways to get more out of the coding agents you run on it.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="blog-wrap">
          <div className="container">
            <Reveal>
              <div className="bloglist">
                {POSTS.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
                    <div className="pc-tags">
                      <span className="pc-tag">{post.tag}</span>
                      <span>{post.dateLabel}</span>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <span className="pc-more">Read the post →</span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
