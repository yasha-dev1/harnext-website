import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/nav";
import { LogoSymbol } from "@/components/landing/icons";
import { Footer } from "@/components/landing/sections";
import { CodeBlock } from "@/components/docs/code";
import { Callout, Card, CardGroup, H2 } from "@/components/docs/mdx";
import { getPost } from "@/lib/blog";

const post = getPost("image-input")!;

export const metadata: Metadata = {
  title: `${post.title} · harnext`,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    type: "article",
  },
};

export default function Page() {
  return (
    <>
      <LogoSymbol />
      <Nav />
      <span id="top" />
      <main className="flex-1">
        <article className="post">
          <div className="container post-narrow">
            <header className="post-head">
              <p className="eyebrow"><span className="sq" /> {post.tag}</p>
              <h1>Multimodal input: paste an image with Ctrl+V, or pass a URL from the SDK</h1>
              <p className="post-lede">
                harnext now takes images. In the terminal, press <code>Ctrl+V</code> to
                attach whatever&apos;s on your clipboard. In the SDK, hand{" "}
                <code>session.prompt()</code> a URL, a <code>data:</code> URI, a file
                path, or raw base64 — harnext fetches and encodes the rest.
              </p>
              <div className="post-meta">
                <span className="pm-author">{post.author}</span>
                <span>·</span>
                <span>{post.dateLabel}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </header>

            <div className="doc-prose post-body">
              <H2>Ctrl+V in the terminal</H2>
              <p>
                Copy a screenshot, a design mock, a diagram — then press{" "}
                <code>Ctrl+V</code> at the prompt. harnext grabs the image from the
                system clipboard, base64-encodes it, and attaches it to your next
                message. A <code>🖼 N</code> chip in the footer shows how many images
                are pending, and image-only prompts (no text) are allowed, so you can
                just paste and hit enter.
              </p>

              <div className="not-prose my-6">
                <div className="term">
                  <div className="term-bar">
                    <span className="dot r" /><span className="dot y" /><span className="dot g" />
                    <span className="ttl">harnext</span>
                  </div>
                  <div className="term-body">
                    <div className="ln dim">[Ctrl+V] attached screenshot.png · 1 image pending</div>
                    <div className="ln">&nbsp;</div>
                    <div className="ln"><span className="pmt">❯</span> <span className="usr">why is this layout broken on mobile?</span></div>
                    <div className="ln">&nbsp;</div>
                    <div className="ln faint">main · 🖼 1 · ⚙ 0 Background Jobs</div>
                  </div>
                </div>
              </div>

              <p>
                It&apos;s cross-platform: <code>xclip</code> / <code>wl-paste</code> on
                Linux, <code>pngpaste</code> / <code>pbpaste</code> on macOS, PowerShell
                on Windows. If the clipboard holds text instead of an image,{" "}
                <code>Ctrl+V</code> pastes the text as usual. If no clipboard tool is
                installed, you get a one-time hint on how to install one — never a
                silent failure.
              </p>

              <H2>Images from the SDK</H2>
              <p>
                Programmatically, <code>session.prompt()</code> takes an optional second
                argument: a list of images. Each one can be an http(s) URL, a{" "}
                <code>data:</code> URI, a local file path, or an already-encoded base64
                block — mix and match freely.
              </p>
              <CodeBlock
                lang="ts"
                code={`import { createAgentSession, type ImageInput } from '@harnext/core';

const { session } = await createAgentSession({ provider, modelId });

await session.prompt('describe this', [
  { url: 'https://example.com/cat.png' },                    // http(s) → fetched
  'data:image/png;base64,iVBORw0KGgo…',                      // data: URI
  '/path/to/local.jpg',                                      // file path → read
  { type: 'image', data: '<b64>', mimeType: 'image/png' },   // raw base64
]);`}
              />
              <p>
                Under the hood, <code>resolveImages()</code> fetches URLs, reads files,
                decodes data URIs, and normalizes everything to base64 with a resolved
                MIME type — because pi-ai transports base64 only, and each provider
                transform emits the shape its API expects. There&apos;s a{" "}
                <code>MAX_IMAGE_BYTES</code> cap (20&nbsp;MB) so an oversized image fails
                loudly rather than at the provider.
              </p>
              <Callout type="note" title="Exports">
                <code>@harnext/core</code> exports <code>resolveImages</code>,{" "}
                <code>resolveImage</code>, the <code>ImageInput</code> and{" "}
                <code>ImageContent</code> types, and the <code>MAX_IMAGE_BYTES</code>{" "}
                constant — so you can resolve and validate images yourself before
                prompting.
              </Callout>

              <H2>Read the docs</H2>
              <CardGroup cols={2}>
                <Card title="Image input" href="/docs/sdk/images">
                  The <code>ImageInput</code> forms, <code>resolveImages</code>, MIME
                  resolution, the size cap, and the Ctrl+V clipboard flow per OS.
                </Card>
                <Card
                  title="Implementation"
                  href="https://github.com/QualityUnit/harnext/pull/48"
                >
                  Multimodal input landed in QualityUnit/harnext#48.
                </Card>
              </CardGroup>

              <hr />
              <p>
                <Link href="/blog">← All posts</Link>
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
